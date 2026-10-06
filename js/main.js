/* ===== NSS TRAVELS - shared data + helpers (EDIT DATA HERE) ===== */
const NSS = {
  cities: ["Chennai","Madurai","Coimbatore","Trichy","Tirunelveli","Salem","Tenkasi","Kadayanallur","Bangalore"],
  serviceFee: 20,
  upiId: "knavin882007@okaxis",
  contact: { email:"knavin882007@gmail.com", phone:"+91 00000 00000", whatsapp:"+91 00000 00000", instagram:"@nss_travels", address:"Your address here, Tamil Nadu" },
  // fare = starting fare per seat (Rs). Change names, times, fares freely.
  buses: [
    {id:"B1",name:"NSS Express",type:"Express",no:"NSS-1001",dep:"06:00",arr:"12:30",dur:"6h 30m",fare:450,color:"#b3122b",amen:["Charging","Water"]},
    {id:"B2",name:"NSS Super Fast",type:"Super Fast",no:"NSS-1002",dep:"09:15",arr:"14:45",dur:"5h 30m",fare:520,color:"#0f4c9c",amen:["Pushback","Charging"]},
    {id:"B3",name:"NSS Deluxe",type:"Deluxe",no:"NSS-1003",dep:"13:00",arr:"18:30",dur:"5h 30m",fare:620,color:"#7d0c1f",amen:["Pushback","Charging","Water"]},
    {id:"B4",name:"NSS AC Seater",type:"AC Seater",no:"NSS-1004",dep:"16:30",arr:"21:30",dur:"5h 00m",fare:780,color:"#14213d",amen:["AC","Charging","Blanket"]},
    {id:"B5",name:"NSS Night Express",type:"Night Express",no:"NSS-1005",dep:"22:00",arr:"05:00",dur:"7h 00m",fare:850,color:"#2b2d6e",amen:["AC","Pushback","Reading light"]}
  ]
};
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const store = {
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
const ses = {
  get:(k,d)=>{try{const v=sessionStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set:(k,v)=>sessionStorage.setItem(k,JSON.stringify(v))
};
const currentUser = ()=>store.get("nss_current_user",null);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function showMsg(el,text,type){el.textContent=text;el.className="msg "+type}

/* 3D-style fictional bus drawn with SVG */
function busSVG(color,label){
  return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="bus">
  <ellipse cx="160" cy="130" rx="140" ry="8" fill="#0005"/>
  <rect x="10" y="20" width="290" height="94" rx="14" fill="${color}"/>
  <rect x="10" y="84" width="290" height="14" fill="#fff"/><rect x="10" y="98" width="290" height="6" fill="#e0b030"/>
  <rect x="22" y="6" width="150" height="18" rx="5" fill="#111"/>
  <text x="97" y="19.5" fill="#ffd45a" font-size="11" text-anchor="middle" font-family="Noto Sans Tamil,sans-serif" font-weight="700">வெற்றி பயணம்</text>
  <rect x="24" y="32" width="38" height="36" rx="4" fill="#bfe3ff"/><rect x="68" y="32" width="38" height="36" rx="4" fill="#bfe3ff"/>
  <rect x="112" y="32" width="38" height="36" rx="4" fill="#bfe3ff"/><rect x="156" y="32" width="38" height="36" rx="4" fill="#bfe3ff"/>
  <path d="M206 28h82q12 0 12 12v34H206z" fill="#9fd0f5"/><path d="M206 28h82q12 0 12 12v6H206z" fill="#fff4"/>
  <text x="108" y="94" fill="${color}" font-size="10" font-weight="700" text-anchor="middle" font-family="Segoe UI,sans-serif">${label||"NSS TRAVELS"}</text>
  <rect x="296" y="86" width="14" height="10" rx="3" fill="#fff6a0" class="hl"/>
  <circle cx="70" cy="114" r="17" fill="#111"/><circle cx="70" cy="114" r="7" fill="#aaa"/>
  <circle cx="240" cy="114" r="17" fill="#111"/><circle cx="240" cy="114" r="7" fill="#aaa"/></svg>`;
}

/* Navigation + footer injected on every page */
function buildLayout(){
  const p = location.pathname.split("/").pop()||"index.html";
  const u = currentUser();
  const links=[["index.html","Home"],["buses.html","Buses"],["booking.html","Book Ticket"],["my-bookings.html","My Ticket"],["enquiry.html","Enquiry"],["feedback.html","Feedback"],["index.html#contact","Contact"]];
  const nav=document.createElement("nav");
  nav.innerHTML=`<div class="wrap"><a class="brand" href="index.html"><img src="images/nss-logo.png" alt="logo"><span><b>NSS TRAVELS</b><small>வெற்றி பயணம்</small></span></a>
  <button class="burger" aria-label="Menu" id="burger">☰</button>
  <div class="menu" id="menu">${links.map(l=>`<a href="${l[0]}" class="${p===l[0]?"on":""}">${l[1]}</a>`).join("")}
  ${u?`<a href="#" id="logout">Logout (${u.name.split(" ")[0]})</a>`:`<a class="cta" href="login.html">Login / Register</a>`}</div></div>`;
  document.body.prepend(nav);
  $("#burger").onclick=()=>$("#menu").classList.toggle("open");
  if(u)$("#logout").onclick=e=>{e.preventDefault();localStorage.removeItem("nss_current_user");location.href="index.html"};
  const c=NSS.contact, f=document.createElement("footer");
  f.innerHTML=`<div class="wrap grid" id="contact"><div><h3>NSS TRAVELS</h3><b>வெற்றி பயணம்</b><p>College mini-project. Fictional bus service for demonstration only.</p></div>
  <div><h3>Contact</h3><p>📧 <a href="mailto:${c.email}">${c.email}</a><br>📞 ${c.phone}<br>💬 WhatsApp: ${c.whatsapp}</p></div>
  <div><h3>Follow / Visit</h3><p>📸 ${c.instagram}<br>📍 ${c.address}</p></div></div>
  <div class="wrap"><p style="margin-top:16px;font-size:12px;opacity:.7">Demo project: data is saved in your browser LocalStorage only (not secure). Not an official or government website.</p></div>`;
  document.body.append(f);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in")}),{threshold:.1});
  $$(".reveal").forEach(r=>io.observe(r));
}
document.addEventListener("DOMContentLoaded",buildLayout);

function cityOptions(sel,ph){sel.innerHTML=`<option value="">${ph}</option>`+NSS.cities.map(c=>`<option>${c}</option>`).join("")}
function todayISO(){const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())}
function fmtDate(d){return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
