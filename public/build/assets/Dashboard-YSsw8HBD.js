import{r as x,q as _,j as e,a as F}from"./app-blqcz2ka.js";import{A as z}from"./AuthenticatedLayout-kiKgLwtF.js";import{F as N,a as b,b as k,c as p,d as C}from"./index.esm-gClIFQjr.js";import P from"./Item-XqTbX3md.js";import i from"./Partition-ibvXRe_Q.js";import{F as M}from"./FormModal-cQ564sEU.js";import S from"./FormTransferOrder-DcdXvpnU.js";import E from"./FormProduct-IjGkwlir.js";import o from"./FormVendor-WtK0MIQV.js";import O from"./FormPO-MO4BpT9T.js";import V from"./FormSpreadsheet-oOJg3vYb.js";import A from"./FormLocation-KNZz4e3r.js";import"./Toast-jZpznciG.js";import"./iconBase-NO4qN-QB.js";import"./ApplicationLogo-mwXWiQcY.js";import"./Modal-CJXU86wP.js";import"./transition-T632XX6Q.js";import"./ImportFile-jduXJnCt.js";import"./type-gQcyAYx5.js";import"./showToast-G_kMG87d.js";import"./ExportFile--mZz2lbg.js";import"./ItemHeader-JMPUsgFF.js";function te({auth:h}){var m,n;const[a,l]=x.useState(""),[u,d]=x.useState(!1),{products:j,locations:g,spreadsheets:w}=_().props,f=[{title:"Warehouse",icon:e.jsx(N,{}),color:"var(--sub-color)",dropdown:[{name:"New location",route:"#",callback:s=>t(s)}],features:[{name:"View location list",route:route("setup")}]},{title:"Inventory",icon:e.jsx(b,{}),color:"var(--sub-color)",dropdown:[{name:"New product",route:"#",callback:s=>t(s)},{name:"Transfer order",route:"#",callback:s=>t(s)},{name:"New inventory",route:"#"}],features:[{name:"View products list",route:route("products")},{divider:e.jsx("hr",{})},{name:"View inventory list",route:route("inventories")}]}],v=[{title:"Stock count",route:"#"},{title:"Purchase order",route:"#"}],y=[{title:"Spreadsheet action",callback:s=>t(s),type:"spreadsheet"}],t=s=>{d(!0),l(s)},r=()=>{d(!1),l("")},c={new_location:{child:e.jsx(A,{handleCloseModal:r}),size:"2xl"},new_po:{child:e.jsx(O,{handleCloseModal:r}),size:"xl"},new_vendor:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},new_product:{child:e.jsx(E,{handleCloseModal:r}),size:"3xl"},adjust_product:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},delete_product:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},transfer_order:{child:e.jsx(S,{handleCloseModal:r,locations:g,products:j}),size:"xl"},new_inventory:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},adjust_inventory:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},new_so:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},new_buyer:{child:e.jsx(o,{handleCloseModal:r}),size:"xl"},spreadsheet:{child:e.jsx(V,{handleCloseModal:r,spreadsheets:w}),size:"2xl"}};return e.jsxs(z,{user:h.user,children:[e.jsx(F,{title:"Dashboard"}),e.jsx("div",{className:"px-5 ",id:"dashboard",children:e.jsx("div",{className:"max-w-7xl mx-auto xsm:px-2 sm:px-4",children:e.jsx("div",{className:"overflow-hidden ",children:e.jsxs("div",{className:"md:p-2",children:[e.jsx(i,{id:"party-1",children:e.jsx("div",{className:"grid lg:grid-cols-3 lg:gap-4 sm:max-lg:grid-cols-2 sm:max-lg:gap-3 grid-cols-1 max-sm:gap-3 md:grid-cols-1",children:e.jsx(P,{data:f})})}),e.jsx(i,{id:"party-2",header:{title:"report",icon:e.jsx(k,{}),color:"var(--sub-color)"},children:e.jsx("div",{className:`grid 
                                    gap-2 grid-cols-2
                                    sm:max-lg:grid-cols-3
                                lg:grid-cols-4 lg:gap-4
                                max-md:text-xsm`,children:v.map(s=>e.jsxs("a",{href:s.route,className:"flex items-center max-ms:max-w-20 max-md:max-w-24 lg:w-50 justify-between capitalize shadow-md p-3 rounded-r-lg",children:[e.jsx("span",{className:"max-w-28",children:s.title}),e.jsx(p,{className:"text-sm "})]},s.title))})}),e.jsx(i,{id:"party-3",header:{title:"extra features",icon:e.jsx(C,{}),color:"var(--sub-color)"},children:e.jsx("div",{className:`grid 
                                    gap-2 grid-cols-2
                                    sm:max-lg:grid-cols-3
                                lg:grid-cols-4 lg:gap-4
                                max-md:text-xsm`,children:y.map(s=>e.jsxs("a",{href:s.route,className:"flex items-center max-ms:max-w-20 max-md:max-w-24 lg:w-50 justify-between capitalize shadow-md p-3 rounded-r-lg",onClick:()=>t(s.type??""),children:[e.jsx("span",{className:"max-w-40",children:s.title}),e.jsx(p,{className:"text-sm "})]},s.title))})})]})})})}),e.jsx(M,{name:a.replaceAll("_"," ").toLocaleUpperCase(),show:u,size:(m=c[a])==null?void 0:m.size,children:(n=c[a])==null?void 0:n.child})]})}export{te as default};