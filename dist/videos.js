"use strict";var g=Object.create;var r=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty;var h=(e,n)=>{for(var o in n)r(e,o,{get:n[o],enumerable:!0})},a=(e,n,o,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of f(n))!v.call(e,i)&&i!==o&&r(e,i,{get:()=>n[i],enumerable:!(t=l(n,i))||t.enumerable});return e};var y=(e,n,o)=>(o=e!=null?g(u(e)):{},a(n||!e||!e.__esModule?r(o,"default",{value:e,enumerable:!0}):o,e)),S=e=>a(r({},"__esModule",{value:!0}),e);var V={};h(V,{getVideos:()=>m,handleVideos:()=>x});module.exports=S(V);var s=y(require("mongoose")),w=new s.default.Schema({command:{type:String,required:!0},response:{type:String,required:!0}}),c=s.default.models.video||s.default.model("video",w);var m=async()=>await c.find(),x=async(e,n)=>{let o=await m(),[,t]=e.split(" ");if(!t)return;let i=t?.toLowerCase()||"",d=o.find(p=>p.command.includes(i));return d?n.channel.send(d.response):n.channel.send(`The video ${t} is not a valid video command.`)};0&&(module.exports={getVideos,handleVideos});