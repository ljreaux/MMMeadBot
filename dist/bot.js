"use strict";var g=Object.create;var p=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var B=(e,n,r,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let c of L(n))!v.call(e,c)&&c!==r&&p(e,c,{get:()=>n[c],enumerable:!(i=y(n,c))||i.enumerable});return e};var M=(e,n,r)=>(r=e!=null?g(b(e)):{},B(n||!e||!e.__esModule?p(r,"default",{value:e,enumerable:!0}):r,e));var a=require("discord.js"),u=M(require("dotenv"));var d=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!recipes",response:""},{command:"!meadnotes",response:`https://docs.google.com/document/d/1O0ebgOewuK0a1JKEsmlco3QJ0bp5B0tgGnbGm5S8syU/edit?usp=sharing
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
- https://savannahbee.com/?gclid=CjwKCAjw-L-ZBhB4EiwA76YzOVfGxD75mvkq38gsWncycP5T7m-yKFEArPeUeRhbybkul14IHzcm-BoCsv8QAvD_BwE`}],m="?rank ",w=e=>{let n=!1;return["Administrator","Moderator","Mazer of the Week","Patreon Bot","Discord Mead Leader","MMM Patron","Mead Bot","Rythm","Server Booster","EasyPoll","Live Countdown Bot","YouTube Member","technician","YouTube","YT Bot","UMM2024","UMM 2024 Purgatory Member"].forEach(i=>{(i.toLowerCase()===e.toLowerCase()||i.toLowerCase().includes(e.toLowerCase()))&&(n=!0)}),n};var l={mead:"This is a mead recipe"};u.default.config();var{token:k}=process.env,h=new a.Client({intents:[a.GatewayIntentBits.Guilds,a.GatewayIntentBits.GuildMessages,a.GatewayIntentBits.MessageContent]});h.login(k);h.once(a.Events.ClientReady,e=>{console.log(`Ready! Logged in as ${e.user.tag}`)});h.on("messageCreate",e=>{if(e.author.bot)return;let n=e.content,{member:r}=e,i=r?.roles.cache.filter(o=>o.name.toLowerCase().includes("mead")||o.name.toLowerCase()==="beginner");if(n.toLowerCase().startsWith(m)){let o=n.substring(m.length);if(w(o)){e.channel.send(`You are in this discord server, but we do not grant you the rank of ${o}`);return}let t=e.guild?.roles.cache.find(s=>(o==="10"&&(o="10 "),s.name.toLowerCase()===o.toLowerCase()||s.name.toLowerCase().includes(o.toLowerCase())));if(!t){e.channel.send(`The role ${o} is not a valid role.`);return}i?.forEach(s=>r?.roles.remove(s.id)),r?.roles.add(t.id),e.channel.send(`You have been assigned to role "${t.name}"`).catch(s=>console.error(s))}if(n.toLowerCase().startsWith("!recipes")){let[,o]=n.split(" "),t=o.toLowerCase();if(o&&t in l){e.channel.send(l[t]);return}else if(o){e.channel.send(`The recipe ${o} is not a valid recipe command.`);return}}for(let o of d)(o.command===n||n.includes(o.command))&&e.channel.send(o.response).catch(t=>console.error(t));let c=o=>{let t=[];return t=o.map(s=>`${s.command}
`),t};if(n=="!list"){let o=`
**Available Bot Commands**
`,t=c(d),f=`${o}${t}`.replaceAll(",","");e.channel.send(f).catch(C=>console.error(C))}});
