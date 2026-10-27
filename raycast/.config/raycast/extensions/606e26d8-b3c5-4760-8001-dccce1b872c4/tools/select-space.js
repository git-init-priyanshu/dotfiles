"use strict";var a=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var u=(t,e)=>{for(var s in e)a(t,s,{get:e[s],enumerable:!0})},f=(t,e,s,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of _(e))!d.call(t,i)&&i!==s&&a(t,i,{get:()=>e[i],enumerable:!(l=c(e,i))||l.enumerable});return t};var w=t=>f(a({},"__esModule",{value:!0}),t);var h={};u(h,{default:()=>g});module.exports=w(h);var r=require("@raycast/utils");var o=require("@raycast/api");var n=require("@raycast/api"),S=(0,n.getPreferenceValues)(),m=(0,n.getPreferenceValues)(),A=(0,n.getPreferenceValues)(),v=(0,n.getPreferenceValues)();async function b(){await(0,r.runAppleScript)(`
    if application "Arc" is not running then
      tell application "Arc" to activate
      delay 1
    else
      tell application "Arc"
        if (count of windows) is 0 then
          make new window
        end if
      end tell
    end if
  `)}async function p(t){await b(),await(0,r.runAppleScript)(`
    tell application "Arc"
      tell front window
        tell space ${t} to focus
      end tell
      
      activate
    end tell
  `)}var x=async t=>{await p(t.spaceId)},g=x;
