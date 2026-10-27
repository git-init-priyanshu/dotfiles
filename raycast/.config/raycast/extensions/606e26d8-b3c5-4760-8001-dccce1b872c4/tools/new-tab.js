"use strict";var l=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var h=Object.prototype.hasOwnProperty;var y=(t,e)=>{for(var i in e)l(t,i,{get:e[i],enumerable:!0})},S=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of g(e))!h.call(t,o)&&o!==i&&l(t,o,{get:()=>e[o],enumerable:!(n=x(e,o))||n.enumerable});return t};var A=t=>S(l({},"__esModule",{value:!0}),t);var O={};y(O,{default:()=>k});module.exports=A(O);var r=require("@raycast/utils");var s=require("@raycast/api");var a=require("@raycast/api"),p=(0,a.getPreferenceValues)(),T=(0,a.getPreferenceValues)(),I=(0,a.getPreferenceValues)(),P=(0,a.getPreferenceValues)();function c(t){return t.title||`Space ${t.id}`}function _(t,e){let i=e.find(n=>c(n).toLowerCase()===t.toLowerCase()||n.id.toString()===t);return i&&c(i)}async function d(t){let e=/(http(s)?:\/\/|arc:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{0,256}(\.[a-z]{2,6})?\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;return t===void 0||t===""?(await(0,s.showToast)({style:s.Toast.Style.Failure,title:"No URL found"}),!1):e.test(t)?!0:(await(0,s.showToast)({style:s.Toast.Style.Failure,title:"Invalid URL provided"}),!1)}async function u(){await(0,r.runAppleScript)(`
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
  `)}var v=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function f(t,e){await u(),await(0,r.runAppleScript)(`
    tell application "Arc"
      tell front window
        ${e?`tell space "${e}" to focus`:""}
        make new tab with properties {URL:"${t}"}
      end tell

      activate
    end tell
  `)}async function w(t){if(t){let e=await L();if(e)return _(t,e)}}async function L({launch:t=!0}={}){t&&await u();let e=await(0,r.runAppleScript)(`
    ${t?"":v}
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
  `);return e?JSON.parse(e):void 0}var N="arc://newtab",m=async(t,e)=>{if(await d(t)){let i=/^\S+?:\/\//i.test(t)?t:"https://"+t;await f(i,e)}},$=async t=>{let i=t.url||p.url||N,n=await w(t.spaceId);if(i.includes(",")){let o=i.split(",").map(b=>m(b.trim(),n));return Promise.all(o)}else return await m(i,n)},k=$;
