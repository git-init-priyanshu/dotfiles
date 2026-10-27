"use strict";var c=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var A=Object.prototype.hasOwnProperty;var T=(t,e)=>{for(var i in e)c(t,i,{get:e[i],enumerable:!0})},v=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of S(e))!A.call(t,s)&&s!==i&&c(t,s,{get:()=>e[s],enumerable:!(n=y(e,s))||n.enumerable});return t};var L=t=>v(c({},"__esModule",{value:!0}),t);var O={};T(O,{default:()=>x});module.exports=L(O);var o=require("@raycast/api");var l=require("@raycast/utils");var a=require("@raycast/api");var r=require("@raycast/api"),p=(0,r.getPreferenceValues)(),N=(0,r.getPreferenceValues)(),U=(0,r.getPreferenceValues)(),I=(0,r.getPreferenceValues)();function _(t){return t.title||`Space ${t.id}`}function d(t,e){let i=e.find(n=>_(n).toLowerCase()===t.toLowerCase()||n.id.toString()===t);return i&&_(i)}async function u(t){let e=/(http(s)?:\/\/|arc:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{0,256}(\.[a-z]{2,6})?\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;return t===void 0||t===""?(await(0,a.showToast)({style:a.Toast.Style.Failure,title:"No URL found"}),!1):e.test(t)?!0:(await(0,a.showToast)({style:a.Toast.Style.Failure,title:"Invalid URL provided"}),!1)}async function f(){await(0,l.runAppleScript)(`
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
  `)}var $=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function m(t,e){await f(),await(0,l.runAppleScript)(`
    tell application "Arc"
      tell front window
        ${e?`tell space "${e}" to focus`:""}
        make new tab with properties {URL:"${t}"}
      end tell

      activate
    end tell
  `)}async function w(t){if(t){let e=await k();if(e)return d(t,e)}}async function k({launch:t=!0}={}){t&&await f();let e=await(0,l.runAppleScript)(`
    ${t?"":$}
    set _output to ""

    tell application "Arc"
      set _space_index to 1
      
      tell front window
        set _active_space_id to id of active space
        
        repeat with _space in spaces
          set _title to get title of _space
          set _is_active to (id of _space is equal to _active_space_id)
          
          set _output to (_output & "{ \\"title\\": \\"" & _title & "\\", \\"id\\": " & _space_index & ", \\"isActive\\": " & _is_active & " }")
          
          if _space_index < (count spaces) then
            set _output to (_output & ",\\n")
          else
            set _output to (_output & "\\n")
          end if
          
          set _space_index to _space_index + 1
        end repeat
      end tell
    end tell
    
    return "[\\n" & _output & "\\n]"
  `);return e?JSON.parse(e):void 0}var R="arc://newtab",b=async(t,e)=>{try{if(await u(t)){let i=/^\S+?:\/\//i.test(t)?t:"https://"+t;await(0,o.closeMainWindow)(),await m(i,e)}}catch(i){console.error(i),await(0,o.showToast)({style:o.Toast.Style.Failure,title:"Failed opening a new tab"})}};async function x(t){let{url:e}=t.arguments,{fallbackText:i}=t,n=e||i||p.url||R,s=await w(t.arguments.space);if(n.includes(",")){let g=n.split(",").map(h=>b(h.trim(),s));return Promise.all(g)}else return await b(n,s)}
