let status={liveAvailable:false,requiresCode:true,model:null};
export async function discover(){if(location.hostname.endsWith('github.io'))return status;try{const r=await fetch('./api/status',{cache:'no-store'});if(r.ok)status=await r.json();}catch{}return status;}
export function getStatus(){return status;}
export function getCode(){return sessionStorage.getItem('stillwell-demo-code')||'';}
export function setCode(code){sessionStorage.setItem('stillwell-demo-code',code);}
export function mode(){return status.liveAvailable&&getCode()&&sessionStorage.getItem('stillwell-ai-mode')!=='prepared'?'live':'prepared';}
export function setMode(m){sessionStorage.setItem('stillwell-ai-mode',m);}
export async function api(path,body){let response;try{response=await fetch('./api/'+path,{method:'POST',headers:{'content-type':'application/json','x-demo-code':getCode()},body:JSON.stringify(body),signal:AbortSignal.timeout(52000)});}catch{throw new Error('The server could not be reached. Your journal has not changed. Retry or select prepared mode.');}let data;try{data=await response.json();}catch{throw new Error('This host is not running the Stillwell API server. Open the Render deployment for live AI.');}if(!response.ok)throw new Error(data.error?.message||'The AI request could not be completed.');return data;}
export function fileData(file){return new Promise((resolve,reject)=>{let r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
