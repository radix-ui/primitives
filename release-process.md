# Release process

## Overview

While our release schedule is flexible, our general strategy is to release several larger improvements inside each stable release. In order to provide faster access to fixes and enhancements between main releases we provide release candidates which are published on every merge into `main`.

While the versioning and publishing of our primitives is mostly automated via scripts, updates to our [documentation website](https://radix-ui.com/primitives/docs/overview/introduction) is currently a manual process. We are working to improve this but for now this outline should help contributors with the process.

## Release strategy

We track versions during the pull request process. As features are added, modified or improved it's important to keep track of these via versioning.

### Tracking version changes

The easiest way to track changes before raising a PR is to run `yarn version check --interactive`, this will prompt you to update the semver based on files that have been modified and will store an update file in `.yarn/versions/`, this is later consumed when publishing new versions. Be sure to check-in these files along with your code changes.

### Publishing a stable release

1. Checkout latest `main`
2. Run `yarn npm login` and supply your credentials (ensure you have access to the org scope for publishing)
3. Run `yarn publish:stable`
4. Commit the resulting changes directly to `main` (you'll need to temporarily disable branch protection)

### Release candidates

Release candidates are automatically published when new changes are merged into `main`. If you want to publish a candidate manually you can do so by following the stable release process but substituting `yarn publish:stable` for `yarn publish:next`.

## Updating documentation

Our documentation is in a [separate repository](https://github.com/radix-ui/website) and updating it is a three step process:

1. Write and update the [change log](https://github.com/radix-ui/website/blob/main/data/primitives/overview/releases.mdx)
2. Bump package version/s and create / update the pages for each version change
3. Perform documentation updates

Steps 2 and 3 are typically raised as separate pull requests to make changes easier to review.

### Creating new version pages

This is as simple as duplicating the latest page and updating the version number to match the release. Some things to keep in mind:

- We only provide live demos for the latest version of a package so you must remember to disable/remove the previous live demo (this avoids breaking changes affecting old versions in our docs)
- If the incoming version is a patch which doesn't require a docs update then you can simply change the page name to match the new version rather than duplicating the same content
