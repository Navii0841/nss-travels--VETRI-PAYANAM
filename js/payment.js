/* Payment, booking save, success animation, ticket, my bookings */
/* To use a real gateway later, replace ONLY this function (it must return true when payment is truly verified). */
function confirmPaymentWithGateway(reference){
  return reference.length>=6; // demo: user self-confirms with UPI reference. NOT verified by any bank.
}
function initPayment(){
  if(!requireLogin())return;
  const p=ses.get("nss_pending",null);
  if(!p){location.href="index.html";return}
  $("#amount").textContent="₹"+p.total; $("#upi").textContent=NSS.upiId;
  $("#paySum").innerHTML=`<div><span>Bus</span><b>${p.busName}</b></div><div><span>Route</span><b>${p.from} → ${p.to}</b></div><div><span>Date</span><b>${fmtDate(p.date)}</b></div>
  <div><span>Seats</span><b>${p.passengers.map(x=>x.seat).join(", ")}</b></div><div><span>Base</span><b>₹${p.base}</b></div><div><span>Service Fee</span><b>₹${p.fee}</b></div>`;
  $("#paid").onclick=()=>{
    const ref=$("#ref").value.trim(), m=$("#msg");
    if(!confirmPaymentWithGateway(ref)) return showMsg(m,"Enter your UPI reference / transaction number (min 6 characters).","err");
    const all=store.get("nss_bookings",[]);
    const taken=bookedSeats(p.busId,p.date), clash=p.passengers.filter(x=>taken.includes(x.seat));
    if(clash.length){sessionStorage.removeItem("nss_pending");alert("Seat "+clash.map(x=>x.seat).join(", ")+" was just booked by someone else. Please choose another seat.");location.href="booking.html";return}
    const d=new Date(), pad=n=>String(n).padStart(2,"0");
    const id="NSS"+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+String(Math.floor(1000+Math.random()*9000));
    const b={...p,id,userEmail:currentUser().email,payRef:ref,
      status:"Payment confirmed by user (demo - not bank verified)",bookedOn:d.toISOString()};
    all.push(b); store.set("nss_bookings",all);
    sessionStorage.removeItem("nss_pending"); ses.set("nss_last",id);
    location.href="success.html";
  };
}
function initSuccess(){
  const id=ses.get("nss_last",null); if(!id){location.href="index.html";return}
  $("#bid").textContent=id;
  const cols=["#e0b030","#b3122b","#fff","#4a90e2"];
  for(let i=0;i<70;i++){const c=document.createElement("i");c.className="conf";
    c.style.cssText=`left:${Math.random()*100}%;background:${cols[i%4]};animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*2}s`;$(".succ").append(c)}
  setTimeout(()=>location.href="ticket.html?id="+id,6500);
}
function barcode(id){return [...id].map(ch=>{const n=ch.charCodeAt(0);return `<i style="width:${1+n%3}px"></i><i style="width:2px;background:#fff"></i>`}).join("")}
function ticketHTML(b){
  const p=esc(b.passengers.map(x=>x.name).join(", ")), mob=esc(b.passengers[0].mobile), seats=esc(b.passengers.map(x=>x.seat).join(", "));
  return `<div class="ticket" id="ticketBox"><div class="th"><div><b>🚌 NSS TRAVELS</b><small>வெற்றி பயணம்</small></div><div style="text-align:right"><small>Booking ID</small><b style="font-size:18px">${b.id}</b></div></div>
  <div class="tb"><div><small>Passenger</small><b>${p}</b></div><div><small>Mobile</small><b>${mob}</b></div><div><small>From</small><b>${b.from}</b></div><div><small>To</small><b>${b.to}</b></div>
  <div><small>Journey Date</small><b>${fmtDate(b.date)}</b></div><div><small>Departure</small><b>${b.time}</b></div><div><small>Bus</small><b>${b.busName}</b></div><div><small>Bus Number</small><b>${b.busNo}</b></div>
  <div><small>Seat(s)</small><b>${seats}</b></div><div><small>Fare Paid</small><b>₹${b.total}</b></div><div><small>Payment Status</small><b>${b.status}</b></div><div><small>Booked On</small><b>${fmtDate(b.bookedOn)}</b></div></div>
  <div class="tf"><div class="bars">${barcode(b.id)}</div><small>${b.id} • Fictional college project ticket</small></div></div>`;
}
function initTicket(){
  const id=new URLSearchParams(location.search).get("id");
  const b=store.get("nss_bookings",[]).find(x=>x.id===id);
  if(!b){$("#ticketArea").innerHTML="<p>Ticket not found. <a href='my-bookings.html'>Go to My Tickets</a></p>";return}
  $("#ticketArea").innerHTML=ticketHTML(b);
  $("#dl").onclick=()=>{
    const css="body{font-family:sans-serif;padding:20px}.ticket{max-width:700px;border:2px solid #7d0c1f;border-radius:14px}.th{background:#7d0c1f;color:#fff;padding:14px;display:flex;justify-content:space-between}.tb{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px}small{display:block;color:#666}.bars{display:flex;height:50px;justify-content:center}.bars i{display:block;background:#000;height:100%}.tf{text-align:center;padding:10px}";
    const blob=new Blob([`<html><head><meta charset=utf-8><style>${css}</style></head><body>${$("#ticketBox").outerHTML}</body></html>`],{type:"text/html"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=b.id+".html";a.click();
  };
}
function initMyBookings(){
  if(!requireLogin())return;
  const me=currentUser().email, list=store.get("nss_bookings",[]).filter(b=>b.userEmail===me).reverse();
  $("#list").innerHTML=list.length?list.map(b=>`<div class="card h reveal in" style="text-align:left"><h3>${b.id}</h3>
  <p><b>${esc(b.passengers.map(x=>x.name).join(", "))}</b></p><p>${b.from} → ${b.to}</p><p>${fmtDate(b.date)} • ${b.busName}</p>
  <p>Seat: ${b.passengers.map(x=>x.seat).join(", ")} • ₹${b.total}</p><p style="font-size:12px;color:#556">${b.status}</p><br>
  <a class="btn" href="ticket.html?id=${b.id}">View Ticket</a></div>`).join(""):"<p>No bookings yet. <a href='index.html'><b>Book your first ticket</b></a></p>";
}
/* Enquiry + Feedback */
function submitEnquiry(e){
  e.preventDefault(); const g=id=>$("#"+id).value.trim();
  const d={name:g("name"),mobile:g("mobile"),email:g("email"),from:g("from"),to:g("to"),date:g("date"),message:g("message"),at:new Date().toISOString()};
  if(!d.name||!/^\d{10}$/.test(d.mobile)||!/^\S+@\S+\.\S+$/.test(d.email)||!d.message) return showMsg($("#msg"),"Please fill name, 10-digit mobile, valid email and message.","err");
  const all=store.get("nss_enquiries",[]);all.push(d);store.set("nss_enquiries",all);
  showMsg($("#msg"),"Thank you! Your enquiry has been submitted.","ok");e.target.reset();
}
let rating=0;
function initFeedback(){
  const s=$("#stars");s.innerHTML=[1,2,3,4,5].map(i=>`<span data-v="${i}">★</span>`).join("");
  $$("span",s).forEach(x=>x.onclick=()=>{rating=+x.dataset.v;$$("span",s).forEach(y=>y.classList.toggle("on",+y.dataset.v<=rating))});
}
function submitFeedback(e){
  e.preventDefault();const g=id=>$("#"+id).value.trim();
  if(!g("name")||!/^\S+@\S+\.\S+$/.test(g("email"))||!rating||!g("message")) return showMsg($("#msg"),"Please fill all fields and choose a star rating.","err");
  const all=store.get("nss_feedback",[]);all.push({name:g("name"),email:g("email"),rating,message:g("message"),at:new Date().toISOString()});store.set("nss_feedback",all);
  showMsg($("#msg"),"Thank you for travelling with NSS TRAVELS!","ok");e.target.reset();rating=0;$$("#stars span").forEach(y=>y.classList.remove("on"));
}
