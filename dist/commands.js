"use strict";var r=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var i=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var u=(t,e)=>{for(var s in e)r(t,s,{get:e[s],enumerable:!0})},p=(t,e,s,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of i(e))!m.call(t,n)&&n!==s&&r(t,n,{get:()=>e[n],enumerable:!(o=d(e,n))||o.enumerable});return t};var c=t=>p(r({},"__esModule",{value:!0}),t);var M={};u(M,{commands:()=>b,isUnauthorized:()=>w,rankCommand:()=>g});module.exports=c(M);var a={eightminutemead:"https://youtu.be/nA7tLIFcgts",meadmistakes:"https://youtu.be/rCN-TSSsRmc",yeasttest:"https://youtu.be/-_shVjrZIO4",applecinnamon:"https://youtu.be/NF1dhaeysB0",bottlecarbonation:"https://youtu.be/ipPIbB8tS0M",sweetmead:"https://youtu.be/sOpBxyrANlQ",hoppedblueberry:"https://youtu.be/dzUa_K-iRCY",carbonatedblueberry:"https://youtu.be/yAwLpol-G6A",allstyles:"https://youtu.be/08eQ-ylpvKk",discordmead1:"https://youtu.be/K78YNSn5sd8",discordmead2:"https://youtu.be/21OMY2OMmFg",discordmead3:" https://youtu.be/v0PnWMp0COw",discordmead4:"https://youtu.be/ZHfCwTogiqo",discordmead5:"https://youtu.be/wrL0TTeRu0w",discordmead6:"https://youtu.be/RqouA9Fl01s",discordmead7:"https://youtu.be/90HIPS_dnEM",discordmead8:"https://youtu.be/Todjm7wGbPU",brewsysucks:"https://youtu.be/2m-EmXL8QOo",peppermintmead:"https://youtu.be/6T7BdYta4YQ",mixedberrymead:"https://youtu.be/0J-p54wh1tI",rootbeermead:"https://youtu.be/UGuJgqhMwxU",TeaMead:"https://youtu.be/3Npbhc7Jp1k",pinacolada:"https://youtu.be/INJ-bxrRCBE",redpyment:"https://youtu.be/jESTDN9eqhU",meadmakingprocess:" https://youtu.be/NQmhIQXnnNg",whitepyment:"https://youtu.be/JXit06hwAZY",punishingyeast:"https://youtu.be/CsMJmDdQ-_o",dndmead:"https://youtu.be/GsHlL_Suw4M",hothoney:"https://youtu.be/cBZXGCQFX8I",meadsquidgame:"https://youtu.be/gGD9OuZtILc",cucumberlime:"https://youtu.be/hnT3RXN9v-Q"};var h=["Beginner","10 Meads","20 Meads","25 Meads","30 Meads","40 Meads","50 Meads","75 Meads","100 Meads"],y=h.reduce((t,e)=>`${t}
- ${e}`),l=Object.keys(a).reduce((t,e)=>`${t}
- ${e}`),b=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!listranks",response:`Here is a list of available ranks: 

${y}`},{command:"?rank",response:"The rank command allows you to change your current rank based on the number of meads you have completed."},{command:"!recipes",response:`Here is the full list of recipes.
${l}

Run !recipes (recipe name) to get an individual recipe`},{command:"!abv",response:""},{command:"!meadtools",response:`Calculator: https://meadtools.com/
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
- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE`},{command:"!equipmentlist",response:"Here is basic equipment list: https://discord.com/channels/568934729676488704/853838172059729920/949501378462634035"},{command:"!raptPillBt",response:"Check out this cool project: https://discord.com/channels/568934729676488704/853838172059729920/1247224944283353148"}],g="?rank ",w=t=>{let e=!1;return["Administrator","Moderator","Mazer of the Week","Patreon Bot","Discord Mead Leader","MMM Patron","Mead Bot","Rythm","Server Booster","EasyPoll","Live Countdown Bot","YouTube Member","technician","YouTube","YT Bot","UMM2024","UMM 2024 Purgatory Member"].forEach(o=>{(o.toLowerCase()===t.toLowerCase()||o.toLowerCase().includes(t.toLowerCase()))&&(e=!0)}),e};0&&(module.exports={commands,isUnauthorized,rankCommand});
