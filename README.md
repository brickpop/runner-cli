# runner-cli
A universal task runner, with support for NPM scripts, Gulp, Makefiles and shell scripts

The tool is currently a work in progress.

### Usage

Install it on your system:

```
npm i -g runner-cli
```

Run a task:

```
run build
```

The above code will attempt to run `npm run build`, `gulp build`, `make build`, `./run.sh build`.

### Roadmap:
- [x] Run tasks from `package.json`
- [x] Run tasks from `gulpfile.js`
- [ ] Run tasks from `makefile`
- [ ] Run tasks from [Taskfiles](https://hackernoon.com/introducing-the-taskfile-5ddfe7ed83bd) (shell scripts exposing functions)
- [~] Display the available tasks
- [ ] Generate templates for the supported formats
- [~] Detect and prompt for installation if a tool is missing
- [x] Install local Gulp if missing
