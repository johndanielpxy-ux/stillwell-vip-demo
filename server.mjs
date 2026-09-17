import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {timingSafeEqual} from 'node:crypto';
import {AppError,chat,extract} from './ai-service.mjs';
const root=dirname(fileURLToPath(import.meta.url));
const assets=new Map([['/','index.html'],['/index.html','index.html'],['/styles.css','styles.css'],['/app.mjs','app.mjs'],['/model.mjs','model.mjs'],['/live-client.mjs','live-client.mjs'],['/journey.mjs','journey.mjs']]);
const mime=file=>file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8';
const baseHeaders={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'same-origin','x-frame-options':'DENY'};
function json(res,status,body){res.writeHead(status,{...baseHeaders,'content-type':'application/json'});res.end(JSON.stringify(body));}
function authorised(req,code){let candidate=req.headers['x-demo-code'];if(typeof candidate!=='string'||!code)return false;let a=Buffer.from(candidate),b=Buffer.from(code);return a.length===b.length&&timingSafeEqual(a,b);}
async function bodyJSON(req,limit){let chunks=[],length=0;for await(let c of req){length+=c.length;if(length>limit)throw new AppError(413,'REQUEST_TOO_LARGE','This request is too large for the demo. Use fewer records or a file under 2 MB.');chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new AppError(400,'INVALID_JSON','The request could not be read.');}}
export function createApp({env=process.env,fetchImpl=fetch}={}){
 let requests=[],total=0;const options={key:env.OPENAI_API_KEY,model:env.OPENAI_MODEL||'gpt-4.1-mini',fetchImpl};
 const configured=!!(options.key&&env.DEMO_ACCESS_CODE);
 return http.createServer(async(req,res)=>{try{
  let url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/status'&&req.method==='GET')return json(res,200,{liveAvailable:configured,requiresCode:true,model:configured?options.model:null,service:'stillwell',version:'0.2.0'});
  if(url.pathname==='/healthz'&&req.method==='GET')return json(res,200,{ok:true});
  if(url.pathname==='/api/chat'||url.pathname==='/api/extract'){
   if(req.method!=='POST')return json(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Use POST.'}});
   if(!configured)throw new AppError(503,'LIVE_NOT_CONFIGURED','Live AI requires OPENAI_API_KEY and DEMO_ACCESS_CODE on the server. Prepared mode is still available.');
   if(!authorised(req,env.DEMO_ACCESS_CODE))throw new AppError(401,'ACCESS_CODE_REQUIRED','Enter the correct demo access code. This is not your OpenAI API key.');
   if(!String(req.headers['content-type']).startsWith('application/json'))throw new AppError(415,'JSON_REQUIRED','Send application/json.');
   const now=Date.now();requests=requests.filter(t=>now-t<60000);
   if(requests.length>=8||total>=Number(env.DEMO_MAX_REQUESTS||200))throw new AppError(429,'DEMO_LIMIT','This demo has reached its request limit. Please try later or use prepared mode.');
   const body=await bodyJSON(req,url.pathname==='/api/extract'?2900000:250000);
   requests.push(now);total++;
   const result=url.pathname==='/api/chat'?await chat(body,options):await extract(body,options);
   return json(res,200,result);
  }
  if(url.pathname.startsWith('/api/'))return json(res,404,{error:{code:'NOT_FOUND',message:'API route not found.'}});
  if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:{code:'METHOD_NOT_ALLOWED',message:'Method not allowed.'}});
  const file=assets.get(url.pathname);if(!file){res.writeHead(404,baseHeaders);return res.end('Not found');}
  const data=await readFile(resolve(root,file));res.writeHead(200,{...baseHeaders,'content-type':mime(file)});res.end(req.method==='HEAD'?undefined:data);
 }catch(error){if(res.headersSent)return res.end();if(error instanceof AppError)return json(res,error.status,{error:{code:error.code,message:error.message}});json(res,500,{error:{code:'SERVER_ERROR',message:'The request could not be completed. No information was saved.'}});}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||4174);createApp().listen(port,'0.0.0.0',()=>console.log(`Stillwell server listening on port ${port}; live AI ${process.env.OPENAI_API_KEY&&process.env.DEMO_ACCESS_CODE?'configured':'not configured'}.`));}
