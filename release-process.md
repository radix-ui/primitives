# Release process

## Overview

While our release schedule is flexible, our general approach is to release several improvements at the same time rather than to publish small updates frequently and in isolation.

While the versioning and publishing of our primitives is mostly automated via scripts, updates to our [documentation website](https://radix-ui.com/primitives/docs/overview/introduction) is currently a manual process. We are working to improve this but for now this outline should help contributors with the process.

## Release strategy

We track versions during the pull request process. As features are added, modified or improved it's important to keep track of these via versioning.

### Tracking version changes

The easiest way to track changes before raising your PR is to run `yarn version check --interactive`, this will prompt you to update the semver based on files that have been modified and will store an update file in `.yarn/versions/`, this is later consumed when publishing new versions. Be sure to check-in these files along with your code changes.

### Publishing releases

1. Ensure you have latest `main`
2. Run `yarn publish`
3. Commit the resulting changes directly to `main` (you'll need to temporarily disable branch protection)

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
