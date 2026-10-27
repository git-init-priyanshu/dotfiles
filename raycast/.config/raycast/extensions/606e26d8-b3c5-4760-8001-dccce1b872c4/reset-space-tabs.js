"use strict";var n=Object.defineProperty;var s=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var m=(e,t)=>{for(var l in t)n(e,l,{get:t[l],enumerable:!0})},u=(e,t,l,c)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of p(t))!d.call(e,i)&&i!==l&&n(e,i,{get:()=>t[i],enumerable:!(c=s(t,i))||c.enumerable});return e};var f=e=>u(n({},"__esModule",{value:!0}),e);var y={};m(y,{default:()=>r});module.exports=f(y);var a=require("@raycast/api"),o=require("@raycast/utils");function w(){return(0,o.runAppleScript)(`
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
        click menu item "Reset all tabs in this Space" of menu "Tabs" of menu bar 1
      end tell
    end tell
  `)}async function r(){try{await w()}catch{await(0,a.closeMainWindow)(),await(0,a.showToast)({style:a.Toast.Style.Failure,title:"Failed to reset tabs in current space"})}}
