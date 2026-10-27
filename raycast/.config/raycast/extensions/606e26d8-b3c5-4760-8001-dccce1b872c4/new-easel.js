"use strict";var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var s=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var m=(t,e)=>{for(var n in e)a(t,n,{get:e[n],enumerable:!0})},w=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of s(e))!d.call(t,i)&&i!==n&&a(t,i,{get:()=>e[i],enumerable:!(o=p(e,i))||o.enumerable});return t};var u=t=>w(a({},"__esModule",{value:!0}),t);var y={};m(y,{default:()=>r});module.exports=u(y);var l=require("@raycast/api"),c=require("@raycast/utils");function f(){return(0,c.runAppleScript)(`
      tell application "Arc"
      if (count of windows) is 0 then
        make new window
      end if
      activate
    end tell
    delay (0.5)
    tell application "Arc"
      activate
    end tell

    tell application "System Events"
      tell process "Arc"
        click menu item "New Easel" of menu "File" of menu bar 1
      end tell
    end tell
  `)}async function r(){try{await f()}catch{await(0,l.closeMainWindow)(),await(0,l.showToast)({style:l.Toast.Style.Failure,title:"Failed opening a new Easel"})}}
