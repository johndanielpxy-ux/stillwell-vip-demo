import test from 'node:test';import assert from 'node:assert/strict';
import {seed,addObservation,editObservation,removeObservation,stats,comparison,brief,parseDemo} from './model.mjs';
test('capture, correction and deletion propagate into brief and metrics',()=>{let s=seed();let count=stats(s).entries;s=addObservation(s,{id:'test',date:'2026-09-13',symptom:'Headache',severity:5,sleep:4,note:'Unique journal entry'});assert.equal(stats(s).entries,count+1);assert.match(brief(s),/Unique journal entry/);s=editObservation(s,'test',{severity:1,note:'Corrected entry'});assert.match(brief(s),/Corrected entry/);assert.doesNotMatch(brief(s),/Unique journal entry/);s=removeObservation(s,'test');assert.equal(stats(s).entries,count);assert.doesNotMatch(brief(s),/Corrected entry/);});
test('unknown severity and missing days are not zero',()=>{let s=seed();assert.equal(stats(s).days,12);s=addObservation(s,{date:'2026-09-06',symptom:'Fatigue',severity:null,sleep:null,note:'Unknown severity'});assert.equal(stats(s).days,12);assert.equal(comparison(s).reduce((n,g)=>n+g.count,0),12);});
test('empty state yields no pattern or invented average',()=>{let s={...seed(),observations:[]};assert.equal(stats(s).average,null);assert.ok(comparison(s).every(g=>g.average===null));});
test('demo parser preserves uncertainty and extracts only stated values',()=>{assert.equal(parseDemo('I have a headache').severity,null);assert.equal(parseDemo('Yesterday I had a headache, 3/5, and slept 6 hours').sleep,6);assert.equal(parseDemo('Should I change my medication?'),null);});
test('reset creates independent state',()=>{let a=seed();a.questions.pop();assert.equal(seed().questions.length,3);});
import {dailySeries} from './model.mjs';
test('daily chart averages repeated observations and leaves missing date absent',()=>{let s=addObservation(seed(),{date:'2026-09-12',symptom:'Headache',severity:2,sleep:6,note:'Second observation'});assert.equal(dailySeries(s).find(d=>d.date==='2026-09-12').severity,3);assert.equal(dailySeries(s).some(d=>d.date==='2026-09-06'),false);});

test('brief without visit preparation preserves inclusion of all current records and journal entries',()=>{
 const s=seed();
 s.observations[0].note='Earliest selected journal marker';
 const output=brief(s);
 for(const r of s.records)assert.ok(output.includes(r.title));
 assert.match(output,/Earliest selected journal marker/);
 assert.match(output,/12 observations across 12 journal days/);
});
test('explicit empty selections exclude support while retaining concern and ordered questions',()=>{
 const s=seed();
 s.visitPrep={concern:'My main concern marker',recordIds:[],observationIds:[]};
 s.questions=[{id:'b',text:'Priority first marker'},{id:'a',text:'Priority second marker'}];
 const output=brief(s);
 assert.match(output,/My main concern marker/);
 assert.match(output,/1\. Priority first marker\n2\. Priority second marker/);
 assert.match(output,/0 observations across 0 journal days/);
 assert.match(output,/Average recorded headache severity: Not available/);
 assert.match(output,/No journal entries selected/);
 assert.match(output,/No records selected/);
 for(const r of s.records)assert.ok(!output.includes(r.title));
 assert.doesNotMatch(output,/Sample daily check-in/);
});
test('selected support determines both brief details and summary, and stale IDs are ignored',()=>{
 const s=seed();
 s.observations=[
  {id:'chosen',date:'2026-09-12',symptom:'Headache',severity:4,note:'Included journal marker'},
  {id:'omitted',date:'2026-09-13',symptom:'Headache',severity:0,note:'Excluded journal marker'}
 ];
 s.visitPrep={recordIds:['r2','deleted-record'],observationIds:['chosen','deleted-observation']};
 const output=brief(s);
 assert.match(output,/Included journal marker/);
 assert.doesNotMatch(output,/Excluded journal marker/);
 assert.match(output,/Health screening results/);
 assert.doesNotMatch(output,/Follow-up consultation/);
 assert.match(output,/1 observation across 1 journal day/);
 assert.match(output,/Average recorded headache severity: 4\.0 \/ 5/);
 s.observations=[];
 s.records=s.records.filter(r=>r.id!=='r2');
 assert.match(brief(s),/No journal entries selected/);
 assert.match(brief(s),/No records selected/);
});
test('all-journal coverage includes fatigue-only days but headache severity coverage does not',()=>{
 const s=addObservation(seed(),{id:'fatigue-only',date:'2026-09-06',symptom:'Fatigue',severity:null,sleep:null,note:'Fatigue day marker'});
 s.visitPrep={concern:'',recordIds:null,observationIds:null};
 const output=brief(s);
 assert.match(output,/13 observations across 13 journal days/);
 assert.match(output,/Headache severity recorded on 12 days/);
 assert.match(output,/Fatigue day marker/);
 s.visitPrep.observationIds=['fatigue-only'];
 assert.match(brief(s),/1 observation across 1 journal day/);
 assert.match(brief(s),/Headache severity recorded on 0 days/);
 assert.match(brief(s),/Average recorded headache severity: Not available/);
});
test('null selections include subsequently added data and do not mutate stored selections',()=>{
 const s=addObservation(seed(),{id:'later',date:'2026-09-13',symptom:'Fatigue',severity:null,note:'New dynamic marker'});
 s.records.push({id:'new-record',date:'2026-09-13',title:'New record marker',provider:'Test source'});
 s.visitPrep={recordIds:null,observationIds:null};
 const before=JSON.stringify(s);
 assert.match(brief(s),/New dynamic marker/);
 assert.match(brief(s),/New record marker/);
 assert.equal(JSON.stringify(s),before);
});
