"use strict";var V=Object.create;var n=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var D=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var S=(e,t)=>{for(var o in t)n(e,o,{get:t[o],enumerable:!0})},c=(e,t,o,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of R(t))!L.call(e,a)&&a!==o&&n(e,a,{get:()=>t[a],enumerable:!(r=_(t,a))||r.enumerable});return e};var u=(e,t,o)=>(o=e!=null?V(D(e)):{},c(t||!e||!e.__esModule?n(o,"default",{value:e,enumerable:!0}):o,e)),M=e=>c(n({},"__esModule",{value:!0}),e);var C={};S(C,{default:()=>h});module.exports=M(C);var f=require("discord.js"),p=u(require("rss-parser"));var i=u(require("mongoose")),j=new i.default.Schema({video_id:{type:String,required:!0},created_at:{type:Date,required:!0}}),d=i.default.models.NewVideo||i.default.model("NewVideo",j);var k=new p.default,{YOUTUBE_XML_URL:m,youtubeShenanigans:l,guildId:w}=process.env;async function h(e){try{if(!m||!l||!w)throw new Error;let o=await(await e.guilds.fetch(w)).channels.fetch(l),r=await k.parseURL(m),[a]=await d.find().lean(),g=a?.video_id||"",{id:s,title:y,link:U,author:x}=r.items[0];if(g!==s){await d.deleteMany({});let b=await(await d.create({created_at:new Date,video_id:s})).save();console.log("New video stored: ",b);let v=new f.EmbedBuilder({title:y,url:U,timestamp:Date.now(),image:{url:`https://img.youtube.com/vi/${s.slice(9)}/maxresdefault.jpg`},author:{name:x,iconURL:"https://yt3.googleusercontent.com/quhem18O3ZxjTxeHYD4B95wluihYXG5bmdUrY-dXD7-XrUwJUndGjpnys9H4lpA-W9Pzco51pkg=s160-c-k-c0x00ffffff-no-rj",url:"https://www.youtube.com/c/ManMadeMead/?sub_confirmation=1"},footer:{text:e.user?.tag||"",iconURL:e.user?.displayAvatarURL()||""}});await o?.send({embeds:[v]})}}catch(t){console.error("Error parsing RSS feed",t);return}}