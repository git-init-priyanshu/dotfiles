#!/usr/bin/env bash
# Flat fzf list of Claude Code and Codex panes across all tmux sessions
# @agent_state is set per pane by Claude Code / Codex hooks: running, waiting, done

pane=$(
  tmux list-panes -a -F '#{pane_id}	#{@agent_state}	#{session_name}:#{window_index}.#{pane_index}	#{pane_current_command}	#{pane_title}' |
    awk -F'\t' -v OFS='\t' '
      $4 != "claude" && $4 != "codex" { next }
      $2 == "running" { $2 = "\033[33m● running\033[0m" }
      $2 == "waiting" { $2 = "\033[31m◆ waiting\033[0m" }
      $2 == "done"    { $2 = "\033[32m✔ done   \033[0m" }
      $2 == ""        { $2 = "\033[90m○ idle   \033[0m" }
      { print }
    ' |
    fzf --ansi --cycle --delimiter='\t' --with-nth=2.. --reverse \
      --preview 'tmux capture-pane -ep -t {1}' --preview-window=right:60% |
    cut -f1
)

[ -n "$pane" ] && tmux switch-client -t "$pane"
