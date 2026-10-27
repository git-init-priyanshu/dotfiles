"use strict";var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var u=(t,e)=>{for(var i in e)a(t,i,{get:e[i],enumerable:!0})},f=(t,e,i,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of _(e))!d.call(t,n)&&n!==i&&a(t,n,{get:()=>e[n],enumerable:!(l=p(e,n))||l.enumerable});return t};var w=t=>f(a({},"__esModule",{value:!0}),t);var h={};u(h,{default:()=>g});module.exports=w(h);var r=require("@raycast/utils");var s=require("@raycast/api");var o=require("@raycast/api"),S=(0,o.getPreferenceValues)(),m=(0,o.getPreferenceValues)(),A=(0,o.getPreferenceValues)(),v=(0,o.getPreferenceValues)();async function b(){await(0,r.runAppleScript)(`
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
  `)}async function c(){await b();let t=await(0,r.runAppleScript)(`
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

    tell application "Arc"
      tell front window
        try
          set _tab to properties of active tab
        on error
          return ""
        end try

        set _title to my escape_value(get title of _tab)
        set _url to my escape_value(get URL of _tab)
        set _id to get id of _tab
        set _location to get location of _tab

        set _active_space_id to id of active space
        set _space_index to 1
        set _space_title to ""
        repeat with _space in spaces
          if id of _space is equal to _active_space_id then
            set _space_title to get title of _space
            exit repeat
          end if
          set _space_index to _space_index + 1
        end repeat
        if _space_title is "" then
          set _space_title to "Space " & _space_index
        end if
        set _space_title to my escape_value(_space_title)
      end tell
    end tell

    return "{ \\"title\\": \\"" & _title & "\\", \\"url\\": \\"" & _url & "\\", \\"id\\": \\"" & _id & "\\", \\"location\\": \\"" & _location & "\\", \\"spaceId\\": \\"" & _space_index & "\\", \\"spaceName\\": \\"" & _space_title & "\\" }"
  `),e=Array.from(t??"",i=>i<" "?`\\u${i.charCodeAt(0).toString(16).padStart(4,"0")}`:i).join("");return e?JSON.parse(e):void 0}var x=async()=>{let t=await c();if(!t)throw new Error("No tab is focused in the front Arc window.");return t},g=x;
