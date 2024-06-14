"use strict";var a=Object.defineProperty;var r=Object.getOwnPropertyDescriptor;var c=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var d=(o,e)=>{for(var n in e)a(o,n,{get:e[n],enumerable:!0})},i=(o,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of c(e))!m.call(o,t)&&t!==n&&a(o,t,{get:()=>e[t],enumerable:!(s=r(e,t))||s.enumerable});return o};var h=o=>i(a({},"__esModule",{value:!0}),o);var g={};d(g,{commands:()=>w,isUnauthorized:()=>y,rankCommand:()=>u});module.exports=h(g);var l=["Beginner","10 Meads","20 Meads","25 Meads","30 Meads","40 Meads","50 Meads","75 Meads","100 Meads"],p=l.reduce((o,e)=>`${o}
${e}`),w=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!listranks",response:`Here is a list of available ranks: 

${p}`},{command:"?rank",response:"The rank command allows you to change your current rank based on the number of meads you have completed."},{command:"!recipes",response:"Here is the full list of recipes."},{command:"!abv",response:""},{command:"!meadtools",response:`Calculator: https://meadtools.com/
Video walkthrough: https://youtube.com/playlist?list=PLK2MubdaaOrUaQnjvfsJnqJv3agRmd4oS&si=ZV0NCqxCioRmg9mq`},{command:"!meadnotes",response:`https://docs.google.com/document/d/1O0ebgOewuK0a1JKEsmlco3QJ0bp5B0tgGnbGm5S8syU/edit?usp=sharing
Here are the Mead notes from the mead making 101-501 series.`},{command:"!honeylist",response:`Here is a list of honey vendors from our wonderful moderator Texas Longhouse Mead.
- https://www.gardnerbees.buzz/shop
- https://www.walkerhoneyfarm.com/
- https://www.dutchgoldhoney.com/
- https://beenaturalhoney.com/
- https://flyingbeeranch.net/
- https://zspecialtyfood.com/
- https://www.sweetneshoney.com/
- https://beeseasonal.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOTwO6rQyWHvh2aGVKShJ-Y7wJ2Y4adWFiQh3HbqL0hjCgciv-GTDgRoCHRIQAvD_BwE
- https://hawaiianhoneyats.com/
- https://www.sleepingbearfarms.com/product-category/raw-honey/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOXwDjr0HpedW3b5qWe4DppeU_4-Zd48mqSCczWRfQIFkfp2-S6HyjhoCogUQAvD_BwE
- https://www.desertcreekhoney.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOSJUYJDdJucdXRao6sMM4Hbl81_pML7aJ-ZPEBrISgx3joGC5NPy8xoCICAQAvD_BwE
- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE`},{command:"!equipmentlist",response:"Here is basic equipment list: https://discord.com/channels/568934729676488704/853838172059729920/949501378462634035"},{command:"!raptPillBt",response:"Check out this cool project: https://discord.com/channels/568934729676488704/853838172059729920/1247224944283353148"}],u="?rank ",y=o=>{let e=!1;return["Administrator","Moderator","Mazer of the Week","Patreon Bot","Discord Mead Leader","MMM Patron","Mead Bot","Rythm","Server Booster","EasyPoll","Live Countdown Bot","YouTube Member","technician","YouTube","YT Bot","UMM2024","UMM 2024 Purgatory Member"].forEach(s=>{(s.toLowerCase()===o.toLowerCase()||s.toLowerCase().includes(o.toLowerCase()))&&(e=!0)}),e};0&&(module.exports={commands,isUnauthorized,rankCommand});
