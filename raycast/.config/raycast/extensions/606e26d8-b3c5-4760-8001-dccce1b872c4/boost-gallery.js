"use strict";var r=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var w=(e,t)=>{for(var o in t)r(e,o,{get:t[o],enumerable:!0})},m=(e,t,o,c)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of u(t))!f.call(e,n)&&n!==o&&r(e,n,{get:()=>t[n],enumerable:!(c=d(t,n))||c.enumerable});return e};var b=e=>m(r({},"__esModule",{value:!0}),e);var y={};w(y,{default:()=>_});module.exports=b(y);var i=require("@raycast/api");var l=require("@raycast/utils");var a=require("@raycast/api");var s=require("@raycast/api"),A=(0,s.getPreferenceValues)(),x=(0,s.getPreferenceValues)(),T=(0,s.getPreferenceValues)(),v=(0,s.getPreferenceValues)();async function g(){await(0,l.runAppleScript)(`
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
  `)}async function p(e,t){await g(),await(0,l.runAppleScript)(`
    tell application "Arc"
      tell front window
        ${t?`tell space "${t}" to focus`:""}
        make new tab with properties {URL:"${e}"}
      end tell

      activate
    end tell
  `)}var h="https://arc.net/boosts";async function _(){try{await(0,i.closeMainWindow)(),await p(h)}catch{await(0,i.showToast)({style:i.Toast.Style.Failure,title:"Failed opening Arc Boost Gallery"})}}
