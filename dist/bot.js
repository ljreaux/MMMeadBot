"use strict";var M=Object.create;var w=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,B=Object.prototype.hasOwnProperty;var A=(e,n,r,c)=>{if(n&&typeof n=="object"||typeof n=="function")for(let a of k(n))!B.call(e,a)&&a!==r&&w(e,a,{get:()=>n[a],enumerable:!(c=v(n,a))||c.enumerable});return e};var T=(e,n,r)=>(r=e!=null?M(L(e)):{},A(n||!e||!e.__esModule?w(r,"default",{value:e,enumerable:!0}):r,e));var i=require("discord.js"),g=T(require("dotenv"));var R=["Beginner","10 Meads","20 Meads","25 Meads","30 Meads","40 Meads","50 Meads","75 Meads","100 Meads"],E=R.reduce((e,n)=>`${e}
${n}`),l=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!listranks",response:`Here is a list of available ranks: 

${E}`},{command:"?rank",response:"The rank command allows you to change your current rank based on the number of meads you have completed."},{command:"!recipes",response:"Here is the full list of recipes."},{command:"!abv",response:""},{command:"!meadtools",response:`Calculator: https://meadtools.com/
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
- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE`},{command:"!equipmentlist",response:"Here is basic equipment list: https://discord.com/channels/568934729676488704/853838172059729920/949501378462634035"},{command:"!raptPillBt",response:"Check out this cool project: https://discord.com/channels/568934729676488704/853838172059729920/1247224944283353148"}],h="?rank ",f=e=>{let n=!1;return["Administrator","Moderator","Mazer of the Week","Patreon Bot","Discord Mead Leader","MMM Patron","Mead Bot","Rythm","Server Booster","EasyPoll","Live Countdown Bot","YouTube Member","technician","YouTube","YT Bot","UMM2024","UMM 2024 Purgatory Member"].forEach(c=>{(c.toLowerCase()===e.toLowerCase()||c.toLowerCase().includes(e.toLowerCase()))&&(n=!0)}),n};var p={mead:"This is a mead recipe",test:"this is a test of updating recipes"};var $=e=>-668.962+1262.45*e-776.43*e**2+182.94*e**3,C=(e,n)=>{let r=-668.962+1262.45*e-776.43*e**2+182.94*e**3,c=-668.962+1262.45*n-776.43*n**2+182.94*n**3,a=.22+.001*r,o=(a*r+c)/(1+a),s=(r-o)/(2.0665-.010665*r),t=Math.round(s*(n/.794)*100)/100;return[Math.round($(n)+4.5*t),t]};g.default.config();var{token:x,welcomeChannel:j="",botSpamChannel:z=""}=process.env,m=new i.Client({intents:[i.GatewayIntentBits.Guilds,i.GatewayIntentBits.GuildMessages,i.GatewayIntentBits.MessageContent,i.GatewayIntentBits.GuildMembers,i.GatewayIntentBits.GuildPresences]});m.login(x);m.once(i.Events.ClientReady,e=>{console.log(`Ready! Logged in as ${e.user.tag}`)});m.on("messageCreate",e=>{if(e.author.bot)return;let n=e.content,{member:r}=e,c=r?.roles.cache.filter(o=>o.name.toLowerCase().includes("mead")||o.name.toLowerCase()==="beginner");if(n.toLowerCase().startsWith(h)){let o=n.substring(h.length);if(f(o)){e.channel.send(`You are in this discord server, but we do not grant you the rank of ${o}`);return}let s=e.guild?.roles.cache.find(t=>(o==="10"&&(o="10 "),t.name.toLowerCase()===o.toLowerCase()||t.name.toLowerCase().includes(o.toLowerCase())));if(!s){e.channel.send(`The role ${o} is not a valid role.`);return}c?.forEach(t=>r?.roles.remove(t.id)),r?.roles.add(s.id),e.channel.send(`You have been assigned to role "${s.name}"`).catch(t=>console.error(t));return}if(n.toLowerCase().startsWith("!recipes")){let[,o]=n.split(" "),s=o?.toLowerCase()||"";if(o&&s in p){e.channel.send(p[s]);return}else if(o){e.channel.send(`The recipe ${o} is not a valid recipe command.`);return}}if(n.toLowerCase().startsWith("!abv")){let[,o,s]=n.split(" "),[t,d]=[Number(o),Number(s)||.996];if(isNaN(t)||isNaN(d)||t<d||t>1.22||d>1.22||t-d>.165){e.channel.send("Please enter a valid number for OG and FG. Example: !abv 1.050 1.010");return}let[b,y]=C(t,d);e.channel.send(`An OG of ${t} and an FG of ${d} will make ${y}% ABV and ${b} delle units.`);return}for(let o of l)(o.command===n||n.includes(o.command))&&e.channel.send(o.response).catch(s=>console.error(s));let a=o=>{let s=[];return s=o.map(t=>`${t.command}
`),s};if(n=="!list"){let o=`
**Available Bot Commands**
`,s=a(l),d=`${o}${s}`.replaceAll(",","");e.channel.send(d).catch(u=>console.error(u))}});m.on("guildMemberAdd",e=>{m.channels.cache.get(j).send(`Welcome to the MMM Discord Server <@${e.user.id}>!
 Please head over to <#${z}> and run **?rank (rank)** to recieve a rank and join your mini mead making community.

Run **!recipes** to get a list of popular MMM recipes.

You can find a list of all commands by running **!list**`)});
