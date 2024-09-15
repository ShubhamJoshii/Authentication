import{c as u,j as e,A as m,u as g,a as f,_ as P,e as j,H as w,f as N,N as d,g as v,r as p,h as y,I as o,G as L,d as E,i as F}from"./index-FCc3J_v7.js";const V=()=>{g();const t=f(),{data:s,error:n,status:l}=u(a=>a.user);return e.jsxs(e.Fragment,{children:[l==="loading"&&e.jsx("div",{className:"loading",children:e.jsx(P,{color:"black",loading:!0,size:50,"aria-label":"Loading Spinner","data-testid":"loader"})}),e.jsxs("div",{id:"backBtn",onClick:()=>{t(j(s==null?void 0:s._id))},children:[e.jsx(w,{}),e.jsx("p",{children:"Back to sign up"})]}),e.jsx("h1",{children:"Verification Email"}),e.jsx("p",{children:"Verfication email has been sent to:"}),e.jsxs("div",{id:"emailVerify",children:[e.jsx("span",{onClick:()=>t(j(s==null?void 0:s._id)),children:"(edit)"}),e.jsx("span",{children:s.Email})]}),e.jsx("form",{children:e.jsxs("p",{id:"Resend",children:["Didn’t receive a code? ",e.jsx("span",{onClick:()=>t(N(s==null?void 0:s._id)),children:"Resend"})]})}),(n==null?void 0:n.target)==="OTP"&&e.jsx("p",{id:"message",children:n==null?void 0:n.message})]})},S=()=>e.jsxs(e.Fragment,{children:[e.jsx("h1",{children:"Email Verified"}),e.jsx("p",{children:"Verfication email has been Verified"}),e.jsx(d,{to:"/login",id:"loginRedirect",children:"Login"})]}),q=()=>e.jsxs(e.Fragment,{children:[e.jsx("h1",{children:"Email Already Verified"}),e.jsx("p",{children:"Verfication email has been Already Verified"}),e.jsx("span",{children:"Continue with login"}),e.jsx(d,{to:"/login",id:"loginRedirect",children:"Login"})]}),T=({direction:t})=>{const{page:s}=u(n=>n.user);return e.jsxs(e.Fragment,{children:[s==="SendedVerificationMail"&&e.jsx(m,{direction:t,Content:V}),s==="EmailVerified"&&e.jsx(m,{direction:t,Content:S}),s==="alreadyVerified"&&e.jsx(m,{direction:t,Content:q})]})},R=[{image:L,URL:"/auth/google"},{image:E,URL:"/auth/github"}],k=()=>{const t=new URLSearchParams(v().search);p.useEffect(()=>{const r=t.get("status");x(y(r))},[t]);const{register:s,handleSubmit:n,reset:l,formState:{errors:a}}=g(),{data:i,status:b,error:c}=u(r=>r.user),x=f();p.useEffect(()=>{l({FirstName:(i==null?void 0:i.FirstName)||"",LastName:(i==null?void 0:i.LastName)||"",Email:(i==null?void 0:i.Email)||"",PhoneNumber:(i==null?void 0:i.PhoneNumber)||"",Password:(i==null?void 0:i.Password)||"",ConfirmPassword:(i==null?void 0:i.ConfirmPassword)||""})},[l,i]);const C=r=>{console.log("Form data submitted:",r),x(F(r))};return e.jsxs(e.Fragment,{children:[b==="loading"&&e.jsx("div",{className:"loading",children:e.jsx(P,{color:"black",loading:!0,size:50,"aria-label":"Loading Spinner","data-testid":"loader"})}),e.jsx("h1",{children:"Sign up"}),e.jsx("p",{children:"Let’s get you all st up so you can access your personal account."}),e.jsxs("form",{onSubmit:n(C),children:[e.jsxs("div",{id:"inputCollection",children:[e.jsx(o,{Text:"First Name",name:"FirstName",type:"text",errors:a,...s("FirstName",{required:"First Name is required"})}),e.jsx(o,{Text:"Last Name",name:"LastName",type:"text",errors:a,...s("LastName",{required:"LastName is required"})})]}),e.jsxs("div",{id:"inputCollection",children:[e.jsx(o,{Text:"Email",name:"Email",type:"text",errors:a,...s("Email",{required:"Email is required",pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Invalid email address"}})}),(c==null?void 0:c.target)==="Email"&&e.jsx("p",{children:c.text}),e.jsx(o,{Text:"Phone Number",name:"PhoneNumber",type:"text",errors:a,...s("PhoneNumber",{required:"Phone Number is required"})})]}),e.jsx(o,{Text:"Password",name:"Password",type:"password",password:!0,errors:a,...s("Password",{required:"Password is required",minLength:{value:8,message:"Password must be at least 8 characters"},validate:{hasUppercase:r=>/[A-Z]/.test(r)||"Password must contain at least one uppercase letter",hasNumber:r=>/[0-9]/.test(r)||"Password must contain at least one number",hasSpecialChar:r=>/[!@#$%^&*]/.test(r)||"Password must contain at least one special character (!@#$%^&*)"}})}),e.jsx(o,{Text:"Confirm Password",name:"ConfirmPassword",type:"password",password:!0,errors:a,...s("ConfirmPassword",{required:"Please confirm your password",validate:(r,{Password:h})=>r===h||"Passwords do not match"})}),e.jsxs("div",{id:"TermAndCondition",children:[e.jsx("input",{type:"checkbox",name:"TermCondition",id:"TermCondition",required:!0,...s("TermCondition")}),e.jsxs("label",{htmlFor:"TermCondition",children:["I agree to all the"," ",e.jsx(d,{to:"/register",id:"Forget",children:"Terms"})," ","and"," ",e.jsxs(d,{to:"/register",id:"Forget",children:[" ","Privacy Policies"]})]})]}),e.jsx("input",{type:"submit",value:"Create account"}),e.jsxs("p",{id:"HaveAccount",children:["Already have an account? ",e.jsx(d,{to:"/login",children:"Login"})]})]}),e.jsx("p",{id:"OtherMethods",children:"Or Sign up with"}),e.jsx("div",{id:"Methods",children:R.map((r,h)=>e.jsx("a",{href:`http://localhost:5000${r.URL}`,children:e.jsx("img",{src:r.image,alt:"MethodLogin"})},h))})]})},U=()=>{const{page:t}=u(s=>s.user);return e.jsx(e.Fragment,{children:t!=="SendedVerificationMail"&&t!=="EmailVerified"&&t!=="alreadyVerified"?e.jsx(m,{direction:!0,Content:k}):e.jsx(T,{direction:!0})})};export{U as default};
