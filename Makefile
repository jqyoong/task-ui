NAME=task-ui
BREWS=postgres
APPNAME := task-ui

rm-eslintcache:
	if [ -a .eslintcache ]; then rm .eslintcache; fi

rm-node-modules:
	if [ -a node_modules ]; then rm -rf node_modules; fi

i:
	npm i

start:
	npm start

init:
	asdf install
	make i

npm-clean-install: rm-eslintcache rm-node-modules i


.PHONY: init i
.SILENT: init i
