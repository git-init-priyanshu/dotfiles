"use strict";var St=Object.create;var A=Object.defineProperty;var Tt=Object.getOwnPropertyDescriptor;var At=Object.getOwnPropertyNames;var vt=Object.getPrototypeOf,kt=Object.prototype.hasOwnProperty;var Lt=(t,e)=>{for(var n in e)A(t,n,{get:e[n],enumerable:!0})},K=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of At(e))!kt.call(t,r)&&r!==n&&A(t,r,{get:()=>e[r],enumerable:!(a=Tt(e,r))||a.enumerable});return t};var Ot=(t,e,n)=>(n=t!=null?St(vt(t)):{},K(e||!t||!t.__esModule?A(n,"default",{value:t,enumerable:!0}):n,t)),Ct=t=>K(A({},"__esModule",{value:!0}),t);var Gt={};Lt(Gt,{default:()=>wt});module.exports=Ct(Gt);var l=require("@raycast/utils");var p=require("@raycast/api");var y=require("@raycast/api"),Jt=(0,y.getPreferenceValues)(),v=(0,y.getPreferenceValues)(),Qt=(0,y.getPreferenceValues)(),Zt=(0,y.getPreferenceValues)();function q(t){try{return new URL(t).hostname.replace("www.","")}catch(e){console.error(e);return}}function I(t){return t.title||`Space ${t.id}`}function G(t){return`${t.id}`}function z(){return[{location:"topApp",order:Number(v.favoritesTabsOrder)},{location:"pinned",order:Number(v.pinnedTabsOrder)},{location:"unpinned",order:Number(v.unpinnedTabsOrder)}].sort((t,e)=>t.order-e.order).map(t=>t.location)}function H(t){switch(t){case"topApp":return"Favorites";case"pinned":return"Pinned Tabs";case"unpinned":return"Unpinned Tabs"}}function J(t){if(t)return t.length===1?"1 tab":`${t.length} tabs`}function N(t){return!!(t&&t.id&&t.url&&t.title&&t.location)}async function d(t,e){t&&p.environment.launchType!=="background"&&await(0,p.showToast)({style:p.Toast.Style.Failure,title:e?.title??"Something went wrong",message:e?.message??(t instanceof Error?t.message:String(t)),primaryAction:{title:"Copy Error",async onAction(n){let a=t instanceof Error&&(t?.stack||t?.message)||String(t);await p.Clipboard.copy(a),await n.hide()}}})}async function k(){await(0,l.runAppleScript)(`
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
  `)}var Pt=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function Q(t){let e=await(0,l.runAppleScript)(`
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
  `);return e?JSON.parse(e):void 0}async function U(t,e,n=!1){return await k(),(0,l.runAppleScript)(`
    tell application "Arc"
      tell first window
        try
          tell (first tab whose id is "${t}") to ${e}
        end try
      end tell
      ${n?"activate":""}
    end tell
  `)}async function R(t){await U(typeof t=="string"?t:t.id,"select",!0)}async function Z(t){await U(typeof t=="string"?t:t.id,"close")}async function X(t){await U(typeof t=="string"?t:t.id,"reload")}async function F(t={}){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new window with properties {incognito:${t.incognito??!1}}
      activate

      ${t.space?`tell front window to tell space "${t.space}" to focus`:""}
      ${t.url?`tell front window to make new tab with properties {URL:"${t.url}"}`:""}
    end tell
  `)}async function j(t){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new tab with properties {URL:"${t}"}
      activate
    end tell
  `)}async function Y(t,e){await k(),await(0,l.runAppleScript)(`
    tell application "Arc"
      tell front window      
        tell space ${e.id}
          make new tab with properties {URL:"${t}"}
        end tell
      end tell

      activate
    end tell
  `)}async function $({launch:t=!0}={}){t&&await k();let e=await(0,l.runAppleScript)(`
    ${t?"":Pt}
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
  `);return e?JSON.parse(e):void 0}async function tt(){return(await $())?.find(e=>e.isActive)}async function et(){return await(0,l.runAppleScript)(`
    set _output to ""

    tell application "Arc"
      return version
    end tell
  `)}async function it(t){await k();let e=await(0,l.runAppleScript)(`
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
          if _space_index is equal to (${t} as number) then
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
  `);return e?JSON.parse(e):void 0}var w=require("@raycast/api"),lt=require("@raycast/utils"),ut=require("lodash"),h=require("react"),pt=Ot(require("fuse.js")),dt=require("pinyin-pro");var s=require("@raycast/api"),st=require("@raycast/utils");var i=require("@raycast/api"),D=require("@raycast/utils"),x=require("react");var o=require("react/jsx-runtime");function It(t){async function e(){try{if(typeof t.tabOrUrl=="string")await(0,i.open)(t.tabOrUrl,"company.thebrowser.Browser");else try{await R(t.tabOrUrl),(0,i.closeMainWindow)()}catch(n){if(t.tabOrUrl.url)await(0,i.open)(t.tabOrUrl.url,"company.thebrowser.Browser");else throw n}}catch(n){console.error(n),await d(n,{title:"Failed opening in Arc"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Arc",onAction:e})}function Nt(t){async function e(){try{await F({url:t.url}),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in new window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in New Window",shortcut:{modifiers:["cmd","shift"],key:"enter"},onAction:e})}function Ut(t){async function e(){try{await F({incognito:!0,url:t.url}),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in new incognito window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Incognito Window",shortcut:{modifiers:["cmd","opt","shift"],key:"enter"},onAction:e})}function Rt(t){async function e(){try{await j(t.url),(0,i.closeMainWindow)()}catch(n){await d(n,{title:"Failed opening link in Little Arc window"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.Globe,title:"Open in Little Arc Window",onAction:e})}function Ft(t){let[e,n]=(0,x.useState)(!1),{data:a,isLoading:r}=(0,D.useCachedPromise)($,[],{execute:e});async function L(u){try{await Y(t.url,u),(0,i.closeMainWindow)()}catch(O){await d(O,{title:"Failed opening link in space"})}}return(0,o.jsx)(i.ActionPanel.Submenu,{icon:i.Icon.Sidebar,title:"Open in Space",isLoading:r,shortcut:{modifiers:["cmd","opt"],key:"enter"},onOpen:()=>n(!0),children:a?.map(u=>(0,o.jsx)(i.Action,{title:I(u),onAction:()=>L(u)},u.id))})}var $t=new Set(["com.apple.safari","com.apple.safaritechnologypreview","com.google.chrome","com.google.chrome.canary","org.mozilla.firefox","org.mozilla.firefoxdeveloperedition","com.brave.browser","com.operasoftware.opera","com.microsoft.edgemac","com.microsoft.edgemac.beta","com.vivaldi.vivaldi","com.kagi.kagimacos","app.zen-browser.zen","company.thebrowser.dia","ai.perplexity.comet"]);function Dt(t){let[e,n]=(0,x.useState)(),{data:a}=Wt({execute:e});return(0,o.jsx)(i.ActionPanel.Submenu,{icon:i.Icon.Globe,title:"Open in Other Browser",shortcut:i.Keyboard.Shortcut.Common.Open,onOpen:()=>n(!0),children:a?.map(r=>(0,o.jsx)(i.Action.Open,{icon:{fileIcon:r.path},title:r.name,target:t.url,application:r},r.path))})}function Wt(t){let e=(0,x.useCallback)(async()=>(await(0,i.getApplications)()).filter(a=>a.bundleId&&$t.has(a.bundleId.toLowerCase())).sort((a,r)=>a.name.localeCompare(r.name)),[]);return(0,D.useCachedPromise)(e,[],{execute:t?.execute})}function Et(t){async function e(){let n=`https://www.google.com/search?q=${encodeURIComponent(t.searchText)}`;try{let a=await Q(n);a?(await R(a),(0,i.closeMainWindow)()):await(0,i.open)(n,"company.thebrowser.Browser")}catch(a){console.error(a),await(0,i.open)(n,"company.thebrowser.Browser")}}return t.searchText?(0,o.jsx)(i.Action,{icon:i.Icon.MagnifyingGlass,title:"Search with Google",shortcut:{modifiers:["ctrl"],key:"return"},onAction:e}):null}function Bt(t){async function e(){await(0,i.showToast)({style:i.Toast.Style.Animated,title:"Reloading tab"});try{await X(t.tab),await(0,i.showToast)({style:i.Toast.Style.Success,title:"Reloaded tab"})}catch(n){await d(n,{title:"Failed reloading tab"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.ArrowClockwise,title:"Reload Tab",shortcut:{modifiers:["cmd","shift"],key:"r"},onAction:e})}function Mt(t){async function e(){await(0,i.showToast)({style:i.Toast.Style.Animated,title:"Closing tab"});try{await t.mutate(Z(t.tab),{optimisticUpdate(n){if(n)return n.filter(a=>a.id!==t.tab.id)}}),await(0,i.showToast)({style:i.Toast.Style.Success,title:"Closed tab"})}catch(n){await d(n,{title:"Failed closing tab"})}}return(0,o.jsx)(i.Action,{icon:i.Icon.XMarkCircle,title:"Close Tab",shortcut:{modifiers:["cmd","shift"],key:"w"},onAction:e})}function nt(t){let e=t.tabOrUrl;return N(t.tabOrUrl)?e=t.tabOrUrl.url:e=/^https?:\/\//i.test(e)?e:"https://"+e,(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(It,{tabOrUrl:N(t.tabOrUrl)?t.tabOrUrl:e}),(0,o.jsx)(Rt,{url:e})]}),(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(Nt,{url:e}),(0,o.jsx)(Ut,{url:e}),(0,o.jsx)(Ft,{url:e}),(0,o.jsx)(Dt,{url:e}),(0,o.jsx)(Et,{searchText:t.searchText})]})]})}function ot(t){return(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy URL",content:t.url,shortcut:i.Keyboard.Shortcut.Common.Copy}),t.title&&(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy Title",content:t.title,shortcut:i.Keyboard.Shortcut.Common.CopyName}),t.title&&(0,o.jsx)(i.Action.CopyToClipboard,{title:"Copy URL as Markdown",content:`[${t.title}](${t.url})`,shortcut:{modifiers:["cmd","opt","shift"],key:"c"}})]})}function at(t){return(0,o.jsxs)(i.ActionPanel.Section,{children:[(0,o.jsx)(Bt,{tab:t.tab}),(0,o.jsx)(Mt,{tab:t.tab,mutate:t.mutate})]})}function rt(t){return(0,o.jsx)(i.ActionPanel.Section,{children:(0,o.jsx)(i.Action.CreateQuicklink,{quicklink:{link:t.url,name:t.title,application:"Arc"},shortcut:i.Keyboard.Shortcut.Common.Save})})}var f=require("react/jsx-runtime");function ct(t){return(0,f.jsx)(s.List.Item,{icon:(0,st.getFavicon)(t.tab.url,{mask:s.Image.Mask.RoundedRectangle}),title:t.tab.title,subtitle:{value:q(t.tab.url),tooltip:t.tab.url},accessories:t.tab.spaceName?[{tag:t.tab.spaceName}]:[],keywords:[t.tab.url,...t.tab.spaceName?[t.tab.spaceName]:[]],actions:(0,f.jsxs)(s.ActionPanel,{children:[(0,f.jsx)(nt,{tabOrUrl:t.tab,searchText:t.searchText}),(0,f.jsx)(ot,{url:t.tab.url,title:t.tab.title}),(0,f.jsx)(rt,{url:t.tab.url,title:t.tab.title}),(0,f.jsx)(at,{tab:t.tab,mutate:t.mutate})]})})}var m=require("react/jsx-runtime");function Vt(t){let{tabTypes:e,onTabTypeChange:n}=t;return(0,m.jsx)(w.List.Dropdown,{tooltip:"Filter tabs by tab type",defaultValue:"All",storeValue:!0,onChange:a=>{n(a)},children:(0,m.jsx)(w.List.Dropdown.Section,{title:"Tabs Shown",children:e.map(a=>(0,m.jsx)(w.List.Dropdown.Item,{title:a.name,value:a.value},a.id))})})}function Kt(t){return(0,dt.pinyin)(t,{toneType:"none"}).replace(/\s+/g,"")}function ft(t){let[e,n]=(0,h.useState)(t.fallbackText??""),[a,r]=(0,h.useState)("unpinned"),L=[{id:0,name:"All Tabs",value:"all"},{id:1,name:"Favorites",value:"topApp"},{id:2,name:"Pinned",value:"pinned"},{id:3,name:"Unpinned",value:"unpinned"}],{data:u,isLoading:O,mutate:ht}=(0,lt.useCachedPromise)(t.getTabsFunction),M=(0,h.useMemo)(()=>u?.map(c=>({...c,titlePinyin:Kt(c.title)})),[u]),gt=z(),yt={keys:[{name:"title",weight:.2},{name:"titlePinyin",weight:.3},{name:"url",weight:.5},{name:"spaceName",weight:.15}],threshold:.3,includeScore:!0,shouldSort:!0,minMatchCharLength:1,distance:100,useExtendedSearch:!0,ignoreLocation:!0},xt=(c,g,_)=>{if(!c)return{};let C;return g.trim()===""?C=c.filter(T=>_==="all"||T.location===_):C=new pt.default(c,yt).search(g).map(P=>P.item).filter(P=>_==="all"||P.location===_),(0,ut.groupBy)(C,T=>T.location)},V=(0,h.useMemo)(()=>xt(M,e,a),[M,e,a]);return(0,m.jsx)(w.List,{isLoading:O,onSearchTextChange:n,searchBarAccessory:(0,m.jsx)(Vt,{tabTypes:L,onTabTypeChange:r}),children:gt.filter(c=>V[c]).map(c=>{let g=V[c];return(0,m.jsx)(w.List.Section,{title:H(c),subtitle:J(g),children:g?.map(_=>(0,m.jsx)(ct,{tab:_,searchText:e,mutate:ht},G(_)))},c)})})}var b=require("@raycast/api"),mt=require("@raycast/utils"),_t=require("path"),E=require("semver");var S=require("react/jsx-runtime"),W="0.85.0";function bt(t){let{data:e,isLoading:n}=(0,mt.useCachedPromise)(et);if(n&&!e)return(0,S.jsx)(b.Detail,{isLoading:!0});if(n&&e&&(0,E.lt)(e,W))return(0,S.jsx)(b.Detail,{isLoading:!0});if(!n&&!e)return(0,S.jsx)(b.Detail,{markdown:`## Something went wrong

We are unable to fetch the version of Arc. Please make sure Arc is correctly installed and try again.`});if(!n&&e&&(0,E.lt)(e,W)){let a=(0,_t.join)(b.environment.assetsPath,"check-for-updates.png"),r=`## Version conflict

The extension requires Arc v${W}. Please update the app via Arc -> Check for Updates.

![Check for Updates](${a})`;return(0,S.jsx)(b.Detail,{markdown:r})}else return t.children}var B=require("react/jsx-runtime");async function qt(){let t=await tt();if(t)return it(t.id)}function wt(t){return(0,B.jsx)(bt,{children:(0,B.jsx)(ft,{...t,getTabsFunction:qt})})}
