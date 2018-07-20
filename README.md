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
run test
```

The above code will attempt to run `npm run test`, `gulp test`, `make test`, `./run.sh test`.

### Roadmap:
- [x] Run tasks from `package.json`
- [ ] Run tasks from `gulpfile.js`
- [ ] Run tasks from `makefile`
- [ ] Run tasks from shell scripts exposing functions
- [ ] Generate templates for the above if they don't exist
- [ ] Detect and prompt for installation if a tool is missing
- [ ] Install local Gulp if missing
