"use strict";var s=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var u=Object.prototype.hasOwnProperty;var p=(t,e)=>{for(var n in e)s(t,n,{get:e[n],enumerable:!0})},d=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of m(e))!u.call(t,r)&&r!==n&&s(t,r,{get:()=>e[r],enumerable:!(a=g(e,r))||a.enumerable});return t};var k=t=>d(s({},"__esModule",{value:!0}),t);var C={};p(C,{listArgs:()=>A,meadTools:()=>R});module.exports=k(C);var h="https://meadtools.com",b=["nutes","nutrients","nuteCalc"].map(t=>({arg:t,link:"/nute-calc"})),f=["brix","estimated-og","bench-trials","sulfite","sorbate","refractometer-correction","temperature-correction","blending","priming-sugar"].map(t=>({arg:t,link:`/extra-calcs/${t}`})),x=[...b,...f,{arg:"stabilizers",link:"/stabilizers"},{arg:"abv",link:"/extra-calcs"},{arg:"brix",link:"/extra-calcs/brix"},{arg:"temp",link:"/extra-calcs/temperature-correction"},{arg:"refractometer",link:"/extra-calcs/refractometer-correction"},{arg:"estimatedOG",link:"/extra-calcs/estimated-og"},{arg:"trials",link:"/extra-calcs/bench-trials"},{arg:"priming",link:"/extra-calcs/priming-sugar"},{arg:"juice",link:"/juice"},{arg:"yeast",link:"/yeast"}].map(t=>({...t,link:`${h}${t.link}`})),i=[...x],R=t=>{let e=`[Calculator](<https://meadtools.com/>)
[Video walkthrough](<https://youtube.com/playlist?list=PLK2MubdaaOrUaQnjvfsJnqJv3agRmd4oS&si=ZV0NCqxCioRmg9mq>)

Run the command again with an argument from the list to get a more specific link. 
Run \`!arglist\`  for a list of arguments
  `,[,n]=t.content.split(" "),a=i.find(r=>n?.toLowerCase().startsWith(r.arg.toLowerCase()));return a?t.channel.send(a.link):t.channel.send(e)},A=t=>{let e=i.groupBy(a=>a.link),n=Object.entries(e).map(([a,r])=>{let o=a.split("/").pop()||"",c=r.map(l=>`- ${l.arg}`).join(`
`);return`**${o}**
${c}`}).join(`

`);t.channel.send(`Here are all the available arguments organized by URL path:

${n}`)};0&&(module.exports={listArgs,meadTools});
