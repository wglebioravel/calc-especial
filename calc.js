const C={
area(s,v){const P=Math.PI;switch(s){case'retangulo':return v.b*v.h;case'quadrado':return v.l*v.l;case'triangulo':return v.b*v.h/2;case'circulo':return P*v.r*v.r;
case'trapezio':return(v.B+v.b)*v.h/2;case'paralelogramo':return v.b*v.h;case'losango':return v.D*v.d/2;case'elipse':return P*v.a*v.b}},
piso(c,l,perda,m2cx,preco){const a=c*l,ap=a*(1+perda/100),cx=Math.ceil(ap/m2cx-1e-9);return{a,ap,cx,custo:cx*preco}},
tinta(h,c,desc,rend,dem){const a=Math.max(0,h*c-desc);return{a,litros:a*dem/rend}},
vol(s,v){const P=Math.PI;switch(s){case'paralelepipedo':return v.c*v.l*v.h;case'cilindro':return P*v.r*v.r*v.h;case'esfera':return 4/3*P*v.r**3;case'cone':return P*v.r*v.r*v.h/3;case'prisma':return v.b*v.a/2*v.c}},
// taxa em %, tu 'm'|'a'; tempo em meses
simples(C0,i,tu,n){const im=(tu==='a'?i/12:i)/100,J=C0*im*n;return{J,M:C0+J,im}},
mensal(i,tu){return tu==='a'?Math.pow(1+i/100,1/12)-1:i/100},
compostos(C0,i,tu,n,ap){const r=C.mensal(i,tu);let M=C0,s=[M];for(let k=0;k<n;k++){M=M*(1+r)+ap;s.push(M)}const inv=C0+ap*n;return{M,inv,J:M-inv,serie:s,r}},
price(P,i,n){const r=i/100,pmt=r?P*r/(1-Math.pow(1+r,-n)):P/n;let s=P,t=[];for(let k=1;k<=n;k++){const j=s*r,a=pmt-j;s-=a;t.push([k,pmt,j,a,Math.max(0,s)])}return{pmt,total:pmt*n,juros:pmt*n-P,t}},
sac(P,i,n){const r=i/100,a=P/n;let s=P,t=[],tot=0;for(let k=1;k<=n;k++){const j=s*r;s-=a;tot+=a+j;t.push([k,a+j,j,a,Math.max(0,s)])}return{pmt:t[0][1],ult:t[n-1][1],total:tot,juros:tot-P,t}},
margem(pv,cu){const l=pv-cu;return{l,m:l/pv*100,mk:l/cu*100}},
markup(cu,mk){return cu*(1+mk/100)},
mkDeMargem(m){return m/(100-m)*100},
precoMargem(cu,desp,m){return cu/(1-(desp+m)/100)},
mkDiv(df,dv,imp,lu){const d=1-(df+dv+imp+lu)/100;return{div:d,mult:1/d}},
descMax(pv,cu){return(pv-cu)/pv*100},
equilibrio(cf,pv,cv){const u=cf/(pv-cv);return{u,fat:u*pv}},
custoMedio(l){let q=0,t=0;l.forEach(([a,b])=>{q+=a;t+=a*b});return{q,t,m:t/q}},
lucroQtd(q,pv,cu){return{rec:q*pv,cus:q*cu,l:q*(pv-cu)}},
U:{comprimento:{km:1000,m:1,cm:.01,mm:.001,mi:1609.344,yd:.9144,ft:.3048,pol:.0254},
area:{'km²':1e6,ha:1e4,'m²':1,'cm²':1e-4,alqueire_SP:24200,acre:4046.8564224,'ft²':.09290304},
volume:{'m³':1,L:.001,mL:1e-6,'cm³':1e-6,'gal (US)':.003785411784,'ft³':.028316846592},
massa:{t:1000,kg:1,g:.001,mg:1e-6,lb:.45359237,oz:.028349523125,arroba:15}},
conv(cat,v,de,para){if(cat==='temperatura'){const k=de==='°C'?v:de==='°F'?(v-32)*5/9:v-273.15;return para==='°C'?k:para==='°F'?k*9/5+32:k+273.15}
return v*C.U[cat][de]/C.U[cat][para]}};
if(typeof module!=='undefined')module.exports=C;
