# Library of Twee Stories

in theory these are twee/twine stories that I'm working on.

## How to use

since i use too much javascript, this uses [extwee](https://github.com/videlais/extwee). `yarn install` at the top level to get that.

i've noticed on wsl, i've had to change the line endings to `LF` to get the extwee script to work. i did that in VS Code (`Ctrl-Shift-P > Change End of Line Sequence > LF`) on `node_modules/extwee/bin/extwee.js`. [This site](https://fedingo.com/how-to-convert-crlf-to-lf-in-linux/) has other command-line options (copied them below, in case you don't have internet or something when trying this).

this also means i have to do `yarn extwee <rest of the command>` instead of `npx extwee` like in its readme, to ensure i'm using the correct line endings in the local version.

once i figure out yarn workspaces, each story will be its own workspace so i can do things like use typescript and whatnot. that could also be top level.

## Stories

### ANOMALY DETECTED

you wake up in a desolate city. you're also a robot of some sort. what happens next? TBD

**format:** Sugarcube

## Appendix

### Converting CRLF to LF

Based on [this article](https://fedingo.com/how-to-convert-crlf-to-lf-in-linux/).

```sh
tr -d '\015' data.txt > data1.txt

# OR sed

sed 's/^M$//' data.txt     # DOS to Unix

# OR vim (i think this is what i did in termux that one time)

vim data.txt -c "set ff=unix" -c ":wq" # dos to unix
```

there are also ways to do this in [git](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings) which involve setting a config:

```sh
git config --global core.autocrlf true
```
