export const routes=['overview','companion','records','tracking','insights','visits','family'];
export function sectionFor(route){return ['records','tracking','insights'].includes(route)?'health':route==='visits'?'visit':route==='family'?'family':'today';}
export function recordsForChat(records,id=null){return id?records.filter(r=>r.id===id):records;}
export function messageForAnswer(messages,index){return Number.isInteger(index)&&index>=0&&index<messages.length?messages.slice(0,index).findLast(m=>m.role==='user')?.text:null;}
export function chatPayload(state,text,id=null){return {message:text,history:id?[]:state.messages.filter(m=>!m.failed),context:{records:recordsForChat(state.records,id),observations:id?[]:state.observations}};}
export const sampleText='FICTIONAL DEMO REPORT\nPatient: Maya Tan\nDate: 13 September 2026\nHaemoglobin: 12.8 g/dL\nLaboratory reference range: 12.0–15.5 g/dL\nSynthetic data. Not for health decisions.';
