import{j as e,A as g,u as x,a as p,b as j,c as b,r as v,_ as w,I as n,N as d,G as L,d as R,l as f}from"./index-FCc3J_v7.js";const E=[{image:L,URL:"/auth/google"},{image:R,URL:"/auth/github"}],M=()=>{const{register:r,handleSubmit:l,reset:a,formState:{errors:i}}=x(),c=p(),m=j(),{data:s,status:u,error:S}=b(t=>t.user),h=async t=>{console.log("Form data submitted:",t),(await c(f(t))).payload.success&&m("/")};return v.useEffect(()=>{a({Email:(s==null?void 0:s.Email)||"",Password:(s==null?void 0:s.Password)||""})},[s,a]),e.jsxs(e.Fragment,{children:[u==="loading"&&e.jsx("div",{className:"loading",children:e.jsx(w,{color:"black",loading:!0,size:50,"aria-label":"Loading Spinner","data-testid":"loader"})}),e.jsx("h1",{children:"Login"}),e.jsx("p",{children:"Login to access your account"}),e.jsxs("form",{onSubmit:l(h),children:[e.jsx(n,{Text:"Email",name:"Email",type:"text",errors:i,...r("Email",{required:"Email is required",pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:"Invalid email address"}})}),e.jsx(n,{Text:"Password",name:"Password",type:"password",password:!0,errors:i,...r("Password",{required:"Password is required"})}),e.jsxs("div",{id:"ForgetAndRemember",children:[e.jsxs("div",{children:[e.jsx("input",{type:"checkbox",name:"RememberMe",id:"RememberMe",...r("RememberMe")}),e.jsx("label",{htmlFor:"RememberMe",children:"Remember me"})]}),e.jsx(d,{to:"/forgetpassword",id:"Forget",children:"Forget Password"})]}),e.jsx("input",{type:"submit",value:"Login"}),e.jsxs("p",{id:"HaveAccount",children:["Don’t have an account? ",e.jsx(d,{to:"/register",children:"Sign up"})]})]}),e.jsx("p",{id:"OtherMethods",children:"Or login with"}),e.jsx("div",{id:"Methods",children:E.map((t,o)=>e.jsx("a",{href:`http://localhost:5000${t.URL}`,children:e.jsx("img",{src:t.image,alt:"MethodLogin"})},o))})]})},F=()=>e.jsx(g,{Content:M});export{F as default};
