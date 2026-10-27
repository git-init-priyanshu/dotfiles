"use strict";var l=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var H=Object.prototype.hasOwnProperty;var P=(t,e)=>{for(var r in e)l(t,r,{get:e[r],enumerable:!0})},R=(t,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of S(e))!H.call(t,i)&&i!==r&&l(t,i,{get:()=>e[i],enumerable:!(s=E(e,i))||s.enumerable});return t};var D=t=>R(l({},"__esModule",{value:!0}),t);var _={};P(_,{default:()=>x});module.exports=D(_);var u=require("os"),a=require("fs"),n=require("path"),c=require("@raycast/utils"),p=(0,n.join)((0,u.homedir)(),"Library","Application Support","Arc","User Data"),m="History",A="Preferences";function d(t){try{let e=(0,n.join)(p,t,A);return JSON.parse((0,a.readFileSync)(e,"utf8"))?.profile?.name}catch{return}}var f=[],w=(0,n.join)(p,"Default",m);f.push({id:"Default",name:d("Default"),historyDatabasePath:w});for(let t=1;t<5;t++){let e=`Profile ${t}`,r=(0,n.join)(p,e,m);if(!(0,a.existsSync)(r))break;let i=d(e);i!=="__ARC_SYSTEM_PROFILE"&&f.push({id:e,name:i,historyDatabasePath:r})}function L(t,e=200){let r=t?t.split(" ").filter(s=>s.length>0).map(s=>`(url LIKE '%${s}%' ESCAPE '\\' OR title LIKE '%${s}%' ESCAPE '\\')`).join(" AND "):void 0;return`
    SELECT id,
          url,
          title,
          datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') AS lastVisitedAt
    FROM urls
    ${r?`WHERE ${r}`:""}
    GROUP BY url
    ORDER BY last_visit_time DESC
    LIMIT ${e};
  `}async function y(t,e=200){let r=[],s=t?.replace(/\\/g,"\\\\").replace(/'/g,"''").replace(/[%_]/g,"\\$&");for(let i of f)try{let o=L(s,e),h=(await(0,c.executeSQL)(i.historyDatabasePath,o)).map(g=>({...g,profileName:i.name||i.id}));r.push(...h)}catch(o){console.error(`Error fetching history for profile ${i.id}:`,o)}return r.sort((i,o)=>new Date(o.lastVisitedAt).getTime()-new Date(i.lastVisitedAt).getTime()),r}var b=async t=>await y(t.searchText,t.searchLimit??50),x=b;
