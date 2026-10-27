"use strict";var p=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var x=(t,e)=>{for(var i in e)p(t,i,{get:e[i],enumerable:!0})},g=(t,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of m(e))!b.call(t,o)&&o!==i&&p(t,o,{get:()=>e[o],enumerable:!(s=w(e,o))||s.enumerable});return t};var h=t=>g(p({},"__esModule",{value:!0}),t);var v={};x(v,{default:()=>f});module.exports=h(v);var n=require("@raycast/api");var l=require("@raycast/utils");var r=require("@raycast/api");var a=require("@raycast/api"),$=(0,a.getPreferenceValues)(),y=(0,a.getPreferenceValues)(),N=(0,a.getPreferenceValues)(),k=(0,a.getPreferenceValues)();function c(t){return t.title||`Space ${t.id}`}function _(t,e){let i=e.find(s=>c(s).toLowerCase()===t.toLowerCase()||s.id.toString()===t);return i&&c(i)}async function S(){await(0,l.runAppleScript)(`
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
  `)}var A=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function d(t){if(t){let e=await T();if(e)return _(t,e)}}async function u(t={}){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new window with properties {incognito:${t.incognito??!1}}
      activate

      ${t.space?`tell front window to tell space "${t.space}" to focus`:""}
      ${t.url?`tell front window to make new tab with properties {URL:"${t.url}"}`:""}
    end tell
  `)}async function T({launch:t=!0}={}){t&&await S();let e=await(0,l.runAppleScript)(`
    ${t?"":A}
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
  `);return e?JSON.parse(e):void 0}async function f(t){let e=await d(t.arguments.space);try{await(0,n.closeMainWindow)(),await u({space:e})}catch{await(0,n.showToast)({style:n.Toast.Style.Failure,title:"Failed opening a new window"})}}
