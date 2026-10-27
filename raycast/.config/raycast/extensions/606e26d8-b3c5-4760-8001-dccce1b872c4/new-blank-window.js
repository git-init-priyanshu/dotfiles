"use strict";var r=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var w=(e,t)=>{for(var s in t)r(e,s,{get:t[s],enumerable:!0})},m=(e,t,s,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of u(t))!f.call(e,n)&&n!==s&&r(e,n,{get:()=>t[n],enumerable:!(l=d(t,n))||l.enumerable});return e};var b=e=>m(r({},"__esModule",{value:!0}),e);var g={};w(g,{default:()=>_});module.exports=b(g);var i=require("@raycast/api");var p=require("@raycast/utils");var a=require("@raycast/api");var o=require("@raycast/api"),y=(0,o.getPreferenceValues)(),x=(0,o.getPreferenceValues)(),S=(0,o.getPreferenceValues)(),A=(0,o.getPreferenceValues)();async function c(){await(0,p.runAppleScript)(`
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
  `)}async function _(){try{await(0,i.closeMainWindow)(),await c()}catch{await(0,i.showToast)({style:i.Toast.Style.Failure,title:"Failed opening a new blank window"})}}
