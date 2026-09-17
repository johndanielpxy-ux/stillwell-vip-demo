(async()=>{
 const results=[];const check=(name,ok)=>{results.push({name,pass:!!ok});if(!ok)throw Error(name)};
 const click=s=>{const el=document.querySelector(s);if(!el)throw Error('Missing '+s);el.click()};
 const fill=(s,value)=>{const el=document.querySelector(s);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))};
 const wait=async fn=>{for(let n=0;n<80;n++){if(fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Wait timed out')};
 const realFetch=window.fetch;let requests=[];let failNext=false;
 window.fetch=async(url,opts)=>{if(String(url).includes('/api/'))requests.push({url:String(url),body:opts?.body?JSON.parse(opts.body):null});if(failNext&&String(url).endsWith('/chat')){failNext=false;await new Promise(r=>setTimeout(r,300));throw Error('Test connection failure')}return realFetch(url,opts)};
 try{
 click('nav [data-route=overview]');
 click('[data-action=ai-settings]');fill('[name=code]','ux-test');document.querySelector('#ai-code-form').requestSubmit();
 click('.journey-option[data-action=upload]');click('[data-action=sample-import]');await wait(()=>document.querySelector('#live-import-form'));
 check('sample enters actual extract endpoint',requests.some(r=>r.url.endsWith('/extract')&&r.body.text.includes('12.8')));
 fill('[name=value-0]','12.7');fill('[name=title]','<img src=x onerror="window.titleInjected=true">');document.querySelector('#live-import-form').requestSubmit();
 click('[data-record]');check('record title rendered as text',!document.querySelector('.modal-heading img')&&!window.titleInjected);
 click('[data-ask-record]');check('record prompt carried into composer',document.querySelector('#chat-form textarea').value.startsWith('Help me understand'));
 fill('#chat-form textarea','Explain this report');document.querySelector('#chat-form').requestSubmit();await wait(()=>!document.querySelector('.ai-progress')&&document.querySelector('[data-citation]'));
 const body=requests.filter(r=>r.url.endsWith('/chat')).at(-1).body;check('only selected report sent',body.context.records.length===1&&body.context.observations.length===0&&body.history.length===0);
 click('[data-citation]');check('source passage available',document.querySelector('.citation-quote')?.textContent.length>0);click('[data-action=close]');
 failNext=true;fill('#chat-form textarea','Retry this question');document.querySelector('#chat-form').requestSubmit();fill('#chat-form textarea','Keep my next draft');await wait(()=>document.querySelector('[data-action=retry-chat]'));
 check('failed request preserves newer draft',document.querySelector('#chat-form textarea').value==='Keep my next draft');
 const before=JSON.parse(localStorage.getItem('stillwell-demo-v1')).messages.filter(m=>m.role==='user').length;
 click('[data-action=retry-chat]');await wait(()=>!document.querySelector('.ai-progress')&&!document.querySelector('[data-action=retry-chat]'));
 check('retry preserves next-message draft',document.querySelector('#chat-form textarea').value==='Keep my next draft');
 check('retry does not duplicate user message',JSON.parse(localStorage.getItem('stillwell-demo-v1')).messages.filter(m=>m.role==='user').length===before);
 click('nav [data-route=records]');click('[data-action=upload]');click('[data-action=sample-import]');click('[data-action=close]');await new Promise(r=>setTimeout(r,1000));check('cancelled extraction does not reopen dialog',!document.querySelector('#dialog').open);
 return JSON.stringify(results);
 }finally{window.fetch=realFetch}
})()
