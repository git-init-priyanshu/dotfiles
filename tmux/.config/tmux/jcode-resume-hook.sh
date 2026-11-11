#!/usr/bin/env bash
# tmux-resurrect post-save-layout hook: $1 is the snapshot being written.
# Rewrites bare "jcode" panes to "jcode --resume <session id>" so a restore reopens the same session.

snapshot="$1"
sessions_dir="$HOME/.jcode/client_sessions"
processes=$(ps -axo pid=,ppid=,command=)
pane_sessions=$(mktemp)

tmux list-panes -a -F "#{session_name}	#{window_index}	#{pane_index}	#{pane_pid}" |
  while IFS=$'\t' read -r session window pane pane_pid; do
    jcode_pid=$(awk -v ppid="$pane_pid" '$2 == ppid && $3 == "jcode" { print $1; exit }' <<<"$processes")
    [ -n "$jcode_pid" ] && [ -f "$sessions_dir/$jcode_pid" ] || continue
    printf '%s\t%s\t%s\t%s\n' "$session" "$window" "$pane" "$(cat "$sessions_dir/$jcode_pid")"
  done >"$pane_sessions"

awk -F'\t' -v OFS='\t' '
  NR == FNR { resume[$1 FS $2 FS $3] = $4; next }
  $1 == "pane" && $11 == ":jcode" && ($2 FS $3 FS $6) in resume { $11 = ":jcode --resume " resume[$2 FS $3 FS $6] }
  { print }
' "$pane_sessions" "$snapshot" >"$snapshot.tmp" && mv "$snapshot.tmp" "$snapshot"

rm -f "$pane_sessions"
