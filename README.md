# dotfiles

Managed with [GNU Stow](https://www.gnu.org/software/stow/).

## Layout

Each top-level directory is a stow *package* whose internal tree mirrors `$HOME`.

```
nvim/      .config/nvim/
alacritty/ .config/alacritty/
karabiner/ .config/karabiner/
raycast/   .config/raycast/
tmux/      .tmux.conf
zsh/       .zshrc
```

## Install on a new machine

```sh
brew install stow git
git clone <repo-url> ~/dotfiles
cd ~/dotfiles
stow -t ~ nvim alacritty karabiner tmux zsh raycast
```

If stow refuses because a target already exists, back it up and re-run:

```sh
mv ~/.zshrc ~/.zshrc.bak
stow -t ~ zsh
```

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
