/* Register + Login (LocalStorage demo only - NOT secure) */
function registerUser(e){
  e.preventDefault();
  const m=$("#msg"), v=id=>$("#"+id).value.trim();
  const d={name:v("name"),mobile:v("mobile"),email:v("email").toLowerCase(),password:$("#password").value};
  if(!d.name||!d.mobile||!d.email||!d.password||!$("#cpassword").value) return showMsg(m,"Please fill all fields.","err");
  if(!/^\S+@\S+\.\S+$/.test(d.email)) return showMsg(m,"Enter a valid email.","err");
  if(!/^\d{10}$/.test(d.mobile)) return showMsg(m,"Mobile number must be 10 digits.","err");
  if(d.password.length<4) return showMsg(m,"Password must be at least 4 characters.","err");
  if(d.password!==$("#cpassword").value) return showMsg(m,"Passwords do not match.","err");
  const users=store.get("nss_users",[]);
  if(users.some(u=>u.email===d.email||u.mobile===d.mobile)) return showMsg(m,"Account already exists. Please login.","err");
  users.push(d); store.set("nss_users",users);
  showMsg(m,"Registration Successful! Redirecting to Login...","ok");
  setTimeout(()=>location.href="login.html",1500);
}
function loginUser(e){
  e.preventDefault();
  const id=$("#loginId").value.trim().toLowerCase(), pw=$("#password").value, m=$("#msg");
  const u=store.get("nss_users",[]).find(x=>(x.email===id||x.mobile===id)&&x.password===pw);
  if(!u) return showMsg(m,"Incorrect email/mobile or password.","err");
  store.set("nss_current_user",{name:u.name,email:u.email,mobile:u.mobile});
  showMsg(m,"Login successful! Redirecting...","ok");
  const next=ses.get("nss_after_login","index.html"); sessionStorage.removeItem("nss_after_login");
  setTimeout(()=>location.href=next,1000);
}
/* Pages that need login call this first */
function requireLogin(){
  if(!currentUser()){ses.set("nss_after_login",location.pathname.split("/").pop()||"index.html");location.href="login.html";return false}
  return true;
}
