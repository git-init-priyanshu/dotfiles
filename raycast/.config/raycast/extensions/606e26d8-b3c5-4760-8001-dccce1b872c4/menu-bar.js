"use strict";var u=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var $=Object.getOwnPropertyNames;var N=Object.prototype.hasOwnProperty;var O=(t,e)=>{for(var o in e)u(t,o,{get:e[o],enumerable:!0})},R=(t,e,o,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of $(e))!N.call(t,n)&&n!==o&&u(t,n,{get:()=>e[n],enumerable:!(s=I(e,n))||s.enumerable});return t};var P=t=>R(u({},"__esModule",{value:!0}),t);var B={};O(B,{default:()=>k});module.exports=P(B);var i=require("@raycast/api"),l=require("@raycast/utils"),m=require("lodash");var r=require("@raycast/utils");var p=require("@raycast/api");var c=require("@raycast/api"),K=(0,c.getPreferenceValues)(),C=(0,c.getPreferenceValues)(),D=(0,c.getPreferenceValues)(),V=(0,c.getPreferenceValues)();function b(t){try{return new URL(t).hostname.replace("www.","")}catch(e){console.error(e);return}}function g(t){return t.title||`Space ${t.id}`}function x(t){return`${t.id}`}function f(t,e){let o=e+1,s;return o>=1&&o<=9&&(s={modifiers:t,key:String(o)}),s}async function d(){await(0,r.runAppleScript)(`
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
  `)}var h=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function y({launch:t=!0}={}){t&&await d();let e=await(0,r.runAppleScript)(`
    ${t?"":h}
    on escape_value(this_text)
      set AppleScript's text item delimiters to "\\\\"
      set the item_list to every text item of this_text
      set AppleScript's text item delimiters to "\\\\\\\\"
      set this_text to the item_list as string
      set AppleScript's text item delimiters to "\\""
      set the item_list to every text item of this_text
      set AppleScript's text item delimiters to "\\\\\\""
      set this_text to the item_list as string
      set AppleScript's text item delimiters to ""
      return this_text
    end escape_value

    set _output to ""

    tell application "Arc"
      tell first window
        set allTabs to properties of every tab
      end tell
      set tabsCount to count of allTabs
      repeat with i from 1 to tabsCount
        set _tab to item i of allTabs
        set _title to my escape_value(get title of _tab)
        set _url to get URL of _tab
        set _id to get id of _tab
        set _location to get location of _tab
          
        set _output to (_output & "{ \\"title\\": \\"" & _title & "\\", \\"url\\": \\"" & _url & "\\", \\"id\\": \\"" & _id & "\\", \\"location\\": \\"" & _location & "\\" }")
        
        if i < tabsCount then
          set _output to (_output & ",\\n")
        else
          set _output to (_output & "\\n")
        end if

      end repeat
    end tell
    
    return "[\\n" & _output & "\\n]"
  `);return e?JSON.parse(e):void 0}async function S(t){let e=await(0,r.runAppleScript)(`
  on escape_value(this_text)
    set AppleScript's text item delimiters to "\\""
    set the item_list to every text item of this_text
    set AppleScript's text item delimiters to "\\\\\\""
    set this_text to the item_list as string
    set AppleScript's text item delimiters to ""
    return this_text
  end replace_chars

    set _output to ""

    tell application "Arc"
      set _window_index to 1

      repeat with _window in windows
          set _tab_index to 1
          
          repeat with _tab in tabs of _window
            set _url to get URL of _tab

            if _url is equal "${t}" then
              set _title to my escape_value(get title of _tab)
              set _location to get location of _tab
          
              set _output to (_output & "{ \\"title\\": \\"" & _title & "\\", \\"url\\": \\"" & _url & "\\", \\"windowId\\": " & _window_index & ", \\"tabId\\": " & _tab_index & " , \\"location\\": \\"" & _location & "\\" }")
                        
              return _output
            end if

            set _tab_index to _tab_index + 1
          end repeat
          
          set _window_index to _window_index + 1
      end repeat
    end tell

    return _output
  `);return e?JSON.parse(e):void 0}async function U(t,e,o=!1){return await d(),(0,r.runAppleScript)(`
    tell application "Arc"
      tell first window
        try
          tell (first tab whose id is "${t}") to ${e}
        end try
      end tell
      ${o?"activate":""}
    end tell
  `)}async function A(t){await U(typeof t=="string"?t:t.id,"select",!0)}async function T(t){await E(t.id)}async function E(t){await d(),await(0,r.runAppleScript)(`
    tell application "Arc"
      tell front window
        tell space ${t} to focus
      end tell
      
      activate
    end tell
  `)}async function v({launch:t=!0}={}){t&&await d();let e=await(0,r.runAppleScript)(`
    ${t?"":h}
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
  `);return e?JSON.parse(e):void 0}var a=require("react/jsx-runtime"),L=25,M=()=>v({launch:!1}),W=()=>y({launch:!1});function k(){let{data:t,isLoading:e}=(0,l.useCachedPromise)(M),{data:o,isLoading:s}=(0,l.useCachedPromise)(W);return(0,a.jsxs)(i.MenuBarExtra,{icon:{source:{light:"outline-light.svg",dark:"outline-dark.svg"}},isLoading:e||s,children:[(0,a.jsx)(i.MenuBarExtra.Section,{title:"Spaces",children:t?.slice(0,L).map((n,_)=>(0,a.jsx)(i.MenuBarExtra.Item,{title:(0,m.truncate)(g(n)),shortcut:f(["ctrl"],_),onAction:async()=>await T(n)},n.id))}),(0,a.jsx)(i.MenuBarExtra.Section,{title:"Favorite Tabs",children:o?.filter(n=>n.location==="topApp").slice(0,L).map((n,_)=>(0,a.jsx)(i.MenuBarExtra.Item,{icon:(0,l.getFavicon)(n.url,{mask:i.Image.Mask.RoundedRectangle}),title:(0,m.truncate)(n.title),subtitle:b(n.url),shortcut:f(["cmd"],_),onAction:async()=>{let w=await S(n.url);w?await A(w):await(0,i.open)(n.url,"company.thebrowser.Browser")}},x(n)))}),(0,a.jsxs)(i.MenuBarExtra.Section,{children:[(0,a.jsx)(i.MenuBarExtra.Item,{title:"View All Spaces",shortcut:i.Keyboard.Shortcut.Common.Save,onAction:async()=>await(0,i.launchCommand)({name:"search-spaces",type:i.LaunchType.UserInitiated})}),(0,a.jsx)(i.MenuBarExtra.Item,{title:"View All Tabs",shortcut:{modifiers:["cmd"],key:"t"},onAction:async()=>await(0,i.launchCommand)({name:"search-tabs",type:i.LaunchType.UserInitiated})}),(0,a.jsx)(i.MenuBarExtra.Item,{title:"Configure Command",tooltip:"Open Command Preferences",onAction:i.openCommandPreferences},"preferences")]})]})}
