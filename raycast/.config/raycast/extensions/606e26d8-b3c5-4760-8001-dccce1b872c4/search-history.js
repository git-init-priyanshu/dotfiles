"use strict";var v=Object.defineProperty;var rt=Object.getOwnPropertyDescriptor;var st=Object.getOwnPropertyNames;var ct=Object.prototype.hasOwnProperty;var lt=(t,e)=>{for(var i in e)v(t,i,{get:e[i],enumerable:!0})},pt=(t,e,i,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of st(e))!ct.call(t,r)&&r!==i&&v(t,r,{get:()=>e[r],enumerable:!(o=rt(e,r))||o.enumerable});return t};var ut=t=>pt(v({},"__esModule",{value:!0}),t);var Ot={};lt(Ot,{default:()=>it});module.exports=ut(Ot);var h=require("@raycast/api"),et=require("react");var s=require("@raycast/api"),G=require("@raycast/utils");var n=require("@raycast/api"),I=require("@raycast/utils"),y=require("react");var l=require("@raycast/utils");var u=require("@raycast/api");var g=require("@raycast/api"),Ct=(0,g.getPreferenceValues)(),dt=(0,g.getPreferenceValues)(),It=(0,g.getPreferenceValues)(),Rt=(0,g.getPreferenceValues)();function D(t){try{return new URL(t).hostname.replace("www.","")}catch(e){console.error(e);return}}function F(t){let e=new Date(t.lastVisitedAt);return{date:e,tooltip:`Last visited: ${e.toLocaleString()}`}}function k(t){return t.title||`Space ${t.id}`}function L(t){return!!(t&&t.id&&t.url&&t.title&&t.location)}async function _(t,e){t&&u.environment.launchType!=="background"&&await(0,u.showToast)({style:u.Toast.Style.Failure,title:e?.title??"Something went wrong",message:e?.message??(t instanceof Error?t.message:String(t)),primaryAction:{title:"Copy Error",async onAction(i){let o=t instanceof Error&&(t?.stack||t?.message)||String(t);await u.Clipboard.copy(o),await i.hide()}}})}async function O(){await(0,l.runAppleScript)(`
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
  `)}var ft=`
  if application "Arc" is not running then return ""
  tell application "Arc"
    if (count of windows) is 0 then return ""
  end tell
`;async function H(t){let e=await(0,l.runAppleScript)(`
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
  `);return e?JSON.parse(e):void 0}async function mt(t,e,i=!1){return await O(),(0,l.runAppleScript)(`
    tell application "Arc"
      tell first window
        try
          tell (first tab whose id is "${t}") to ${e}
        end try
      end tell
      ${i?"activate":""}
    end tell
  `)}async function P(t){await mt(typeof t=="string"?t:t.id,"select",!0)}async function C(t={}){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new window with properties {incognito:${t.incognito??!1}}
      activate

      ${t.space?`tell front window to tell space "${t.space}" to focus`:""}
      ${t.url?`tell front window to make new tab with properties {URL:"${t.url}"}`:""}
    end tell
  `)}async function M(t){await(0,l.runAppleScript)(`
    tell application "Arc"
      make new tab with properties {URL:"${t}"}
      activate
    end tell
  `)}async function W(t,e){await O(),await(0,l.runAppleScript)(`
    tell application "Arc"
      tell front window      
        tell space ${e.id}
          make new tab with properties {URL:"${t}"}
        end tell
      end tell

      activate
    end tell
  `)}async function V({launch:t=!0}={}){t&&await O();let e=await(0,l.runAppleScript)(`
    ${t?"":ft}
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
  `);return e?JSON.parse(e):void 0}async function B(){return await(0,l.runAppleScript)(`
    set _output to ""

    tell application "Arc"
      return version
    end tell
  `)}var a=require("react/jsx-runtime");function _t(t){async function e(){try{if(typeof t.tabOrUrl=="string")await(0,n.open)(t.tabOrUrl,"company.thebrowser.Browser");else try{await P(t.tabOrUrl),(0,n.closeMainWindow)()}catch(i){if(t.tabOrUrl.url)await(0,n.open)(t.tabOrUrl.url,"company.thebrowser.Browser");else throw i}}catch(i){console.error(i),await _(i,{title:"Failed opening in Arc"})}}return(0,a.jsx)(n.Action,{icon:n.Icon.Globe,title:"Open in Arc",onAction:e})}function wt(t){async function e(){try{await C({url:t.url}),(0,n.closeMainWindow)()}catch(i){await _(i,{title:"Failed opening link in new window"})}}return(0,a.jsx)(n.Action,{icon:n.Icon.Globe,title:"Open in New Window",shortcut:{modifiers:["cmd","shift"],key:"enter"},onAction:e})}function ht(t){async function e(){try{await C({incognito:!0,url:t.url}),(0,n.closeMainWindow)()}catch(i){await _(i,{title:"Failed opening link in new incognito window"})}}return(0,a.jsx)(n.Action,{icon:n.Icon.Globe,title:"Open in Incognito Window",shortcut:{modifiers:["cmd","opt","shift"],key:"enter"},onAction:e})}function bt(t){async function e(){try{await M(t.url),(0,n.closeMainWindow)()}catch(i){await _(i,{title:"Failed opening link in Little Arc window"})}}return(0,a.jsx)(n.Action,{icon:n.Icon.Globe,title:"Open in Little Arc Window",onAction:e})}function gt(t){let[e,i]=(0,y.useState)(!1),{data:o,isLoading:r}=(0,I.useCachedPromise)(V,[],{execute:e});async function p(c){try{await W(t.url,c),(0,n.closeMainWindow)()}catch(f){await _(f,{title:"Failed opening link in space"})}}return(0,a.jsx)(n.ActionPanel.Submenu,{icon:n.Icon.Sidebar,title:"Open in Space",isLoading:r,shortcut:{modifiers:["cmd","opt"],key:"enter"},onOpen:()=>i(!0),children:o?.map(c=>(0,a.jsx)(n.Action,{title:k(c),onAction:()=>p(c)},c.id))})}var yt=new Set(["com.apple.safari","com.apple.safaritechnologypreview","com.google.chrome","com.google.chrome.canary","org.mozilla.firefox","org.mozilla.firefoxdeveloperedition","com.brave.browser","com.operasoftware.opera","com.microsoft.edgemac","com.microsoft.edgemac.beta","com.vivaldi.vivaldi","com.kagi.kagimacos","app.zen-browser.zen","company.thebrowser.dia","ai.perplexity.comet"]);function xt(t){let[e,i]=(0,y.useState)(),{data:o}=St({execute:e});return(0,a.jsx)(n.ActionPanel.Submenu,{icon:n.Icon.Globe,title:"Open in Other Browser",shortcut:n.Keyboard.Shortcut.Common.Open,onOpen:()=>i(!0),children:o?.map(r=>(0,a.jsx)(n.Action.Open,{icon:{fileIcon:r.path},title:r.name,target:t.url,application:r},r.path))})}function St(t){let e=(0,y.useCallback)(async()=>(await(0,n.getApplications)()).filter(o=>o.bundleId&&yt.has(o.bundleId.toLowerCase())).sort((o,r)=>o.name.localeCompare(r.name)),[]);return(0,I.useCachedPromise)(e,[],{execute:t?.execute})}function At(t){async function e(){let i=`https://www.google.com/search?q=${encodeURIComponent(t.searchText)}`;try{let o=await H(i);o?(await P(o),(0,n.closeMainWindow)()):await(0,n.open)(i,"company.thebrowser.Browser")}catch(o){console.error(o),await(0,n.open)(i,"company.thebrowser.Browser")}}return t.searchText?(0,a.jsx)(n.Action,{icon:n.Icon.MagnifyingGlass,title:"Search with Google",shortcut:{modifiers:["ctrl"],key:"return"},onAction:e}):null}function q(t){let e=t.tabOrUrl;return L(t.tabOrUrl)?e=t.tabOrUrl.url:e=/^https?:\/\//i.test(e)?e:"https://"+e,(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.ActionPanel.Section,{children:[(0,a.jsx)(_t,{tabOrUrl:L(t.tabOrUrl)?t.tabOrUrl:e}),(0,a.jsx)(bt,{url:e})]}),(0,a.jsxs)(n.ActionPanel.Section,{children:[(0,a.jsx)(wt,{url:e}),(0,a.jsx)(ht,{url:e}),(0,a.jsx)(gt,{url:e}),(0,a.jsx)(xt,{url:e}),(0,a.jsx)(At,{searchText:t.searchText})]})]})}function K(t){return(0,a.jsxs)(n.ActionPanel.Section,{children:[(0,a.jsx)(n.Action.CopyToClipboard,{title:"Copy URL",content:t.url,shortcut:n.Keyboard.Shortcut.Common.Copy}),t.title&&(0,a.jsx)(n.Action.CopyToClipboard,{title:"Copy Title",content:t.title,shortcut:n.Keyboard.Shortcut.Common.CopyName}),t.title&&(0,a.jsx)(n.Action.CopyToClipboard,{title:"Copy URL as Markdown",content:`[${t.title}](${t.url})`,shortcut:{modifiers:["cmd","opt","shift"],key:"c"}})]})}var w=require("react/jsx-runtime");function z(t){return(0,w.jsx)(s.List.Item,{icon:(0,G.getFavicon)(t.entry.url,{mask:s.Image.Mask.RoundedRectangle}),title:t.entry.title,subtitle:{value:D(t.entry.url),tooltip:t.entry.url},accessories:[F(t.entry),{tag:t.entry.profileName}],actions:(0,w.jsxs)(s.ActionPanel,{children:[(0,w.jsx)(q,{tabOrUrl:t.entry.url,searchText:t.searchText}),(0,w.jsx)(K,{url:t.entry.url,title:t.entry.title})]})})}var J=require("os"),T=require("fs"),x=require("path"),R=require("@raycast/utils"),E=(0,x.join)((0,J.homedir)(),"Library","Application Support","Arc","User Data"),Q="History",Tt="Preferences";function Y(t){try{let e=(0,x.join)(E,t,Tt);return JSON.parse((0,T.readFileSync)(e,"utf8"))?.profile?.name}catch{return}}var A=[],vt=(0,x.join)(E,"Default",Q);A.push({id:"Default",name:Y("Default"),historyDatabasePath:vt});for(let t=1;t<5;t++){let e=`Profile ${t}`,i=(0,x.join)(E,e,Q);if(!(0,T.existsSync)(i))break;let r=Y(e);r!=="__ARC_SYSTEM_PROFILE"&&A.push({id:e,name:r,historyDatabasePath:i})}function kt(t,e=200){let i=t?t.split(" ").filter(o=>o.length>0).map(o=>`(url LIKE '%${o}%' ESCAPE '\\' OR title LIKE '%${o}%' ESCAPE '\\')`).join(" AND "):void 0;return`
    SELECT id,
          url,
          title,
          datetime(last_visit_time / 1000000 + (strftime('%s', '1601-01-01')), 'unixepoch', 'localtime') AS lastVisitedAt
    FROM urls
    ${i?`WHERE ${i}`:""}
    GROUP BY url
    ORDER BY last_visit_time DESC
    LIMIT ${e};
  `}function j(t,e){let i=t.replace(/\\/g,"\\\\").replace(/'/g,"''").replace(/[%_]/g,"\\$&"),o,r=!1,p=[],c=A.length>1;for(let f of A){let b=(0,R.useSQL)(f.historyDatabasePath,kt(i,e));b.isLoading&&(r=!0),o=b.permissionView;let nt=f.name||f.id,ot=c?nt:void 0,U=b?.data?.map(at=>({...at,profileName:ot}));U&&p.push(...U)}return p.sort((f,b)=>new Date(b.lastVisitedAt).getTime()-new Date(f.lastVisitedAt).getTime()),{data:p,isLoading:r,permissionView:o}}var m=require("@raycast/api"),Z=require("@raycast/utils"),X=require("path"),$=require("semver");var S=require("react/jsx-runtime"),N="0.85.0";function tt(t){let{data:e,isLoading:i}=(0,Z.useCachedPromise)(B);if(i&&!e)return(0,S.jsx)(m.Detail,{isLoading:!0});if(i&&e&&(0,$.lt)(e,N))return(0,S.jsx)(m.Detail,{isLoading:!0});if(!i&&!e)return(0,S.jsx)(m.Detail,{markdown:`## Something went wrong

We are unable to fetch the version of Arc. Please make sure Arc is correctly installed and try again.`});if(!i&&e&&(0,$.lt)(e,N)){let o=(0,X.join)(m.environment.assetsPath,"check-for-updates.png"),r=`## Version conflict

The extension requires Arc v${N}. Please update the app via Arc -> Check for Updates.

![Check for Updates](${o})`;return(0,S.jsx)(m.Detail,{markdown:r})}else return t.children}var d=require("react/jsx-runtime");function Lt(t){let[e,i]=(0,et.useState)(t.fallbackText??""),{data:o,isLoading:r,permissionView:p}=j(e);return p||(0,d.jsxs)(h.List,{searchBarPlaceholder:"Search history",searchText:e,isLoading:r,onSearchTextChange:i,children:[(0,d.jsx)(h.List.EmptyView,{icon:h.Icon.MagnifyingGlass,title:"Nothing found \xAF\\_(\u30C4)_/\xAF"}),(0,d.jsx)(h.List.Section,{title:"History",subtitle:o?`${o.length} ${o.length===1?"entry":"entries"}`:void 0,children:o?.map(c=>(0,d.jsx)(z,{entry:c,searchText:e},c.id))})]})}function it(t){return(0,d.jsx)(tt,{children:(0,d.jsx)(Lt,{...t})})}
