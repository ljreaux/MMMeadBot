"use strict";var g=Object.create;var d=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var L=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var y=(e,o,s,i)=>{if(o&&typeof o=="object"||typeof o=="function")for(let c of C(o))!v.call(e,c)&&c!==s&&d(e,c,{get:()=>o[c],enumerable:!(i=w(o,c))||i.enumerable});return e};var k=(e,o,s)=>(s=e!=null?g(L(e)):{},y(o||!e||!e.__esModule?d(s,"default",{value:e,enumerable:!0}):s,e));var r=require("discord.js"),h=k(require("dotenv"));h.default.config();var{token:b}=process.env,l=new r.Client({intents:[r.GatewayIntentBits.Guilds,r.GatewayIntentBits.GuildMessages,r.GatewayIntentBits.MessageContent]});l.once(r.Events.ClientReady,e=>{console.log(`Ready! Logged in as ${e.user.tag}`)});var m=[{command:"!help",response:`# **Welcome to the Mead Bot!**

If you want a list of available commands, run **!list**

If you would like to change your rank, run **?rank (requested rank)**
This will add you to a private channel with your own little mead community.

Run **!recipes** to see a list of common recipes, or **!recipes (recipe name)** to see an individual recipe.`},{command:"!recipes",response:""}],u="?rank ";l.on("messageCreate",e=>{console.log("testing");let o=e.content,{member:s}=e,i=s?.roles.cache.filter(n=>n.name.toLowerCase().includes("mead"));if(e.author.bot)return;if(o.toLowerCase().startsWith(u)){let n=o.substring(u.length),t=e.guild?.roles.cache.find(a=>(n==="10"&&(n="10 "),a.name.toLowerCase()===n.toLowerCase()||a.name.toLowerCase().includes(n.toLowerCase())));if(!t){e.channel.send(`The role ${n} is not a valid role.`);return}i?.forEach(a=>s?.roles.remove(a.id)),s?.roles.add(t.id),e.channel.send(`You have been assigned to role "${t.name}"`).catch(a=>console.error(a))}for(let n of m)(n.command===o||o.includes(n.command))&&e.channel.send(n.response).catch(t=>console.error(t));let c=n=>{let t=[];return t=n.map(a=>`${a.command}
`),t};if(o=="!list"){let n=`
**Available Bot Commands**
`,t=c(m),f=`${n}${t}`.replaceAll(",","");e.channel.send(f).catch(p=>console.error(p))}});l.login(b);
