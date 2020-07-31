YARN := yarn --silent
NODE := $(YARN) node
TS_NODE := $(YARN) ts-node

bootstrap: clean-all
	$(YARN) --ignore-engines
	$(YARN) lerna bootstrap --ignore-engines

clean:
	rm -rf packages/*/*/dist
	rm -rf packages/*/*/npm-debug*

clean-all:
	rm -rf node_modules
	rm -rf yarn.lock
	rm -rf .cache
	$(MAKE) clean
