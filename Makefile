YARN := yarn --silent
NODE := $(YARN) node

build:
	$(YARN) lerna run build --stream --ignore @interop-ui/docs

clean:
	rm -rf packages/*/*/dist
	rm -rf packages/*/*/npm-debug*

clean-all:
	rm -rf node_modules
	rm -rf yarn.lock
	rm -rf .cache
	$(MAKE) clean

lerna-bootstrap: clean-all
	$(YARN) --ignore-engines

lerna-bootstrap: clean-all
	$(YARN) --ignore-engines
	$(YARN) lerna bootstrap -- -- --ignore-engines

bootstrap: lerna-bootstrap
	$(MAKE) build
