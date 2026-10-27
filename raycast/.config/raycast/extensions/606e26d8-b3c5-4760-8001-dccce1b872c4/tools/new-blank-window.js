"use strict";var a=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var u=(e,t)=>{for(var s in t)a(e,s,{get:t[s],enumerable:!0})},f=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of _(t))!d.call(e,i)&&i!==s&&a(e,i,{get:()=>t[i],enumerable:!(r=c(t,i))||r.enumerable});return e};var w=e=>f(a({},"__esModule",{value:!0}),e);var g={};u(g,{default:()=>x});module.exports=w(g);var l=require("@raycast/utils");var o=require("@raycast/api");var n=require("@raycast/api"),y=(0,n.getPreferenceValues)(),m=(0,n.getPreferenceValues)(),S=(0,n.getPreferenceValues)(),A=(0,n.getPreferenceValues)();async function p(){await(0,l.runAppleScript)(`
    tell application "Arc"
      activate
    end tell
    delay(0.5)
    tell application "Arc"
      activate
    end tell

    tell application "System Events"
      tell process "Arc"
        click menu item "Blank window" of menu "File" of menu bar 1
      end tell
    end tell
  `)}var b=async()=>{await p()},x=b;
