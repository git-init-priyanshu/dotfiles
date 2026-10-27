"use strict";var r=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var w=(e,t)=>{for(var i in t)r(e,i,{get:t[i],enumerable:!0})},m=(e,t,i,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of u(t))!f.call(e,n)&&n!==i&&r(e,n,{get:()=>t[n],enumerable:!(l=d(t,n))||l.enumerable});return e};var b=e=>m(r({},"__esModule",{value:!0}),e);var S={};w(S,{default:()=>y});module.exports=b(S);var a=require("@raycast/utils");var s=require("@raycast/api");var o=require("@raycast/api"),T=(0,o.getPreferenceValues)(),x=(0,o.getPreferenceValues)(),v=(0,o.getPreferenceValues)(),L=(0,o.getPreferenceValues)();async function c(){await(0,a.runAppleScript)(`
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
`;async function p({launch:e=!0}={}){e&&await c();let t=await(0,a.runAppleScript)(`
    ${e?"":g}
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
  `);return t?JSON.parse(t):void 0}async function _(e){await c();let t=await(0,a.runAppleScript)(`
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
      tell front window
        set _space_index to 1
        repeat with _space in spaces
          if _space_index is equal to (${e} as number) then
            set allTabs to properties of every tab of _space
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
            exit repeat
          end if
          set _space_index to _space_index + 1
        end repeat
      end tell
    end tell
    
    return "[\\n" & _output & "\\n]"
  `);return t?JSON.parse(t):void 0}var h=async e=>{let t=e.spaceId?await _(e.spaceId):await p();return e.tabLocation?t?.filter(i=>i.location===e.tabLocation):t},y=h;
