let allEvents=[];
const $=id=>document.getElementById(id);
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function categoryLabel(type){return ({air_alert_report:'СООБЩЕНИЕ О ТРЕВОГЕ',alert_end_report:'СООБЩЕНИЕ ОБ ОТБОЕ',general_warning:'ОБЩЕЕ ПРЕДУПРЕЖДЕНИЕ'})[type]||'НАБЛЮДЕНИЕ';}
function render(){
 const q=$('search').value.trim().toLocaleLowerCase('ru'), f=$('filter').value;
 const list=allEvents.filter(e=>(f==='all'||e.event_type===f)&&(!q||(`${e.text} ${e.region_name||''}`).toLocaleLowerCase('ru').includes(q)));
 $('feed').innerHTML=list.length?list.map(e=>`<article class="event"><div class="event-top"><span class="tag">${categoryLabel(e.event_type)}</span><span class="unverified">НЕ ПОДТВЕРЖДЕНО</span></div><p>${escapeHtml(e.safe_summary||e.text)}</p><div class="event-foot"><span>${escapeHtml(e.region_name||'Регион не определён')} · ${new Date(e.published_at).toLocaleString('ru-RU')}</span><a href="${escapeHtml(e.source_url)}" target="_blank" rel="noopener">Оригинал ↗</a></div></article>`).join(''):'<div class="empty">Нет сообщений по выбранному фильтру.</div>';
 $('total').textContent=allEvents.length;$('unverified').textContent=allEvents.length;
}
async function load(){
 try{
  const r=await fetch('/.netlify/functions/feed',{cache:'no-store'});if(!r.ok)throw new Error('feed unavailable');
  const d=await r.json();allEvents=Array.isArray(d.events)?d.events:[];
  $('dot').className='dot ok';$('connection').textContent='СОЕДИНЕНИЕ АКТИВНО';$('collector').textContent=d.collector_status||'ДОСТУПЕН';
  $('updated').textContent=d.last_collected_at?new Date(d.last_collected_at).toLocaleTimeString('ru-RU'):'ОЖИДАНИЕ';
  $('collectedAt').textContent=d.last_collected_at?new Date(d.last_collected_at).toLocaleString('ru-RU'):'Нет сборов';
  render();
 }catch(e){$('dot').className='dot err';$('connection').textContent='НЕТ СОЕДИНЕНИЯ';$('collector').textContent='НЕДОСТУПЕН';$('feed').innerHTML='<div class="empty">Хранилище пока не содержит данных или функция недоступна. Сбор выполняется Netlify по расписанию.</div>';$('total').textContent='0';$('unverified').textContent='0';}
}
function tick(){$('clock').textContent=new Date().toLocaleTimeString('ru-RU',{hour12:false});}
document.addEventListener('DOMContentLoaded',()=>{tick();setInterval(tick,1000);$('refresh').addEventListener('click',load);$('search').addEventListener('input',render);$('filter').addEventListener('change',render);load();setInterval(load,60000);});
