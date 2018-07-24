.DEFAULT_GOAL := info
.PHONY: info build

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

###############################################################################
## INFO
###############################################################################

info:
	@echo "Available actions:"
	@echo
	@echo "  $$ run         Runs 'run info' by default"
	@echo "  $$ run info    Shows this text"
	@echo
	@echo "  $$ run styles  Compile the styles"
	@echo "  $$ run media   Arrange images and fonts"
	@echo "  $$ run build   Build your project"
	@echo

###############################################################################
## RECIPES
###############################################################################

styles:
	@echo "This is the 'styles' target"

media:
	@echo "This is the 'media' target"

build: styles media
	@echo "This is the 'build' (main) target"
