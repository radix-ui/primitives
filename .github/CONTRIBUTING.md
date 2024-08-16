# Contributing to Radix Primitives

## Code of Conduct

Radix has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct, and we expect project participants to adhere to it.

Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Heuristics

[heuristic](<https://en.wikipedia.org/wiki/Heuristic_(computer_science)>)
/ˌhjʊ(ə)ˈrɪstɪk/

> A technique designed for solving a problem more quickly when classic methods are too slow, or for finding an approximate solution when classic methods fail to find any exact solution

- Priority is the best User Experience
- Complexity should be introduced when it’s inevitable
- Code should be easy to reason about
- Code should be easy to delete
- Avoid abstracting too early
- Avoid thinking too far in the future

## Questions

If you have questions about Radix Primitives, be sure to check out the docs where we have several examples and detailed API references that may help you solve your problem. You can also share your questions on [GitHub Discussions](https://github.com/radix-ui/primitives/discussions).

## How to contribute

There are many ways to contribute to the project. Code is just one possible means of contribution.

- **Feedback.** Tell us what we're doing well or where we can improve.
- **Support.** You can answer questions on StackOverflow or [GitHub Discussions](https://github.com/radix-ui/primitives/discussions), or provide solutions for others in [open issues](https://github.com/radix-ui/primitives/issues).
- **Write.** If you come up with an interesting example, write about it. Post it to your blog and share it with us. We'd love to see what folks in the community build with Primitives!
- **Report.** Create issues with bug reports so we can make Primitives even better.

## Working on your first Pull Request?

There are a lot of great resources on creating a good pull request. We've included a few below, but don't be shy—we appreciate all contriibutions and are happy to help those who are willing to help us!

- [How to Contribute to a Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Preparing a Pull Request

[Pull Requests](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) are always welcome, but before working on a large change, it is best to open an issue first to discuss it with maintainers.

A good PR is small, focuses on a single feature or improvement, and clearly communicates the problem it solves. Try not to include more than one issue in a single PR. It's much easier for us to review multiple small pull requests than one that is large and unwieldy.

1. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/primitives.git
cd primitives
git remote add upstream https://github.com/radix-ui/primitives.git
```

1. Synchronize your local `main` branch with the upstream remote:

```sh
git checkout main
git pull upstream main
```

1. Make sure your Node version matches the [.nvmrc](../.nvmrc).

```
node -v
```

1. Install dependencies with [yarn](https://yarnpkg.com):

```sh
yarn install
```

1. Create a new branch related to your PR:

```sh
git checkout -b my-bug-fix
```

6. Make changes, then commit and push to your forked repository:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/radix-ui/primitives) and [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

8. We will review your Pull Request and either merge it, request changes to it, or close it with an explanation.

## Working locally

The repo is managed with Yarn Workspaces.

### Development

```bash
# install dependencies
yarn install

# start Storybook and see examples in the browser
yarn dev
```

Make your changes and check that they resolve the problem with an example in Storybook. We also suggest adding tests to support your change, and then run `yarn test` to make sure nothing is broken.

You also need to inform Yarn workspaces that a particular package has changed for proper versioning. Run `yarn version check -i` to mark the appropriate type of change for those packages.

Lastly, run `yarn build` to ensure that the build runs successfully before submitting the pull request.
