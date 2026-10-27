"use strict";var r=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var w=(t,e)=>{for(var i in e)r(t,i,{get:e[i],enumerable:!0})},m=(t,e,i,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of u(e))!f.call(t,n)&&n!==i&&r(t,n,{get:()=>e[n],enumerable:!(l=d(e,n))||l.enumerable});return t};var b=t=>m(r({},"__esModule",{value:!0}),t);var A={};w(A,{default:()=>S});module.exports=b(A);var a=require("@raycast/utils");var o=require("@raycast/api");var s=require("@raycast/api"),v=(0,s.getPreferenceValues)(),x=(0,s.getPreferenceValues)(),L=(0,s.getPreferenceValues)(),$=(0,s.getPreferenceValues)();async function p(){await(0,a.runAppleScript)(`
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
  `)}var g=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function c({launch:t=!0}={}){t&&await p();let e=await(0,a.runAppleScript)(`
    ${t?"":g}
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
  `);return e?JSON.parse(e):void 0}async function h(t,e,i=!1){return await p(),(0,a.runAppleScript)(`
    tell application "Arc"
      tell first window
        try
          tell (first tab whose id is "${t}") to ${e}
        end try
      end tell
      ${i?"activate":""}
    end tell
  `)}async function _(t){await h(typeof t=="string"?t:t.id,"close")}var y=async t=>{if(!(await c())?.some(i=>i.id===t.tabId))throw new Error(`No tab with ID "${t.tabId}" found in the front Arc window. Use get-tabs to list the open tabs.`);await _(t.tabId)},S=y;
