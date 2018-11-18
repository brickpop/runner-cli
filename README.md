# runner-cli
A universal task runner, with support for NPM scripts, Gulp, Makefiles and shell scripts

The tool is currently a work in progress.

## Usage

Install it on your system:

```
npm i -g runner-cli
```

To display the available actions:

```
run
```

The command above will attempt to locate `package.json`, `gulpfile.js`, `makefile` and `taskfile` and display the available commands.

To run a task:

```
run action
```

The command above will attempt to run `npm run action`, `gulp action`, `make action` and `bash taskfile action`.

### Invocation examples

Let's assume that we have a `main` action that depends on actions `one` and `two` (check the examples folder).

If the project has a `gulpfile.js`:

```
$ run main
gulp main

[18:13:23] Using gulpfile ~/git/runner-cli/example/gulpjs/gulpfile.js
[18:13:23] Starting 'one'...
This is task 1
[18:13:23] Finished 'one' after 152 μs
[18:13:23] Starting 'two'...
This is task 2
[18:13:23] Finished 'two' after 90 μs
[18:13:23] Starting 'main'...
This is the main task
[18:13:23] Finished 'main' after 67 μs
```

If the project has a `package.json`:

```
$ run main
npm run main


> runner-cli-npm-example@1.0.0 main /Users/jordi/git/runner-cli/example/npm
> run one && run two

npm run one


> runner-cli-npm-example@1.0.0 one /Users/jordi/git/runner-cli/example/npm
> echo 'This is action 1'

This is action 1
npm run two


> runner-cli-npm-example@1.0.0 two /Users/jordi/git/runner-cli/example/npm
> echo 'This is action 2'

This is action 2
```

If the project has a `makefile`:

```
$ run main
make main

This is action one
This is action two
This is the main action
```

If the project has a `taskfile`:

```
$ run main
bash taskfile main

This is the main action

Sequential actions:
> This is action one
> This is action two (parameter $1 = testing)
Actions one and two completed

Concurrent actions:
> This is action two (no parameter)
> This is action one
Actions one and two completed concurrently

Task completed in 0m0.002s
```

### Display available commands

In the same scenario as before, we just execute `run`:

If the project has a `gulpfile.js`:
```
$ run
gulp --tasks

[18:01:14] Using gulpfile ~/git/runner-cli/example/gulpjs/gulpfile.js
[18:01:14] Tasks for ~/git/runner-cli/example/gulpjs/gulpfile.js
[18:01:14] ├── one
[18:01:14] ├── two
[18:01:14] └─┬ main
[18:01:14]   ├── one
[18:01:14]   └── two
```

If the project has a `package.json`:
```
$ run
npm run

Scripts available in runner-cli-npm-example via `npm run-script`:
  one
    echo 'This is action 1'
  two
    echo 'This is action 2'
  main
    run one && run two
```

If the project has a `makefile`:
```
$ run
make

Available actions:

  $ make         Runs 'make info' by default
  $ make info    Shows this text

  $ make one     Action one
  $ make two     Action two
  $ make main    The main action
```

If the project has a `taskfile`:
```
$ run
bash taskfile

taskfile <task> <args>

Available tasks:
     1	default
     2	main
     3	one
     4	two
Task completed in 0m0.004s
```

### Why a meta task runner
Read the [motivational article on Medium.com](https://medium.com/jordi-moraleda/a-universal-task-runner-to-run-them-all-d93f1a1bf8b1)

### Roadmap:
- [x] Run tasks from `package.json`
- [x] Run tasks from `gulpfile.js`
- [x] Run tasks from `makefile`
- [x] Run tasks from [taskfile's](https://hackernoon.com/introducing-the-taskfile-5ddfe7ed83bd) (shell scripts exposing functions)
- [x] Display the available tasks
- [x] Detect and prompt for installation if a tool is missing
- [x] Install local Gulp if missing
- [x] Generate templates for the supported formats
