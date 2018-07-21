.DEFAULT_GOAL := info
.PHONY: info

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

###############################################################################
## INFO
###############################################################################

info:
	@echo "Available actions:"
	@echo
	@echo "  $$ make         Runs 'make info' by default"
	@echo "  $$ make info    Shows this text"
	@echo
	@echo "  $$ make one     Action one"
	@echo "  $$ make two     Action two"
	@echo "  $$ make main    The main action"
	@echo

###############################################################################
## RECIPES
###############################################################################

one:
	@echo "This is action one"

two:
	@echo "This is action two"

main: one two
	@echo "This is the main action"
