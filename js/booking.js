/* Bus list, seat selection, passenger details */
function searchBuses(e){
  e.preventDefault();
  const t={from:$("#from").value,to:$("#to").value,date:$("#date").value,pax:+$("#pax").value};
  if(!t.from||!t.to||!t.date) return alert("Please choose From, To and Date.");
  if(t.from===t.to) return alert("From and To cannot be the same.");
  if(!(t.pax>=1&&t.pax<=6)) return alert("Passengers must be between 1 and 6.");
  ses.set("nss_trip",t); location.href="buses.html";
}
function renderBuses(){
  const t=ses.get("nss_trip",null), box=$("#busList");
  $("#tripInfo").textContent=t?`${t.from} → ${t.to} • ${fmtDate(t.date)} • ${t.pax} passenger(s)`:"Search a route on the Home page to choose date & route.";
  box.innerHTML=NSS.buses.map(b=>{
    const left=24-bookedSeats(b.id,t?t.date:"").length;
    return `<div class="busCard reveal">${busSVG(b.color,b.name)}
    <div><h3>${b.name}</h3><span class="tag">${b.type}</span><span class="tag">${b.no}</span>
    <div class="time"><span><small>Departure</small>${b.dep}</span><span><small>Duration</small>${b.dur}</span><span><small>Arrival</small>${b.arr}</span></div>
    <div>${b.amen.map(a=>`<span class="tag">✔ ${a}</span>`).join("")}</div></div>
    <div class="price"><small>Starting fare</small><b>₹${b.fare}</b><small>${left} seats left</small><br><br><button class="btn" onclick="selectBus('${b.id}')">Select Bus</button></div></div>`}).join("");
  $$(".reveal").forEach(r=>r.classList.add("in"));
}
function selectBus(id){
  let t=ses.get("nss_trip",null);
  if(!t){alert("Please search a route on the Home page first.");location.href="index.html";return}
  t.busId=id; ses.set("nss_trip",t); location.href="booking.html";
}
/* Booked seats = some fixed demo seats + seats from real saved bookings */
function bookedSeats(busId,date){
  const demo={B1:["A2","B3","B7"],B2:["A1","A6","B4"],B3:["B1","B2","A9"],B4:["A4","A5","B8"],B5:["A3","B6","B11"]}[busId]||[];
  const real=store.get("nss_bookings",[]).filter(b=>b.busId===busId&&b.date===date).flatMap(b=>b.passengers.map(p=>p.seat));
  return [...demo,...real];
}
let chosen=[];
function initBooking(){
  if(!requireLogin())return;
  const t=ses.get("nss_trip",null);
  if(!t||!t.busId){alert("Please search and select a bus first.");location.href="index.html";return}
  const bus=NSS.buses.find(b=>b.id===t.busId), booked=bookedSeats(bus.id,t.date);
  $("#busInfo").innerHTML=`<h3>${bus.name} <span class="tag">${bus.type}</span></h3><p>${t.from} → ${t.to} | ${fmtDate(t.date)} | ${bus.dep}</p>`;
  let html="";
  for(let r=0;r<6;r++){
    const s=(c,n)=>{const id=c+n,bk=booked.includes(id);return `<button type="button" class="seat ${bk?"bk":""}" data-id="${id}" ${bk?"disabled":""}>${id}</button>`};
    html+=`<div class="srow">${s("A",2*r+1)}${s("A",2*r+2)}<span></span>${s("B",2*r+1)}${s("B",2*r+2)}</div>`;
  }
  $("#seats").innerHTML=html;
  $$(".seat:not(.bk)").forEach(b=>b.onclick=()=>{
    const id=b.dataset.id,i=chosen.indexOf(id);
    if(i>=0){chosen.splice(i,1);b.classList.remove("sel")}
    else{if(chosen.length>=t.pax)return alert("You can select only "+t.pax+" seat(s).");chosen.push(id);b.classList.add("sel")}
    updateSummary(bus,t);
  });
  updateSummary(bus,t);
  $("#goPay").onclick=()=>{
    if(chosen.length!==t.pax) return alert("Please select exactly "+t.pax+" seat(s).");
    const ps=[];
    for(let i=0;i<t.pax;i++){
      const p={name:$("#pn"+i).value.trim(),age:+$("#pa"+i).value,gender:$("#pg"+i).value,mobile:$("#pm"+i).value.trim(),seat:chosen[i]};
      if(!p.name||!p.age||p.age<1||p.age>110) return alert("Enter valid name and age for passenger "+(i+1));
      if(!/^\d{10}$/.test(p.mobile)) return alert("Enter 10-digit mobile for passenger "+(i+1));
      ps.push(p);
    }
    const base=bus.fare*t.pax;
    ses.set("nss_pending",{busId:bus.id,busName:bus.name,busNo:bus.no,from:t.from,to:t.to,date:t.date,time:bus.dep,passengers:ps,base,fee:NSS.serviceFee,total:base+NSS.serviceFee});
    location.href="payment.html";
  };
  let pf="";for(let i=0;i<t.pax;i++)pf+=`<div class="pax"><b>Passenger ${i+1}</b> <span id="ps${i}"></span><div class="row" style="margin-top:8px">
  <div><label>Name</label><input id="pn${i}" value="${i==0?esc(currentUser().name):""}"></div><div><label>Age</label><input id="pa${i}" type="number" min="1" max="110"></div>
  <div><label>Gender</label><select id="pg${i}"><option>Male</option><option>Female</option><option>Other</option></select></div>
  <div><label>Mobile</label><input id="pm${i}" maxlength="10" value="${i==0?esc(currentUser().mobile):""}"></div></div></div>`;
  $("#paxForms").innerHTML=pf;
}
function updateSummary(bus,t){
  const base=bus.fare*chosen.length;
  $("#sum").innerHTML=`<div><span>Bus</span><b>${bus.name}</b></div><div><span>From</span><b>${t.from}</b></div><div><span>To</span><b>${t.to}</b></div>
  <div><span>Date</span><b>${fmtDate(t.date)}</b></div><div><span>Time</span><b>${bus.dep}</b></div><div><span>Seat(s)</span><b>${chosen.join(", ")||"-"}</b></div>
  <div><span>Base Fare</span><b>₹${base}</b></div><div><span>Service Fee</span><b>₹${chosen.length?NSS.serviceFee:0}</b></div>
  <div class="tot"><span>Total</span><span>₹${chosen.length?base+NSS.serviceFee:0}</span></div>`;
  chosen.forEach((s,i)=>{const e=$("#ps"+i);if(e)e.textContent="- Seat "+s});
}
