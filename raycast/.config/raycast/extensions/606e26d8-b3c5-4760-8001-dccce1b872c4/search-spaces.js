"use strict";var w=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var $=Object.prototype.hasOwnProperty;var F=(t,e)=>{for(var i in e)w(t,i,{get:e[i],enumerable:!0})},W=(t,e,i,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of R(e))!$.call(t,s)&&s!==i&&w(t,s,{get:()=>e[s],enumerable:!(r=U(e,s))||r.enumerable});return t};var E=t=>W(w({},"__esModule",{value:!0}),t);var G={};F(G,{default:()=>N});module.exports=E(G);var I=require("@raycast/api"),P=require("@raycast/utils");var u=require("@raycast/utils");var a=require("@raycast/api");var p=require("@raycast/api"),H=(0,p.getPreferenceValues)(),M=(0,p.getPreferenceValues)(),J=(0,p.getPreferenceValues)(),Q=(0,p.getPreferenceValues)();function _(t){return t.title||`Space ${t.id}`}async function y(t,e){t&&a.environment.launchType!=="background"&&await(0,a.showToast)({style:a.Toast.Style.Failure,title:e?.title??"Something went wrong",message:e?.message??(t instanceof Error?t.message:String(t)),primaryAction:{title:"Copy Error",async onAction(i){let r=t instanceof Error&&(t?.stack||t?.message)||String(t);await a.Clipboard.copy(r),await i.hide()}}})}async function x(){await(0,u.runAppleScript)(`
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
  `)}var D=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function S(t){await B(t.id)}async function B(t){await x(),await(0,u.runAppleScript)(`
    tell application "Arc"
      tell front window
        tell space ${t} to focus
      end tell
      
      activate
    end tell
  `)}async function b({launch:t=!0}={}){t&&await x();let e=await(0,u.runAppleScript)(`
    ${t?"":D}
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
  `);return e?JSON.parse(e):void 0}async function A(){return await(0,u.runAppleScript)(`
    set _output to ""

    tell application "Arc"
      return version
    end tell
  `)}var n=require("@raycast/api"),K=require("@raycast/utils");var o=require("@raycast/api"),V=require("@raycast/utils"),T=require("react");var m=require("react/jsx-runtime");function v(t){async function e(){try{await S(t.space),(0,o.closeMainWindow)()}catch(i){await y(i,{title:"Failed opening Space"})}}return(0,m.jsx)(o.Action,{icon:o.Icon.Sidebar,title:"Open Space",onAction:e})}var c=require("react/jsx-runtime");function k(t){return(0,c.jsx)(n.List.Item,{title:_(t.space),actions:(0,c.jsxs)(n.ActionPanel,{children:[(0,c.jsx)(v,{space:t.space}),(0,c.jsx)(n.ActionPanel.Section,{children:(0,c.jsx)(n.Action.CopyToClipboard,{title:"Copy Space Title",content:_(t.space),shortcut:n.Keyboard.Shortcut.Common.CopyName})})]})})}var l=require("@raycast/api"),O=require("@raycast/utils"),L=require("path"),g=require("semver");var d=require("react/jsx-runtime"),h="0.85.0";function C(t){let{data:e,isLoading:i}=(0,O.useCachedPromise)(A);if(i&&!e)return(0,d.jsx)(l.Detail,{isLoading:!0});if(i&&e&&(0,g.lt)(e,h))return(0,d.jsx)(l.Detail,{isLoading:!0});if(!i&&!e)return(0,d.jsx)(l.Detail,{markdown:`## Something went wrong

We are unable to fetch the version of Arc. Please make sure Arc is correctly installed and try again.`});if(!i&&e&&(0,g.lt)(e,h)){let r=(0,L.join)(l.environment.assetsPath,"check-for-updates.png"),s=`## Version conflict

The extension requires Arc v${h}. Please update the app via Arc -> Check for Updates.

![Check for Updates](${r})`;return(0,d.jsx)(l.Detail,{markdown:s})}else return t.children}var f=require("react/jsx-runtime");function q(){let{data:t,isLoading:e}=(0,P.useCachedPromise)(b);return(0,f.jsx)(I.List,{isLoading:e,children:t?.map(i=>(0,f.jsx)(k,{space:i},i.id))})}function N(){return(0,f.jsx)(C,{children:(0,f.jsx)(q,{})})}
