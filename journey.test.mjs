import test from 'node:test';import assert from 'node:assert/strict';import {sectionFor,recordsForChat,chatPayload,messageForAnswer} from './journey.mjs';
test('message citation stays bound to the question that produced its answer',()=>{
 const messages=[{role:'user',text:'Yesterday I had a headache, 3/5, and slept 6 hours.'},{role:'assistant',text:'Review this entry.'},{role:'user',text:'Today I feel tired.'},{role:'assistant',text:'How are you feeling?'}];
 assert.equal(messageForAnswer(messages,1),messages[0].text);
 assert.equal(messageForAnswer(messages,3),messages[2].text);
 assert.equal(messageForAnswer(messages,-1),null);
 assert.equal(messageForAnswer(messages,10),null);
});
test('legacy routes retain their grouped destination',()=>{for(const r of ['records','tracking','insights'])assert.equal(sectionFor(r),'health');assert.equal(sectionFor('companion'),'today');assert.equal(sectionFor('visits'),'visit');});
test('scoped report excludes unrelated records, journal and history',()=>{const state={records:[{id:'a'},{id:'b'}],observations:[{note:'unrelated'}],messages:[{role:'user',text:'old'}]};const p=chatPayload(state,'Explain','b');assert.deepEqual(p.context,{records:[{id:'b'}],observations:[]});assert.deepEqual(p.history,[]);assert.deepEqual(recordsForChat(state.records,'gone'),[]);assert.equal(chatPayload(state,'General').context.observations.length,1);});
