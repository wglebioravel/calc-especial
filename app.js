const $=s=>document.querySelector(s),N=(x,d=2)=>isFinite(x)?x.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:d}):'—',
R=x=>isFinite(x)?x.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}):'—',
num=id=>{const e=document.getElementById(id);if(!e)return NaN;let s=e.value.trim().replace(/\s/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');return parseFloat(s)},
inp=(id,l,v='')=>`<label for="${id}">${l}</label><input id="${id}" inputmode="decimal" autocomplete="off" value="${v}">`,
sel=(id,l,o)=>`<label for="${id}">${l}</label><select id="${id}">${o.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select>`,
TU=[['m','% ao mês'],['a','% ao ano']],NU=[['m','meses'],['a','anos']];
const SH={retangulo:['Retângulo',[['b','Base (m)'],['h','Altura (m)']],'A = b × h'],quadrado:['Quadrado',[['l','Lado (m)']],'A = l²'],
triangulo:['Triângulo',[['b','Base (m)'],['h','Altura (m)']],'A = (b × h) / 2'],circulo:['Círculo',[['r','Raio (m)']],'A = π × r²'],
trapezio:['Trapézio',[['B','Base maior (m)'],['b','Base menor (m)'],['h','Altura (m)']],'A = (B + b) × h / 2'],
paralelogramo:['Paralelogramo',[['b','Base (m)'],['h','Altura (m)']],'A = b × h'],losango:['Losango',[['D','Diagonal maior (m)'],['d','Diagonal menor (m)']],'A = (D × d) / 2'],
elipse:['Elipse',[['a','Semieixo a (m)'],['b','Semieixo b (m)']],'A = π × a × b']};
const VS={paralelepipedo:['Paralelepípedo / caixa',[['c','Comprimento (m)'],['l','Largura (m)'],['h','Altura (m)']],'V = c × l × h'],
cilindro:['Cilindro',[['r','Raio (m)'],['h','Altura (m)']],'V = π × r² × h'],esfera:['Esfera',[['r','Raio (m)']],'V = 4/3 × π × r³'],
cone:['Cone',[['r','Raio da base (m)'],['h','Altura (m)']],'V = π × r² × h / 3'],prisma:['Prisma triangular',[['b','Base do triângulo (m)'],['a','Altura do triângulo (m)'],['c','Comprimento (m)']],'V = (b × a / 2) × c']};
function shapeTool(pref,D,fn,out){return{html:`<div class="card">${sel(pref+'s','Forma',Object.entries(D).map(([k,v])=>[k,v[0]]))}<div id="${pref}f"></div>${out||''}<div class="res" id="${pref}r"></div></div>`,
init(){const s=$('#'+pref+'s'),draw=()=>{$('#'+pref+'f').innerHTML=D[s.value][1].map(([k,l])=>inp(pref+k,l)).join('');calc()},calc=()=>{const d=D[s.value],v={};d[1].forEach(([k])=>v[k]=num(pref+k));$('#'+pref+'r').innerHTML=fn(s.value,v,d[2])};
s.onchange=draw;$('#main').oninput=calc;draw()}}}
function chart(series){const W=320,H=160,mx=Math.max(...series.flatMap(s=>s.d))||1,n=series[0].d.length-1||1;
return`<svg viewBox="0 0 ${W} ${H+20}">${series.map(s=>`<polyline fill="none" stroke="${s.c}" stroke-width="2.5" points="${s.d.map((y,i)=>(i/n*W).toFixed(1)+','+(H-y/mx*H+5).toFixed(1)).join(' ')}"/>`).join('')}
<line x1="0" y1="${H+5}" x2="${W}" y2="${H+5}" stroke="#888"/>${series.map((s,i)=>`<text x="${5+i*130}" y="${H+18}" fill="${s.c}" font-size="11">■ ${s.n}</text>`).join('')}</svg>`}
const tbl=(h,rows)=>`<div class="tw"><table><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>`;
const meses=()=>num('n')*($('#nu').value==='a'?12:1);
const T=[
['📐','Área',shapeTool('a',SH,(s,v,f)=>{const A=C.area(s,v);return`Área: <b>${N(A,4)} m²</b><br>Centímetros²: ${N(A*1e4)} cm²<br>Hectares: ${N(A/1e4,6)} ha<br>Pés²: ${N(A/.09290304)} ft²<div class="f">Fórmula: ${f}</div>`})],
['🧱','m² Piso',{html:`<div class="card"><h2>Piso / revestimento</h2><div class="row"><div>${inp('pc','Comprimento (m)')}</div><div>${inp('pl','Largura (m)')}</div></div>
<div class="row"><div>${inp('pp','Perda (%)','10')}</div><div>${inp('pm','m² por caixa')}</div></div>${inp('pv','Preço por caixa (R$)')}<div class="res" id="pr"></div></div>
<div class="card"><h2>Parede / tinta</h2><div class="row"><div>${inp('th','Altura (m)')}</div><div>${inp('tc','Comprimento (m)')}</div></div>
${inp('td','Descontar portas/janelas (m²)','0')}<div class="row"><div>${inp('tr','Rendimento (m²/litro)','10')}</div><div>${inp('tn','Demãos','2')}</div></div><div class="res" id="tres"></div></div>`,
init(){const c=()=>{const p=C.piso(num('pc'),num('pl'),num('pp')||0,num('pm'),num('pv')||0);
$('#pr').innerHTML=`Área: <b>${N(p.a)} m²</b><br>Com perda: <b>${N(p.ap)} m²</b><br>Caixas: <b>${isFinite(p.cx)?p.cx:'—'}</b><br>Custo total: <b>${R(p.custo)}</b>`;
const t=C.tinta(num('th'),num('tc'),num('td')||0,num('tr'),num('tn'));$('#tres').innerHTML=`Área a pintar: <b>${N(t.a)} m²</b><br>Tinta necessária: <b>${N(t.litros)} litros</b><div class="f">Litros = área × demãos ÷ rendimento</div>`};$('#main').oninput=c;c()}}],
['🧊','m³',shapeTool('v',VS,(s,v,f)=>{const V=C.vol(s,v),p=num('vp')||0,pr=num('vpr')||0,Vp=V*(1+p/100);
return`Volume: <b>${N(V,4)} m³</b><br>Litros: ${N(V*1000)} L<br>Centímetros³: ${N(V*1e6,0)} cm³<br>Com perda: <b>${N(Vp,4)} m³</b><br>Custo: <b>${R(Vp*pr)}</b><div class="f">Fórmula: ${f}</div>`},
`<div class="row"><div>${inp('vp','Perda (%)','0')}</div><div>${inp('vpr','Preço por m³ (R$)')}</div></div>`)],
['💵','J. Simples',{html:`<div class="card"><h2>Juros simples</h2>${inp('c','Capital (R$)')}<div class="row"><div>${inp('i','Taxa')}</div><div>${sel('tu','Período',TU)}</div></div>
<div class="row"><div>${inp('n','Tempo')}</div><div>${sel('nu','Unidade',NU)}</div></div><div class="res" id="r"></div></div>`,
init(){const c=()=>{const n=meses(),s=C.simples(num('c'),num('i'),$('#tu').value,n);let rows=[];if(n>0&&n<=600)for(let k=1;k<=n;k++){const j=num('c')*s.im*k;rows.push([k,R(j),R(num('c')+j)])}
$('#r').innerHTML=`Juros: <b>${R(s.J)}</b><br>Montante: <b>${R(s.M)}</b><div class="f">J = C × i × t (taxa mensal ${N(s.im*100,4)}%; t = ${N(n)} meses)</div>${rows.length?tbl(['Mês','Juros acum.','Montante'],rows):''}`};$('#main').oninput=$('#main').onchange=c;c()}}],
['📈','J. Compostos',{html:`<div class="card"><h2>Juros compostos</h2>${inp('c','Capital inicial (R$)')}<div class="row"><div>${inp('i','Taxa')}</div><div>${sel('tu','Período',TU)}</div></div>
<div class="row"><div>${inp('n','Tempo')}</div><div>${sel('nu','Unidade',NU)}</div></div>${inp('ap','Aporte mensal (R$, opcional)','0')}<div class="res" id="r"></div></div>`,
init(){const c=()=>{const n=Math.max(0,Math.round(meses())||0),C0=num('c'),ap=num('ap')||0,tu=$('#tu').value,x=C.compostos(C0,num('i'),tu,n,ap);
const im=C.simples(1,num('i'),tu,1).im,simp=[...Array(n+1)].map((_,k)=>C0*(1+im*k)+ap*k+ap*im*k*(k-1)/2);
$('#r').innerHTML=`Montante: <b>${R(x.M)}</b><br>Total investido: <b>${R(x.inv)}</b><br>Juros: <b>${R(x.J)}</b><br>Taxa mensal equivalente: ${N(x.r*100,4)}%<br>
Em juros simples: ${R(simp[n])} (diferença ${R(x.M-simp[n])})${n>0&&n<=1200&&isFinite(x.M)?chart([{n:'Compostos',c:'#1e88e5',d:x.serie},{n:'Simples',c:'#ff9800',d:simp}]):''}
<div class="f">M = C(1+i)ⁿ + aporte × ((1+i)ⁿ − 1)/i</div>`};$('#main').oninput=$('#main').onchange=c;c()}}],
['🏦','Financiar',{html:`<div class="card"><h2>Financiamento</h2>${inp('fv','Valor financiado (R$)')}<div class="row"><div>${inp('fi','Taxa (% ao mês)')}</div><div>${inp('fn','Nº de parcelas')}</div></div>
${sel('fs','Sistema',[['price','Tabela Price (parcelas fixas)'],['sac','SAC (amortização constante)']])}<div class="res" id="r"></div></div>`,
init(){const c=()=>{const P=num('fv'),i=num('fi'),n=Math.round(num('fn'));if(!(P>0&&n>0&&n<=600&&i>=0)){$('#r').innerHTML='Preencha os campos.';return}
const f=C[$('#fs').value](P,i,n);$('#r').innerHTML=($('#fs').value==='price'?`Parcela: <b>${R(f.pmt)}</b>`:`1ª parcela: <b>${R(f.pmt)}</b><br>Última: <b>${R(f.ult)}</b>`)+
`<br>Total pago: <b>${R(f.total)}</b><br>Juros total: <b>${R(f.juros)}</b>`+tbl(['Nº','Parcela','Juros','Amort.','Saldo'],f.t.map(r=>[r[0],R(r[1]),R(r[2]),R(r[3]),R(r[4])]))};$('#main').oninput=$('#main').onchange=c;c()}}],
['％','Porcent.',{html:`<div class="card"><h2>X% de Y</h2><div class="row"><div>${inp('p1','X (%)')}</div><div>${inp('p2','Y')}</div></div><div class="res" id="q1"></div></div>
<div class="card"><h2>Variação percentual</h2><div class="row"><div>${inp('p3','Valor inicial')}</div><div>${inp('p4','Valor final')}</div></div><div class="res" id="q2"></div></div>
<div class="card"><h2>Desconto / acréscimo</h2><div class="row"><div>${inp('p5','Valor')}</div><div>${inp('p6','Percentual (%)')}</div></div><div class="res" id="q3"></div></div>
<div class="card"><h2>Quanto % A é de B</h2><div class="row"><div>${inp('p7','A')}</div><div>${inp('p8','B')}</div></div><div class="res" id="q4"></div></div>`,
init(){const c=()=>{const v=k=>num('p'+k);$('#q1').innerHTML=`Resultado: <b>${N(v(1)*v(2)/100,4)}</b>`;const d=(v(4)-v(3))/v(3)*100;$('#q2').innerHTML=`Variação: <b>${d>0?'+':''}${N(d,4)}%</b>`;
$('#q3').innerHTML=`Com desconto: <b>${N(v(5)*(1-v(6)/100),4)}</b><br>Com acréscimo: <b>${N(v(5)*(1+v(6)/100),4)}</b><br>Diferença: ${N(v(5)*v(6)/100,4)}`;$('#q4').innerHTML=`Percentual: <b>${N(v(7)/v(8)*100,4)}%</b>`};$('#main').oninput=c;c()}}],
['🛒','Mercadoria',{html:`<div class="card"><h2>Margem de lucro</h2><div class="row"><div>${inp('m1','Preço de venda (R$)')}</div><div>${inp('m2','Custo (R$)')}</div></div><div class="res" id="o1"></div></div>
<div class="card"><h2>Markup</h2>${inp('m3','Custo (R$)')}<div class="row"><div>${inp('m4','Markup (%)')}</div><div>${inp('m5','ou Multiplicador (ex: 1,8)')}</div></div>${inp('m6','Margem desejada (%) → markup equivalente')}<div class="res" id="o2"></div></div>
<div class="card"><h2>Preço pela margem desejada</h2>${inp('m7','Custo (R$)')}<div class="row"><div>${inp('m8','Despesas + impostos (%)')}</div><div>${inp('m9','Margem desejada (%)')}</div></div><div class="res" id="o3"></div></div>
<div class="card"><h2>Markup divisor / multiplicador</h2><div class="row"><div>${inp('ma','Despesas fixas (%)')}</div><div>${inp('mb','Despesas variáveis (%)')}</div></div><div class="row"><div>${inp('mc','Impostos (%)')}</div><div>${inp('md','Lucro (%)')}</div></div>${inp('me','Custo do produto (R$, opcional)')}<div class="res" id="o4"></div></div>
<div class="card"><h2>Desconto máximo sem prejuízo</h2><div class="row"><div>${inp('mf','Preço de venda (R$)')}</div><div>${inp('mg','Custo total (R$)')}</div></div><div class="res" id="o5"></div></div>
<div class="card"><h2>Ponto de equilíbrio</h2>${inp('mh','Custos fixos mensais (R$)')}<div class="row"><div>${inp('mi','Preço unitário (R$)')}</div><div>${inp('mj','Custo variável unit. (R$)')}</div></div><div class="res" id="o6"></div></div>
<div class="card"><h2>Custo médio de estoque</h2>${[1,2,3,4].map(k=>`<div class="row"><div>${inp('q'+k,'Lote '+k+': quantidade')}</div><div>${inp('u'+k,'Preço unitário (R$)')}</div></div>`).join('')}<div class="res" id="o7"></div></div>
<div class="card"><h2>Lucro por quantidade vendida</h2>${inp('mk','Quantidade vendida')}<div class="row"><div>${inp('ml','Preço de venda (R$)')}</div><div>${inp('mm','Custo unitário (R$)')}</div></div><div class="res" id="o8"></div></div>`,
init(){const c=()=>{const v=k=>num('m'+k),h=(k,s)=>$('#o'+k).innerHTML=s;
const g=C.margem(v(1),v(2));h(1,`Lucro: <b>${R(g.l)}</b><br>Margem (sobre a venda): <b>${N(g.m)}%</b><br>Markup (sobre o custo): <b>${N(g.mk)}%</b>`);
let mk=v(4);if(!isFinite(mk)&&isFinite(v(5)))mk=(v(5)-1)*100;const em=C.mkDeMargem(v(6));
h(2,`Preço de venda: <b>${R(C.markup(v(3),mk))}</b><br>Multiplicador: ${N(1+mk/100,4)}<br>Margem resultante: ${N(mk/(100+mk)*100)}%`+(isFinite(em)?`<br>Markup p/ margem de ${N(v(6))}%: <b>${N(em)}%</b><br>Preço com essa margem: <b>${R(C.markup(v(3),em))}</b>`:'')+`<div class="f">Margem = lucro ÷ venda; Markup = lucro ÷ custo. Ex.: margem 20% = markup 25%.</div>`);
h(3,`Preço de venda: <b>${R(C.precoMargem(v(7),v(8)||0,v(9)))}</b><div class="f">Preço = custo ÷ (1 − (despesas + margem)/100)</div>`);
const d=C.mkDiv(v('a')||0,v('b')||0,v('c')||0,v('d')||0);h(4,`Markup divisor: <b>${N(d.div,4)}</b><br>Markup multiplicador: <b>${N(d.mult,4)}</b>`+(isFinite(v('e'))?`<br>Preço de venda: <b>${R(v('e')*d.mult)}</b>`:'')+(d.div<=0?'<br>⚠️ Percentuais somam 100% ou mais.':''));
h(5,`Desconto máximo: <b>${N(C.descMax(v('f'),v('g')))}%</b> (${R(v('f')-v('g'))})`);
const e=C.equilibrio(v('h'),v('i'),v('j'));h(6,`Unidades: <b>${N(Math.ceil(e.u),0)}</b> (${N(e.u)})<br>Faturamento: <b>${R(e.fat)}</b>`);
const L=[1,2,3,4].map(k=>[num('q'+k),num('u'+k)]).filter(x=>x[0]>0&&isFinite(x[1])),cm=C.custoMedio(L);h(7,`Quantidade total: <b>${N(cm.q)}</b><br>Valor total: <b>${R(cm.t)}</b><br>Custo médio: <b>${R(cm.m)}</b>`);
const lq=C.lucroQtd(v('k'),v('l'),v('m'));h(8,`Receita: <b>${R(lq.rec)}</b><br>Custo: <b>${R(lq.cus)}</b><br>Lucro total: <b>${R(lq.l)}</b>`)};$('#main').oninput=c;c()}}],
['🔄','Converter',{html:`<div class="card"><h2>Conversões</h2>${sel('cc','Categoria',[['comprimento','Comprimento'],['area','Área'],['volume','Volume'],['massa','Massa'],['temperatura','Temperatura']])}
${inp('cv','Valor','1')}<div class="row"><div><label>De</label><select id="cd"></select></div><div><label>Para</label><select id="cp"></select></div></div><div class="res" id="r"></div></div>`,
init(){const fill=()=>{const u=$('#cc').value==='temperatura'?['°C','°F','K']:Object.keys(C.U[$('#cc').value]),o=u.map(x=>`<option>${x}</option>`).join('');$('#cd').innerHTML=o;$('#cp').innerHTML=o;$('#cp').selectedIndex=1;c()},
c=()=>{const cat=$('#cc').value,v=num('cv'),r=C.conv(cat,v,$('#cd').value,$('#cp').value);$('#r').innerHTML=`Resultado: <b>${N(r,6)} ${$('#cp').value}</b>`+(cat==='temperatura'?'':'<br>'+Object.keys(C.U[cat]).map(u=>`${N(C.conv(cat,v,$('#cd').value,u),6)} ${u}`).join('<br>'))};
$('#cc').onchange=fill;$('#main').oninput=c;$('#cd').onchange=$('#cp').onchange=c;fill()}}]];
/* ===== Shell v1.1.0 ===== */
const VER='1.1.0',HK='ce_hist',main=$('#main');let cur=0,saveT;
function cardify(){main.querySelectorAll('.res').forEach(r=>{if(r.querySelector('.it')||!r.innerHTML.trim())return;
const notes=[...r.querySelectorAll('.f,.tw,svg')];notes.forEach(n=>n.remove());
const parts=r.innerHTML.split(/<br\s*\/?>/i).map(s=>s.trim()).filter(Boolean);
r.innerHTML=parts.map(p=>{const m=p.match(/^(.*?):\s*(.*)$/s);let lab=m?m[1]:'',val=m?m[2]:p;
const txt=val.replace(/<[^>]*>/g,''),neg=/(^|\s|\()[-−]\s?(R\$|\d)|R\$\s?-|-\d/.test(txt)||/⚠️/.test(p),pos=/lucro|juros|ganho|diferen|montante/i.test(lab)&&!neg&&/[1-9]/.test(txt);
return`<div class="it${p.includes('<b>')?' hi':''}${neg?' neg':pos?' pos':''}">${lab?`<span>${lab}</span>`:''}<strong>${val}</strong></div>`}).join('');
notes.forEach(n=>r.appendChild(n))})}
new MutationObserver(()=>cardify()).observe(main,{childList:true,subtree:true});
const hist=()=>{try{return JSON.parse(localStorage[HK]||'[]')}catch(e){return[]}};
function snap(){const v={};main.querySelectorAll('input,select').forEach(e=>{if(e.id&&e.value!=='')v[e.id]=e.value});return v}
function record(){clearTimeout(saveT);saveT=setTimeout(()=>{const v=snap();if(!Object.keys(v).some(k=>main.querySelector('#'+k).tagName==='INPUT'))return;
const b=main.querySelector('.res .it.hi strong');if(!b)return;const sum=main.querySelector('.res .it.hi span'),s=(sum?sum.textContent+': ':'')+b.textContent;if(/—|NaN/.test(s))return;
let h=hist();if(h[0]&&h[0].t===cur&&JSON.stringify(h[0].v)===JSON.stringify(v))return;
h.unshift({t:cur,n:T[cur][1],s,v,ts:Date.now()});localStorage[HK]=JSON.stringify(h.slice(0,50))},1500)}
function tool(i,vals){cur=i;const tt=$('#ttl');if(tt)tt.innerHTML=`<span>${T[i][0]}</span> ${T[i][1]}`;localStorage.tab=i;main.oninput=main.onchange=null;main.innerHTML=T[i][2].html;T[i][2].init();
const a=main.oninput,c=main.onchange;main.oninput=e=>{a&&a(e);record()};main.onchange=e=>{c&&c(e);record()};
document.querySelectorAll('#tools button').forEach((b,k)=>b.classList.toggle('on',k===i));
if(vals){const ks=Object.keys(vals);ks.filter(k=>/SELECT/.test((main.querySelector('#'+k)||{}).tagName)).forEach(k=>{const e=main.querySelector('#'+k);e.value=vals[k];e.dispatchEvent(new Event('change'))});
ks.forEach(k=>{const e=main.querySelector('#'+k);if(e&&e.tagName==='INPUT')e.value=vals[k]});main.dispatchEvent(new Event('input'))}}
const drawer=o=>document.body.classList.toggle('dopen',o);$('#menu').onclick=()=>drawer(true);$('#scrim').onclick=()=>drawer(false);
function section(s){drawer(false);document.querySelectorAll('.navb').forEach(b=>b.classList.toggle('on',b.dataset.s===s));['calc','hist','cfg'].forEach(x=>$('#sec-'+x).hidden=x!==s);
if(s==='hist')renderHist();scrollTo(0,0)}
function renderHist(){const h=hist(),f=d=>new Date(d).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
$('#hlist').innerHTML=h.length?h.map((x,i)=>`<button class="hitem" data-i="${i}"><span class="tag">${T[x.t]?T[x.t][0]:''} ${x.n}</span><strong>${x.s}</strong><small>${f(x.ts)}</small></button>`).join(''):'<p class="empty">Nenhum cálculo salvo ainda. Seus cálculos aparecem aqui automaticamente.</p>'}
$('#hlist').onclick=e=>{const b=e.target.closest('.hitem');if(!b)return;const x=hist()[+b.dataset.i];section('calc');tool(x.t,x.v)};
function theme(t){localStorage.theme=t;if(t==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=t;$('#theme').value=t}
$('#theme').onchange=e=>theme(e.target.value);theme(localStorage.theme||'system');
$('#clr').onclick=()=>{if(confirm('Apagar todo o histórico?')){localStorage.removeItem(HK);renderHist();$('#clrmsg').textContent='Histórico apagado.'}};
$('#tools').innerHTML=T.map((t,i)=>`<button data-i="${i}"><span>${t[0]}</span>${t[1]}</button>`).join('');
$('#tools').onclick=e=>{const b=e.target.closest('button');if(b){tool(+b.dataset.i);b.scrollIntoView({inline:'center',block:'nearest'})}};
document.querySelectorAll('.navb').forEach(b=>b.onclick=()=>section(b.dataset.s));
document.querySelectorAll('.ver').forEach(e=>e.textContent='v'+VER);
tool(+(localStorage.tab||0)%T.length);section('calc');
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const b=$('#inst');if(b)b.hidden=false});$('#inst').onclick=()=>{dp&&dp.prompt();$('#inst').hidden=true};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
