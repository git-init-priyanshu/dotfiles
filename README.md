# dotfiles

Managed with [GNU Stow](https://www.gnu.org/software/stow/).

## Layout

Each top-level directory is a stow *package* whose internal tree mirrors `$HOME`.

```
nvim/      .config/nvim/
alacritty/ .config/alacritty/
karabiner/ .config/karabiner/
tmux/      .tmux.conf
zsh/       .zshrc
```

## Install on a new machine

```sh
brew install stow git
git clone <repo-url> ~/dotfiles
cd ~/dotfiles
stow -t ~ nvim alacritty karabiner tmux zsh
```

If stow refuses because a target already exists, back it up and re-run:

```sh
mv ~/.zshrc ~/.zshrc.bak
stow -t ~ zsh
```

## New Mac checklist

Things the dotfiles cannot restore. Do them after `stow`.

### System settings

- **Function keys:** System Settings > Keyboard > Keyboard Shortcuts > Function Keys > turn on "Use F1, F2, etc. keys as standard function keys". Without it, Cmd+H/L (mapped to F11/F12 for tmux windows and nvim buffers) change the volume and never reach the terminal. CLI: `defaults write -g com.apple.keyboard.fnState -bool true`, then toggle the setting once or log out.
- **Default browser:** set it in System Settings > Desktop & Dock (Dia).

### Karabiner-Elements

- Install the app (`brew install --cask karabiner-elements` needs sudo), then stow the `karabiner` package.
- Approve the driver extension in System Settings > General > Login Items & Extensions, and grant Input Monitoring. Until then it shows "not configured".
- The config is a symlink and Karabiner does not reload it on its own. After changing it, `touch` the file and run `pkill -f Karabiner-Console-User-Server`.

### Terminal

- Alacritty: Homebrew disabled the cask over Gatekeeper, so download it from the project release page.
- Font: `brew install --cask font-jetbrains-mono-nerd-font`.
- If stow aborts on an existing `~/.config/alacritty/alacritty.toml`, move that stub aside and stow again.

### Shell and tooling

- `brew install python@3.14`. The zsh package puts it first on `PATH`; non-interactive shells still see the system Python.
- Node: keep `ignore-scripts=true` in `~/.npmrc` before installing any package. It is not tracked here.
- `code-review-graph` needs Python 3.13 (its `watchdog` dependency has no 3.14 wheel): `uv tool install --python 3.13 code-review-graph`.
- Agent skills and instructions live in the private `agent-setup` repo.

### Not restorable

- Raycast hotkey, settings and extensions (the config is no longer kept here).

## Add a new package

```sh
mkdir -p ~/dotfiles/foo/.config/foo
mv ~/.config/foo/* ~/dotfiles/foo/.config/foo/
rmdir ~/.config/foo
cd ~/dotfiles && stow -t ~ foo
```

## Unstow (remove symlinks)

```sh
cd ~/dotfiles && stow -t ~ -D <package>
```
