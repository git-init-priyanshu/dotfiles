if [[ -f "/opt/homebrew/bin/brew" ]] then
  # If you're using macOS, you'll want this enabled
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
source $ZSH/oh-my-zsh.sh
ZDOTDIR="$HOME/.config/oh-my-zsh"

# Set the directory we want to store zinit and plugins
ZINIT_HOME="${XDG_DATA_HOME:-${HOME}/.local/share}/zinit/zinit.git"

# Download Zinit, if it's not there yet
if [ ! -d "$ZINIT_HOME" ]; then
   mkdir -p "$(dirname $ZINIT_HOME)"
   git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
fi

# Source/Load zinit
source "${ZINIT_HOME}/zinit.zsh"

# Add in Powerlevel10k
# zinit ice depth=1; zinit light romkatv/powerlevel10k

plugins=(git nvm vi-mode)

# Zinit plugins
zinit light zsh-users/zsh-syntax-highlighting
export NVM_LAZY_LOAD=false
zinit light lukechilds/zsh-nvm
zinit light zsh-users/zsh-completions
zinit light zsh-users/zsh-autosuggestions

# fzf-tab needs the fzf binary; auto-install it via Homebrew if missing
if ! command -v fzf >/dev/null 2>&1; then
   if command -v brew >/dev/null 2>&1; then
      echo "fzf not found, installing via Homebrew..."
      brew install fzf
   else
      echo "fzf not found and Homebrew is unavailable; fzf-tab will not work."
   fi
fi
zinit light Aloxaf/fzf-tab

# Snippets
zinit snippet OMZL::git.zsh
zinit snippet OMZP::git
zinit snippet OMZP::sudo
zinit snippet OMZP::archlinux
zinit snippet OMZP::aws
zinit snippet OMZP::kubectl
zinit snippet OMZP::kubectx
zinit snippet OMZP::command-not-found

# Load completions
autoload -Uz compinit && compinit

zinit cdreplay -q

# vim mode
bindkey -v
bindkey -M viins 'kj' vi-cmd-mode
INSERT_MODE_INDICATOR="%F{yellow}+%f"
export KEYTIMEOUT=5
# Change cursor shape for different vi modes.
function zle-keymap-select {
  if [[ ${KEYMAP} == vicmd ]] ||
     [[ $1 = 'block' ]]; then
    echo -ne '\e[1 q'
  elif [[ ${KEYMAP} == main ]] ||
       [[ ${KEYMAP} == viins ]] ||
       [[ ${KEYMAP} = '' ]] ||
       [[ $1 = 'beam' ]]; then
    echo -ne '\e[5 q'
  fi
}
zle -N zle-keymap-select
zle-line-init() {
    zle -K viins # initiate `vi insert` as keymap (can be removed if `bindkey -V` has been set elsewhere)
    echo -ne "\e[5 q"
}
zle -N zle-line-init
echo -ne '\e[5 q' # Use beam shape cursor on startup.
preexec() { echo -ne '\e[5 q' ;} # Use beam shape cursor for each new prompt.

#Keybindings
bindkey '^p' history-search-backward
bindkey '^n' history-search-forward
bindkey '^[w' kill-region

# History
HISTSIZE=5000
HISTFILE=~/.zsh_history
SAVEHIST=$HISTSIZE
HISTDUP=erase
setopt appendhistory
setopt sharehistory
setopt hist_ignore_space
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups

# Completion styling
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu no
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'ls --color $realpath'
zstyle ':fzf-tab:complete:__zoxide_z:*' fzf-preview 'ls --color $realpath'

# Aliases
alias ls='ls --color'

# Custom alias source
alias source-zsh='source ~/.zshrc'
alias source-tmux='tmux source ~/.tmux.conf'

# Custom alias tmux
alias tmux='tmux -u'
alias tmux-a='tmux -u a -t'
alias tmux-new-session='tmux -u new-session -s'

# Cutom aliases git
alias gs="git status"
alias ga="git add"
alias gc="git commit -m"
alias greset="git reset --soft HEAD^"
alias glsb="git branch"
alias gcb="git checkout"
alias gnewb="git checkout -b"

# Cutom aliases docker
alias dps="docker ps"
alias dcompose="docker compose up -d"
alias dexec='docker exec -it'

# Keymap to delete a word
bindkey "^[^?" backward-kill-word



###-begin-npm-completion-###
#
# npm command completion script
#
# Installation: npm completion >> ~/.bashrc  (or ~/.zshrc)
# Or, maybe: npm completion > /usr/local/etc/bash_completion.d/npm
#

if type complete &>/dev/null; then
  _npm_completion () {
    local words cword
    if type _get_comp_words_by_ref &>/dev/null; then
      _get_comp_words_by_ref -n = -n @ -n : -w words -i cword
    else
      cword="$COMP_CWORD"
      words=("${COMP_WORDS[@]}")
    fi

    local si="$IFS"
    if ! IFS=$'\n' COMPREPLY=($(COMP_CWORD="$cword" \
                           COMP_LINE="$COMP_LINE" \
                           COMP_POINT="$COMP_POINT" \
                           npm completion -- "${words[@]}" \
                           2>/dev/null)); then
      local ret=$?
      IFS="$si"
      return $ret
    fi
    IFS="$si"
    if type __ltrim_colon_completions &>/dev/null; then
      __ltrim_colon_completions "${words[cword]}"
    fi
  }
  complete -o default -F _npm_completion npm
elif type compdef &>/dev/null; then
  _npm_completion() {
    local si=$IFS
    compadd -- $(COMP_CWORD=$((CURRENT-1)) \
                 COMP_LINE=$BUFFER \
                 COMP_POINT=0 \
                 npm completion -- "${words[@]}" \
                 2>/dev/null)
    IFS=$si
  }
  compdef _npm_completion npm
elif type compctl &>/dev/null; then
  _npm_completion () {
    local cword line point words si
    read -Ac words
    read -cn cword
    let cword-=1
    read -l line
    read -ln point
    si="$IFS"
    if ! IFS=$'\n' reply=($(COMP_CWORD="$cword" \
                       COMP_LINE="$line" \
                       COMP_POINT="$point" \
                       npm completion -- "${words[@]}" \
                       2>/dev/null)); then

      local ret=$?
      IFS="$si"
      return $ret
    fi
    IFS="$si"
  }
  compctl -K _npm_completion npm
fi
##-end-npm-completion-###

# --- Command execution time in seconds (right prompt) ---
# Store start time
preexec() {
  CMD_START_TIME=$EPOCHREALTIME
}

# Show elapsed time
precmd() {
  if [[ -n "$CMD_START_TIME" ]]; then
    local elapsed
    elapsed=$(printf "%.2f" "$(echo "$EPOCHREALTIME - $CMD_START_TIME" | bc)")
    RPROMPT="%F{yellow}${elapsed}s%f"
    unset CMD_START_TIME
  else
    RPROMPT=""
  fi
}

. "$HOME/.local/bin/env"

# Added by Antigravity
export PATH="/Users/priyanshubartwal/.antigravity/antigravity/bin:$PATH"

# bun completions
[ -s "/Users/priyanshubartwal/.bun/_bun" ] && source "/Users/priyanshubartwal/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# opencode
export PATH=/Users/priyanshubartwal/.opencode/bin:$PATH
alias oc=opencode

# Added by Antigravity
export PATH="/Users/priyanshubartwal/.antigravity/antigravity/bin:$PATH"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
