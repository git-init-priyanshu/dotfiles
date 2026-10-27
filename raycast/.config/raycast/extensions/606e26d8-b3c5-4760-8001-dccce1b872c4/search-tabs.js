"use strict";var St=Object.create;var v=Object.defineProperty;var At=Object.getOwnPropertyDescriptor;var vt=Object.getOwnPropertyNames;var kt=Object.getPrototypeOf,Lt=Object.prototype.hasOwnProperty;var Ot=(t,e)=>{for(var n in e)v(t,n,{get:e[n],enumerable:!0})},K=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of vt(e))!Lt.call(t,r)&&r!==n&&v(t,r,{get:()=>e[r],enumerable:!(a=At(e,r))||a.enumerable});return t};var Ct=(t,e,n)=>(n=t!=null?St(kt(t)):{},K(e||!t||!t.__esModule?v(n,"default",{value:t,enumerable:!0}):n,t)),Pt=t=>K(v({},"__esModule",{value:!0}),t);var qt={};Ot(qt,{default:()=>ht});module.exports=Pt(qt);var l=require("@raycast/utils");var u=require("@raycast/api");var y=require("@raycast/api"),Ht=(0,y.getPreferenceValues)(),k=(0,y.getPreferenceValues)(),Jt=(0,y.getPreferenceValues)(),Qt=(0,y.getPreferenceValues)();function q(t){try{return new URL(t).hostname.replace("www.","")}catch(e){console.error(e);return}}function I(t){return t.title||`Space ${t.id}`}function G(t){return`${t.id}`}function z(){return[{location:"topApp",order:Number(k.favoritesTabsOrder)},{location:"pinned",order:Number(k.pinnedTabsOrder)},{location:"unpinned",order:Number(k.unpinnedTabsOrder)}].sort((t,e)=>t.order-e.order).map(t=>t.location)}function H(t){switch(t){case"topApp":return"Favorites";case"pinned":return"Pinned Tabs";case"unpinned":return"Unpinned Tabs"}}function J(t){if(t)return t.length===1?"1 tab":`${t.length} tabs`}function N(t){return!!(t&&t.id&&t.url&&t.title&&t.location)}async function d(t,e){t&&u.environment.launchType!=="background"&&await(0,u.showToast)({style:u.Toast.Style.Failure,title:e?.title??"Something went wrong",message:e?.message??(t instanceof Error?t.message:String(t)),primaryAction:{title:"Copy Error",async onAction(n){let a=t instanceof Error&&(t?.stack||t?.message)||String(t);await u.Clipboard.copy(a),await n.hide()}}})}async function x(){await(0,l.runAppleScript)(`
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
  `)}var Q=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function U({launch:t=!0}={}){t&&await x();let e=await(0,l.runAppleScript)(`
    ${t?"":Q}
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
  `);return e?JSON.parse(e):void 0}async function Z(){await x();let t;try{t=await(0,l.runAppleScript)(`
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

      set _tabs to ""
      set _spaces to "{"
      set _space_index to 1
      set _first to true

      tell application "Arc"
        tell first window
          set _all_tabs to properties of every tab
          set _tabs_count to count of _all_tabs

          repeat with i from 1 to _tabs_count
            set _tab to item i of _all_tabs
            set _title to my escape_value(get title of _tab)
            set _url to get URL of _tab
            set _id to get id of _tab
            set _location to get location of _tab

            if i > 1 then
              set _tabs to (_tabs & ",\\n")
            end if
            set _tabs to (_tabs & "{ \\"title\\": \\"" & _title & "\\", \\"url\\": \\"" & _url & "\\", \\"id\\": \\"" & _id & "\\", \\"location\\": \\"" & _location & "\\" }")
          end repeat

          repeat with _space in spaces
            set _space_title to get title of _space
            if _space_title is "" then
              set _space_title to "Space " & _space_index
            end if
            set _space_title to my escape_value(_space_title)

            set _space_tab_ids to id of every tab of _space

            repeat with _tab_id in _space_tab_ids
              if not _first then
                set _spaces to (_spaces & ",")
              end if
              set _spaces to (_spaces & "\\"" & _tab_id & "\\": \\"" & _space_title & "\\"")
              set _first to false
            end repeat

            set _space_index to _space_index + 1
          end repeat
        end tell
      end tell

      return "{ \\"tabs\\": [\\n" & _tabs & "\\n], \\"spaces\\": " & _spaces & "} }"
    `)}catch(e){return console.error("getTabsWithSpaceInfo AppleScript failed, falling back to getTabs():",e),U()}if(!t)return console.error("getTabsWithSpaceInfo received empty response, falling back to getTabs()"),U();try{let e=JSON.parse(t);return e.tabs.map(n=>({...n,spaceName:e.spaces[n.id]}))}catch(e){return console.error("getTabsWithSpaceInfo failed to parse response, falling back to getTabs():",e),U()}}async function X(t){let e=await(0,l.runAppleScript)(`
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
  `);return e?JSON.parse(e):void 0}async function R(t,e,n=!1){return await x(),(0,l.runAppleScript)(`
    tell application "Arc"
      tell first window
        try
          tell (first tab whose id is "${t}") to ${e}
        end try
      end tell
      ${n?"activate":""}
    end tell
  `)}async function F(t){await R(typeof t=="string"?t:t.id,"select",!0)}async function j(t){await R(typeof t=="string"?t:t.id,"close")}async function Y(t){await R(typeof t=="string"?t:t.id,"reload")}async function $(t={}){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new window with properties {incognito:${t.incognito??!1}}
      activate

      ${t.space?`tell front window to tell space "${t.space}" to focus`:""}
      ${t.url?`tell front window to make new tab with properties {URL:"${t.url}"}`:""}
    end tell
  `)}async function tt(t){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new tab with properties {URL:"${t}"}
      activate
    end tell
  `)}async function et(t,e){await x(),await(0,l.runAppleScript)(`
    tell application "Arc"
      tell front window      
        tell space ${e.id}
          make new tab with properties {URL:"${t}"}
        end tell
      end tell

      activate
    end tell
  `)}async function it({launch:t=!0}={}){t&&await x();let e=await(0,l.runAppleScript)(`
    ${t?"":Q}
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
  `);return e?JSON.parse(e):void 0}async function nt(){return await(0,l.runAppleScript)(`
    set _output to ""

    tell application "Arc"
      return version
    end tell
  `)}var w=require("@raycast/api"),pt=require("@raycast/utils"),ut=require("lodash"),h=require("react"),dt=Ct(require("fuse.js")),mt=require("pinyin-pro");var s=require("@raycast/api"),ct=require("@raycast/utils");var i=require("@raycast/api"),W=require("@raycast/utils"),T=require("react");var o=require("react/jsx-runtime");function It(t){async function e(){try{if(typeof t.tabOrUrl=="string")await(0,i.open)(t.tabOrUrl,"company.thebrowser.Browser");else try{await F(t.tabOrUrl),(0,i.closeMainWindow)()}catch(n){if(t.tabOrUrl.url)await(0,i.open)(t.tabOrUrl.url,"company.thebrowser.Browser");else throw n}}catch(n){console.error(n),await d(n,{title:"Failed opening in Arc"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Arc",onAction:e})}function Nt(t){async function e(){try{await $({url:t.url}),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in new window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in New Window",shortcut:{modifiers:["cmd","shift"],key:"enter"},onAction:e})}function Ut(t){async function e(){try{await $({incognito:!0,url:t.url}),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in new incognito window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Incognito Window",shortcut:{modifiers:["cmd","opt","shift"],key:"enter"},onAction:e})}function Rt(t){async function e(){try{await tt(t.url),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in Little Arc window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Little Arc Window",onAction:e})}function Ft(t){let[e,n]=(0,T.useState)(!1),{data:a,isLoading:r}=(0,W.useCachedPromise)(it,[],{execute:e});async function L(p){try{await et(t.url,p),(0,i.closeMainWindow)()}catch(O){await d(O,{title:"Failed opening link in space"})}}return(0,o.jsx)(i.ActionPanel.Submenu,{icon:i.Icon.Sidebar,title:"Open in Space",isLoading:r,shortcut:{modifiers:["cmd","opt"],key:"enter"},onOpen:()=>n(!0),children:a?.map(p=>(0,o.jsx)(i.Action,{title:I(p),onAction:()=>L(p)},p.id))})}var $t=new Set(["com.apple.safari","com.apple.safaritechnologypreview","com.google.chrome","com.google.chrome.canary","org.mozilla.firefox","org.mozilla.firefoxdeveloperedition","com.brave.browser","com.operasoftware.opera","com.microsoft.edgemac","com.microsoft.edgemac.beta","com.vivaldi.vivaldi","com.kagi.kagimacos","app.zen-browser.zen","company.thebrowser.dia","ai.perplexity.comet"]);function Wt(t){let[e,n]=(0,T.useState)(),{data:a}=Dt({execute:e});return(0,o.jsx)(i.ActionPanel.Submenu,{icon:i.Icon.Globe,title:"Open in Other Browser",shortcut:i.Keyboard.Shortcut.Common.Open,onOpen:()=>n(!0),children:a?.map(r=>(0,o.jsx)(i.Action.Open,{icon:{fileIcon:r.path},title:r.name,target:t.url,application:r},r.path))})}function Dt(t){let e=(0,T.useCallback)(async()=>(await(0,i.getApplications)()).filter(a=>a.bundleId&&$t.has(a.bundleId.toLowerCase())).sort((a,r)=>a.name.localeCompare(r.name)),[]);return(0,W.useCachedPromise)(e,[],{execute:t?.execute})}function Et(t){async function e(){let n=`https://www.google.com/search?q=${encodeURIComponent(t.searchText)}`;try{let a=await X(n);a?(await F(a),(0,i.closeMainWindow)()):await(0,i.open)(n,"company.thebrowser.Browser")}catch(a){console.error(a),await(0,i.open)(n,"company.thebrowser.Browser")}}return t.searchText?(0,o.jsx)(i.Action,{icon:i.Icon.MagnifyingGlass,title:"Search with Google",shortcut:{modifiers:["ctrl"],key:"return"},onAction:e}):null}function Bt(t){async function e(){await(0,i.showToast)({style:i.Toast.Style.Animated,title:"Reloading tab"});try{await Y(t.tab),await(0,i.showToast)({style:i.Toast.Style.Success,title:"Reloaded tab"})}catch(n){await d(n,{title:"Failed reloading tab"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.ArrowClockwise,title:"Reload Tab",shortcut:{modifiers:["cmd","shift"],key:"r"},onAction:e})}function Mt(t){async function e(){await(0,i.showToast)({style:i.Toast.Style.Animated,title:"Closing tab"});try{await t.mutate(j(t.tab),{optimisticUpdate(n){if(n)return n.filter(a=>a.id!==t.tab.id)}}),await(0,i.showToast)({style:i.Toast.Style.Success,title:"Closed tab"})}catch(n){await d(n,{title:"Failed closing tab"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.XMarkCircle,title:"Close Tab",shortcut:{modifiers:["cmd","shift"],key:"w"},onAction:e})}function ot(t){let e=t.tabOrUrl;return N(t.tabOrUrl)?e=t.tabOrUrl.url:e=/^https?:\/\//i.test(e)?e:"https://"+e,(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(It,{tabOrUrl:N(t.tabOrUrl)?t.tabOrUrl:e}),(0,o.jsx)(Rt,{url:e})]}),(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(Nt,{url:e}),(0,o.jsx)(Ut,{url:e}),(0,o.jsx)(Ft,{url:e}),(0,o.jsx)(Wt,{url:e}),(0,o.jsx)(Et,{searchText:t.searchText})]})]})}function at(t){return(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy URL",content:t.url,shortcut:i.Keyboard.Shortcut.Common.Copy}),t.title&&(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy Title",content:t.title,shortcut:i.Keyboard.Shortcut.Common.CopyName}),t.title&&(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy URL as Markdown",content:`[${t.title}](${t.url})`,shortcut:{modifiers:["cmd","opt","shift"],key:"c"}})]})}function rt(t){return(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(Bt,{tab:t.tab}),(0,o.jsx)(Mt,{tab:t.tab,mutate:t.mutate})]})}function st(t){return(0,o.jsx)(i.ActionPanel.Section,{children:(0,o.jsx)(i.Action.CreateQuicklink,{quicklink:{link:t.url,name:t.title,application:"Arc"},shortcut:i.Keyboard.Shortcut.Common.Save})})}var m=require("react/jsx-runtime");function lt(t){return(0,m.jsx)(s.List.Item,{icon:(0,ct.getFavicon)(t.tab.url,{mask:s.Image.Mask.RoundedRectangle}),title:t.tab.title,subtitle:{value:q(t.tab.url),tooltip:t.tab.url},accessories:t.tab.spaceName?[{tag:t.tab.spaceName}]:[],keywords:[t.tab.url,...t.tab.spaceName?[t.tab.spaceName]:[]],actions:(0,m.jsxs)(s.ActionPanel,{children:[(0,m.jsx)(ot,{tabOrUrl:t.tab,searchText:t.searchText}),(0,m.jsx)(at,{url:t.tab.url,title:t.tab.title}),(0,m.jsx)(st,{url:t.tab.url,title:t.tab.title}),(0,m.jsx)(rt,{tab:t.tab,mutate:t.mutate})]})})}var f=require("react/jsx-runtime");function Vt(t){let{tabTypes:e,onTabTypeChange:n}=t;return(0,f.jsx)(w.List.Dropdown,{tooltip:"Filter tabs by tab type",defaultValue:"All",storeValue:!0,onChange:a=>{n(a)},children:(0,f.jsx)(w.List.Dropdown.Section,{title:"Tabs Shown",children:e.map(a=>(0,f.jsx)(w.List.Dropdown.Item,{title:a.name,value:a.value},a.id))})})}function Kt(t){return(0,mt.pinyin)(t,{toneType:"none"}).replace(/\s+/g,"")}function ft(t){let[e,n]=(0,h.useState)(t.fallbackText??""),[a,r]=(0,h.useState)("unpinned"),L=[{id:0,name:"All Tabs",value:"all"},{id:1,name:"Favorites",value:"topApp"},{id:2,name:"Pinned",value:"pinned"},{id:3,name:"Unpinned",value:"unpinned"}],{data:p,isLoading:O,mutate:gt}=(0,pt.useCachedPromise)(t.getTabsFunction),M=(0,h.useMemo)(()=>p?.map(c=>({...c,titlePinyin:Kt(c.title)})),[p]),yt=z(),xt={keys:[{name:"title",weight:.2},{name:"titlePinyin",weight:.3},{name:"url",weight:.5},{name:"spaceName",weight:.15}],threshold:.3,includeScore:!0,shouldSort:!0,minMatchCharLength:1,distance:100,useExtendedSearch:!0,ignoreLocation:!0},Tt=(c,g,_)=>{if(!c)return{};let C;return g.trim()===""?C=c.filter(A=>_==="all"||A.location===_):C=new dt.default(c,xt).search(g).map(P=>P.item).filter(P=>_==="all"||P.location===_),(0,ut.groupBy)(C,A=>A.location)},V=(0,h.useMemo)(()=>Tt(M,e,a),[M,e,a]);return(0,f.jsx)(w.List,{isLoading:O,onSearchTextChange:n,searchBarAccessory:(0,f.jsx)(Vt,{tabTypes:L,onTabTypeChange:r}),children:yt.filter(c=>V[c]).map(c=>{let g=V[c];return(0,f.jsx)(w.List.Section,{title:H(c),subtitle:J(g),children:g?.map(_=>(0,f.jsx)(lt,{tab:_,searchText:e,mutate:gt},G(_)))},c)})})}var b=require("@raycast/api"),_t=require("@raycast/utils"),bt=require("path"),E=require("semver");var S=require("react/jsx-runtime"),D="0.85.0";function wt(t){let{data:e,isLoading:n}=(0,_t.useCachedPromise)(nt);if(n&&!e)return(0,S.jsx)(b.Detail,{isLoading:!0});if(n&&e&&(0,E.lt)(e,D))return(0,S.jsx)(b.Detail,{isLoading:!0});if(!n&&!e)return(0,S.jsx)(b.Detail,{markdown:`## Something went wrong

We are unable to fetch the version of Arc. Please make sure Arc is correctly installed and try again.`});if(!n&&e&&(0,E.lt)(e,D)){let a=(0,bt.join)(b.environment.assetsPath,"check-for-updates.png"),r=`## Version conflict

The extension requires Arc v${D}. Please update the app via Arc -> Check for Updates.

![Check for Updates](${a})`;return(0,S.jsx)(b.Detail,{markdown:r})}else return t.children}var B=require("react/jsx-runtime");function ht(t){return(0,B.jsx)(wt,{children:(0,B.jsx)(ft,{...t,getTabsFunction:Z})})}
