"use strict";var n=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var p=Object.prototype.hasOwnProperty;var u=(t,a)=>{for(var r in a)n(t,r,{get:a[r],enumerable:!0})},C=(t,a,r,e)=>{if(a&&typeof a=="object"||typeof a=="function")for(let s of m(a))!p.call(t,s)&&s!==r&&n(t,s,{get:()=>a[s],enumerable:!(e=g(a,s))||e.enumerable});return t};var d=t=>C(n({},"__esModule",{value:!0}),t);var E={};u(E,{listArgs:()=>R,meadTools:()=>x});module.exports=d(E);var h="https://meadtools.com",k=["nutes","nutrients","nuteCalc"].map(t=>({arg:t,link:"/NuteCalc"})),b=["brixCalc","estOG","benchTrials","sulfite","sorbate","RefractometerCorrection","tempCorrection","blending"].map(t=>({arg:t,link:`/ExtraCalcs/${t}`})),f=[...k,...b,{arg:"stabilizers",link:"/stabilizers"},{arg:"abv",link:"/ExtraCalcs"},{arg:"brix",link:"/ExtraCalcs/brixCalc"},{arg:"temp",link:"/ExtraCalcs/tempCorrection"},{arg:"refractometer",link:"/ExtraCalcs/RefractometerCorrection"},{arg:"estimatedOG",link:"/ExtraCalcs/estOG"},{arg:"trials",link:"/ExtraCalcs/benchTrials"},{arg:"juice",link:"/juice"}].map(t=>({...t,link:`${h}${t.link}`})),o=[...f,{arg:"yeast",link:"https://yeasts.meadtools.com"}],x=t=>{let a=`[Calculator](<https://meadtools.com/>)
[Video walkthrough](<https://youtube.com/playlist?list=PLK2MubdaaOrUaQnjvfsJnqJv3agRmd4oS&si=ZV0NCqxCioRmg9mq>)

Run the command again with an argument from the list to get a more specific link. 
Run \`!arglist\`  for a list of arguments
  `,[,r]=t.content.split(" "),e=o.find(s=>r?.toLowerCase().startsWith(s.arg.toLowerCase()));return e?t.channel.send(e.link):t.channel.send(a)},R=t=>{let a=o.groupBy(e=>e.link),r=Object.entries(a).map(([e,s])=>{let i=e.split("/").pop()||"",l=s.map(c=>`- ${c.arg}`).join(`
`);return`**${i}**
${l}`}).join(`

`);t.channel.send(`Here are all the available arguments organized by URL path:

${r}`)};0&&(module.exports={listArgs,meadTools});
