"use strict";var l=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var w=Object.prototype.hasOwnProperty;var m=(t,e)=>{for(var i in e)l(t,i,{get:e[i],enumerable:!0})},b=(t,e,i,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of f(e))!w.call(t,s)&&s!==i&&l(t,s,{get:()=>e[s],enumerable:!(n=u(e,s))||n.enumerable});return t};var x=t=>b(l({},"__esModule",{value:!0}),t);var T={};m(T,{default:()=>v});module.exports=x(T);var r=require("@raycast/utils");var a=require("@raycast/api");var o=require("@raycast/api"),$=(0,o.getPreferenceValues)(),g=(0,o.getPreferenceValues)(),N=(0,o.getPreferenceValues)(),k=(0,o.getPreferenceValues)();function p(t){return t.title||`Space ${t.id}`}function c(t,e){let i=e.find(n=>p(n).toLowerCase()===t.toLowerCase()||n.id.toString()===t);return i&&p(i)}async function h(){await(0,r.runAppleScript)(`
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
  `)}var y=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function _(t){if(t){let e=await S();if(e)return c(t,e)}}async function d(t={}){await(0,r.runAppleScript)(`
    tell application "Arc"
      make new window with properties {incognito:${t.incognito??!1}}
      activate

      ${t.space?`tell front window to tell space "${t.space}" to focus`:""}
      ${t.url?`tell front window to make new tab with properties {URL:"${t.url}"}`:""}
    end tell
  `)}async function S({launch:t=!0}={}){t&&await h();let e=await(0,r.runAppleScript)(`
    ${t?"":y}
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
  `);return e?JSON.parse(e):void 0}var A=async t=>{let e=await _(t.spaceId);await d({space:e})},v=A;
