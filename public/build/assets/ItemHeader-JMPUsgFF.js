import{j as a,_ as f}from"./app-blqcz2ka.js";import{D as r}from"./Toast-jZpznciG.js";import{g as p}from"./index.esm-gClIFQjr.js";import"./iconBase-NO4qN-QB.js";const t=({title:c,icon:n,color:x,dropdown:l})=>a.jsxs("div",{style:{backgroundColor:x},className:"flex justify-between align-middle px-5 py-3 h-14 rounded-t-md ",children:[a.jsxs("span",{className:"flex items-center",children:[a.jsx("span",{className:"text-2xl",children:n}),a.jsx("span",{className:"ml-4 uppercase",children:c})]}),!f.isEmpty(l)&&a.jsx(r,{label:a.jsx(p,{}),arrowIcon:!1,className:"bg-[#ffffff]",children:l==null?void 0:l.map(s=>a.jsx(r.Item,{href:s==null?void 0:s.route,className:"max-sm:text-[10px]",children:a.jsx("div",{id:((s==null?void 0:s.name)??"").toLocaleLowerCase().replaceAll(" ","_"),onClick:o=>{var e;(e=s==null?void 0:s.callback)==null||e.call(s,o.currentTarget.id)},children:s.name})},s.name.toLocaleLowerCase()))})]});export{t as default};
