[![Dependencies Status](https://david-dm.org/logerfo/triage-action/dev-status.svg)](https://david-dm.org/logerfo/triage-action?type=dev)

# Triage Action
This action will manage triage state in issues.

## Setting up
Create a file named `.github/workflows/triage.yml`.

### Minimal Configuration
```yml
name: Triage
on: 
  issues:
    types: [opened, closed, milestoned, demilestoned]
  project_card:
    types: [created, deleted]
    
jobs:
  build:
    name: Triage
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/triage-action@0.0.2
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Complete configuration
All values are default.
```yml
name: Triage
on: 
  issues: 
    types: [opened, closed, milestoned, demilestoned] # The last two are not needed if milestone is set to false
  project_card: # Not needed if project is set to false
    types: [created, deleted]
    
jobs:
  build:
    name: Triage
    runs-on: ubuntu-16.04
    steps:
    - uses: Logerfo/triage-action@0.0.2
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }} # The `GITHUB_TOKEN` secret.
        label: triage # The triage label of your repository.
        project: true # Enable or disable the idea that adding an issue to a project drops its triage state.
        milestone: true # Enable or disable the idea that setting a milestone to an issue drops its triage state.
```

### Auto update
You can use (at your own risk) the `release` branch instead of the specific version tag.  
Never user `master`, since the distribution file does not exist in this branch and the action will always fail.

## Disclaimer
The GitHub Projects API is currently in beta. This means that it can have a breaking change anytime, which may break this action and it might not be fixed.

## Changelog
Click [here](CHANGELOG.md).

## Contributing
If you have suggestions for how close-label could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Donate

<img src="https://i.imgur.com/ndlBtuX.png" width="200">

BTC: 1LoGErFoNzE1gCA5fzk6A82nV6iJdKssSZ
