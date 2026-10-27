"use strict";var a=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var u=(e,t)=>{for(var s in t)a(e,s,{get:t[s],enumerable:!0})},f=(e,t,s,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of _(t))!d.call(e,i)&&i!==s&&a(e,i,{get:()=>t[i],enumerable:!(l=c(t,i))||l.enumerable});return e};var w=e=>f(a({},"__esModule",{value:!0}),e);var S={};u(S,{default:()=>y});module.exports=w(S);var r=require("@raycast/utils");var o=require("@raycast/api");var n=require("@raycast/api"),v=(0,n.getPreferenceValues)(),m=(0,n.getPreferenceValues)(),T=(0,n.getPreferenceValues)(),L=(0,n.getPreferenceValues)();async function b(){await(0,r.runAppleScript)(`
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
  `)}var x=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function g({launch:e=!0}={}){e&&await b();let t=await(0,r.runAppleScript)(`
    ${e?"":x}
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
  `);return t?JSON.parse(t):void 0}async function p(){return(await g())?.find(t=>t.isActive)}var h=async()=>p(),y=h;
