/* ADMIN PANEL (demo only). Change these two lines to set your admin login. */
const ADMIN_USER = "admin";
const ADMIN_PASS = "nss@admin123";

const isAdmin = () => sessionStorage.getItem("nss_admin") === "yes";

function adminLogin(e){
  e.preventDefault();
  if($("#au").value.trim()===ADMIN_USER && $("#ap").value===ADMIN_PASS){
    sessionStorage.setItem("nss_admin","yes"); showAdmin();
  } else showMsg($("#msg"),"Wrong admin username or password.","err");
}
function adminLogout(){ sessionStorage.removeItem("nss_admin"); location.reload(); }

function table(head, rows){
  if(!rows.length) return "<p>No data yet.</p>";
  return `<div style="overflow-x:auto"><table class="tbl"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function showAdmin(){
  $("#gate").style.display="none"; $("#panel").style.display="block";
  const users=store.get("nss_users",[]), bk=store.get("nss_bookings",[]), en=store.get("nss_enquiries",[]), fb=store.get("nss_feedback",[]);
  const revenue = bk.reduce((s,b)=>s+(+b.total||0),0);
  $("#stats").innerHTML=[["👤 Users",users.length],["🎫 Bookings",bk.length],["💰 Total Amount","₹"+revenue],["📩 Enquiries",en.length],["⭐ Feedback",fb.length]]
    .map(x=>`<div class="card"><b style="font-size:26px;color:var(--red)">${x[1]}</b><br>${x[0]}</div>`).join("");
  $("#t-users").innerHTML=table(["Name","Mobile","Email"],users.map(u=>[esc(u.name),esc(u.mobile),esc(u.email)]));
  $("#t-bookings").innerHTML=table(["Booking ID","User","Passengers","Route","Date","Bus","Seats","Amount","Payment Ref","Status","Action"],
    bk.slice().reverse().map(b=>[esc(b.id),esc(b.userEmail),esc(b.passengers.map(p=>p.name+" ("+p.mobile+")").join(", ")),esc(b.from+" → "+b.to),esc(fmtDate(b.date)),esc(b.busName),esc(b.passengers.map(p=>p.seat).join(", ")),"₹"+esc(b.total),esc(b.payRef),esc(b.status),
    `<a href="ticket.html?id=${encodeURIComponent(b.id)}" target="_blank">View</a> | <a href="#" onclick="delBooking('${esc(b.id)}');return false">Delete</a>`]));
  $("#t-enq").innerHTML=table(["Name","Mobile","Email","From","To","Date","Message"],en.slice().reverse().map(e=>[esc(e.name),esc(e.mobile),esc(e.email),esc(e.from),esc(e.to),esc(e.date),esc(e.message)]));
  $("#t-fb").innerHTML=table(["Name","Email","Rating","Message"],fb.slice().reverse().map(f=>[esc(f.name),esc(f.email),"★".repeat(f.rating),esc(f.message)]));
}
function delBooking(id){
  if(!confirm("Delete booking "+id+"?"))return;
  store.set("nss_bookings",store.get("nss_bookings",[]).filter(b=>b.id!==id)); showAdmin();
}
function exportCSV(){
  const bk=store.get("nss_bookings",[]);
  const rows=[["BookingID","User","Passengers","From","To","Date","Bus","Seats","Amount","PaymentRef","Status"],
    ...bk.map(b=>[b.id,b.userEmail,b.passengers.map(p=>p.name).join(" / "),b.from,b.to,b.date,b.busName,b.passengers.map(p=>p.seat).join(" "),b.total,b.payRef,b.status])];
  const csv=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="nss-bookings.csv";a.click();
}
function tab(n){ ["users","bookings","enq","fb"].forEach(x=>$("#t-"+x).style.display=x===n?"block":"none"); $$(".tabs .btn").forEach(b=>b.style.opacity=b.dataset.t===n?1:.55); }
