import{u as B,r as n,W as C,j as e,_ as l,o as D}from"./app-blqcz2ka.js";import{L as c,b as I,a as m,S as P,D as x}from"./Toast-jZpznciG.js";import{I as T}from"./InputImage-iSZ5kycp.js";import"./iconBase-NO4qN-QB.js";import"./index.esm-gClIFQjr.js";const R=({handleCloseModal:h})=>{const g=B(),o=[{location:"Stocked"},{location:"Non-Stocked"}],j=[{pricing:"normal price",currency:"USD",is_check:!1},{pricing:"usd",currency:"USD",is_check:!1}],[d,v]=n.useState([]),[N,L]=n.useState(j);n.useState({is_open:!1,type:""});const y=(t,s)=>{const r=l.omit(t,"total");console.log(r);const k=l.sum(l.values({...r,...s}));return{...r,...s,total:k}},[p,b]=n.useReducer(y,{total:0}),u=[{name:"Stocked Products (most common)",value:"stocked_product",describe:""},{name:"Serialized Products ",value:"serialized_product",describe:""},{name:"Non-stocked Products",value:"non_stocked_product",describe:""},{name:"Service",value:"service",describe:""}],{data:i,setData:a}=C({material:"",material_2:"",hts_code:"",hts_tax:"",brand:"",case:"",number_per_case:"",vendor_express:"",box_style:"",packaging:"",type:u[0].value,name:"",image:{}}),_=t=>{a("image",t.target.files[0]),console.log(i)},f=t=>{t.preventDefault(),i.name.length>0&&g(D())},S=t=>{t.preventDefault(),h()};return e.jsx(e.Fragment,{children:e.jsxs("form",{onSubmit:f,className:"gap-2",children:[e.jsxs("div",{className:"grid gap-4 grid-cols-2 max-md:grid-cols-1 ",children:[e.jsxs("div",{className:"px-3",children:[e.jsx(T,{handleImport:_}),e.jsxs("div",{className:"form-item",children:[e.jsx(c,{htmlFor:"description",value:"description"}),e.jsx(I,{id:"description",name:"description",onBlur:t=>a("name",t.target.value),required:!0,placeholder:"Description of product...",rows:4,maxLength:200})]})]}),e.jsxs("div",{className:"gap-y-2 pr-2",children:[e.jsxs("div",{className:"form-item",children:[e.jsx(c,{htmlFor:"product_name",value:"product name"}),e.jsx(m,{id:"product_name",type:"text",name:"product_name",required:!0,onBlur:t=>t.target.value.length>0&&a("name",t.target.value)})]}),e.jsxs("div",{className:"form-item",children:[e.jsx(c,{htmlFor:"product_type",value:"product type"}),e.jsx(P,{name:"type",id:"product_type",onChange:t=>a("type",t.target.value),children:u.map(t=>e.jsx("option",{value:t.value,children:t.name},t.value))})]}),e.jsxs("div",{className:"form-item-only-input grid gap-1 grid-cols-2 lg:grid-cols-3",children:[e.jsx("input",{type:"text",className:"input-text",placeholder:"Material",onBlur:t=>a("material",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Material 2",onBlur:t=>a("material_2",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"HTS Code",onBlur:t=>a("hts_code",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"HTS Tax",onBlur:t=>a("hts_tax",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Brand",onBlur:t=>a("brand",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Case",onBlur:t=>a("case",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Number Per Case",onBlur:t=>a("number_per_case",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Vendor Express",onBlur:t=>a("vendor_express",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Box Style",onBlur:t=>a("box_style",t.target.value)}),e.jsx("input",{type:"text",className:"input-text",placeholder:"Packaging",onBlur:t=>a("packaging",t.target.value)})]}),e.jsx("div",{})]})]}),e.jsxs("div",{className:"grid gap-4 grid-cols-2 max-md:grid-cols-1 ",children:[e.jsxs("div",{className:"",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx("div",{children:"quantity"}),e.jsx("div",{children:p.total})]}),e.jsx("hr",{}),e.jsx("div",{className:"panel-body",children:e.jsxs("table",{className:"",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Loaction"}),e.jsx("th",{children:"Quantity"})]})}),e.jsx("tbody",{children:!l.isEmpty(d)&&d.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.location}),e.jsx("td",{className:"flex justify-center",children:e.jsx("input",{type:"number",name:t.location,min:0,placeholder:"Number of product",className:"w-[50%] text-center border-0",value:p[t.location],onChange:s=>{b({[s.currentTarget.name]:parseInt(s.currentTarget.value)|0})}})})]},t.location))})]})}),e.jsx("div",{className:"panel-footer",children:e.jsx(x,{label:"More locations",className:"bg-[var(--background-sub-color)]",children:o.map((t,s)=>e.jsx(x.Item,{onClick:()=>{v(r=>[...r,...l.pullAt(o,s)])},children:t.location},t.location))})})]}),e.jsxs("div",{className:"panel",children:[e.jsx("div",{className:"panel-header",children:e.jsx("h2",{children:"PRICING & COST"})}),e.jsx("div",{className:"panel-body",children:N.map(t=>e.jsxs("div",{className:"form-item-inline",children:[e.jsx(c,{value:"Normal price",htmlFor:`price-${t.pricing}`}),e.jsx(m,{id:`price-${t.pricing}`,type:"text",value:"currency 0",required:!0,onChange:s=>console.log(s.target.value)})]},`inline-${t.pricing.replaceAll(" ","-")}`))}),e.jsx("div",{className:"panel-footer"})]})]}),e.jsx("div",{className:"divider"}),e.jsxs("div",{className:"flex flex-row-reverse",children:[e.jsx("button",{type:"submit",className:"bg-info",disabled:i.name.length<=0,children:"submit"}),e.jsx("button",{className:"bg-danger",onClick:S,children:"cancel"})]})]})})};export{R as default};
