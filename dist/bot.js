"use strict";var M=Object.create;var w=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var v=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var A=(e,n,s,c)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of v(n))!L.call(e,i)&&i!==s&&w(e,i,{get:()=>n[i],enumerable:!(c=k(n,i))||c.enumerable});return e};var T=(e,n,s)=>(s=e!=null?M(B(e)):{},A(n||!e||!e.__esModule?w(s,"default",{value:e,enumerable:!0}):s,e));var a=require("discord.js"),y=T(require("dotenv"));var l={mead:"This is a mead recipe",test:"this is a test of updating recipes"};var R=["Beginner","10 Meads","20 Meads","25 Meads","30 Meads","40 Meads","50 Meads","75 Meads","100 Meads"],$=R.reduce((e,n)=>`${e}
- ${n}`),E=Object.keys(l).reduce((e,n)=>`${e}
- ${n}`),u=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!listranks",response:`Here is a list of available ranks: 

${$}`},{command:"?rank",response:"The rank command allows you to change your current rank based on the number of meads you have completed."},{command:"!recipes",response:`Here is the full list of recipes.
${E}

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
- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE`},{command:"!equipmentlist",response:"Here is basic equipment list: https://discord.com/channels/568934729676488704/853838172059729920/949501378462634035"},{command:"!raptPillBt",response:"Check out this cool project: https://discord.com/channels/568934729676488704/853838172059729920/1247224944283353148"}],h="?rank ",f=e=>{let n=!1;return["Administrator","Moderator","Mazer of the Week","Patreon Bot","Discord Mead Leader","MMM Patron","Mead Bot","Rythm","Server Booster","EasyPoll","Live Countdown Bot","YouTube Member","technician","YouTube","YT Bot","UMM2024","UMM 2024 Purgatory Member"].forEach(c=>{(c.toLowerCase()===e.toLowerCase()||c.toLowerCase().includes(e.toLowerCase()))&&(n=!0)}),n};var j=e=>-668.962+1262.45*e-776.43*e**2+182.94*e**3,b=(e,n)=>{let s=-668.962+1262.45*e-776.43*e**2+182.94*e**3,c=-668.962+1262.45*n-776.43*n**2+182.94*n**3,i=.22+.001*s,o=(i*s+c)/(1+i),r=(s-o)/(2.0665-.010665*s),t=Math.round(r*(n/.794)*100)/100;return[Math.round(j(n)+4.5*t),t]};y.default.config();var{token:x,welcomeChannel:P="",botSpamChannel:Y=""}=process.env,m=new a.Client({intents:[a.GatewayIntentBits.Guilds,a.GatewayIntentBits.GuildMessages,a.GatewayIntentBits.MessageContent,a.GatewayIntentBits.GuildMembers,a.GatewayIntentBits.GuildPresences]});m.login(x);m.once(a.Events.ClientReady,e=>{console.log(`Ready! Logged in as ${e.user.tag}`)});m.on("messageCreate",e=>{if(e.author.bot)return;let n=e.content,{member:s}=e;if(n.includes("?kick")){if(!e.member?.permissionsIn(e.channel.id).has(a.PermissionsBitField.Flags.Administrator))return;let[,o]=n.split(" ");if(o=o.substring(2,o.length-2),!o){e.channel.send("You need to specify a user to kick.");return}if(!e.mentions.users){e.channel.send("User not found.");return}console.log(e.mentions.users);return}let c=s?.roles.cache.filter(o=>o.name.toLowerCase().includes("mead")||o.name.toLowerCase()==="beginner");if(n.toLowerCase().startsWith(h)){let o=n.substring(h.length);if(f(o)){e.channel.send(`You are in this discord server, but we do not grant you the rank of ${o}`);return}let r=e.guild?.roles.cache.find(t=>(o==="10"&&(o="10 "),t.name.toLowerCase()===o.toLowerCase()||t.name.toLowerCase().includes(o.toLowerCase())));if(!r){e.channel.send(`The role ${o} is not a valid role.`);return}c?.forEach(t=>s?.roles.remove(t.id)),s?.roles.add(r.id),e.channel.send(`You have been assigned to role "${r.name}"`).catch(t=>console.error(t));return}if(n.toLowerCase().startsWith("!recipes")){let[,o]=n.split(" "),r=o?.toLowerCase()||"";if(o&&r in l){e.channel.send(l[r]);return}else if(o){e.channel.send(`The recipe ${o} is not a valid recipe command.`);return}}if(n.toLowerCase().startsWith("!abv")){let[,o,r]=n.split(" "),[t,d]=[Number(o),Number(r)||.996];if(isNaN(t)||isNaN(d)||t<d||t>1.22||d>1.22||t-d>.165){e.channel.send("Please enter a valid number for OG and FG. Example: !abv 1.050 1.010");return}let[C,g]=b(t,d);e.channel.send(`An OG of ${t} and an FG of ${d} will make ${g}% ABV and ${C} delle units.`);return}for(let o of u)(o.command===n||n.includes(o.command))&&e.channel.send(o.response).catch(r=>console.error(r));let i=o=>{let r=[];return r=o.map(t=>`${t.command}
`),r};if(n=="!list"){let o=`
**Available Bot Commands**
`,r=i(u),d=`${o}${r}`.replaceAll(",","");e.channel.send(d).catch(p=>console.error(p))}});m.on("guildMemberAdd",e=>{m.channels.cache.get(P).send(`Welcome to the MMM Discord Server <@${e.user.id}>!
 Please head over to <#${Y}> and run **?rank (rank)** to recieve a rank and join your mini mead making community.

Run **!recipes** to get a list of popular MMM recipes.

You can find a list of all commands by running **!list**`)});
