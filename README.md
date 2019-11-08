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
    types: [created, milestoned, demilestoned]
  project_card:
    types: [created, deleted]
    
jobs:
  build:
    name: Triage
    runs-on: ubuntu-16.04
    steps:
    - uses: actions/checkout@master
    - uses: Logerfo/triage-action@0.0.1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Complete configuration
All values are default.
```yml
name: Triage
on: 
  issues: 
    types: [created, milestoned, demilestoned] # The last two are not needed if milestone is set to false
  project_card: # Not needed if project is set to false
    types: [created, deleted]
    
jobs:
  build:
    name: Triage
    runs-on: ubuntu-16.04
    steps:
    - uses: actions/checkout@master # Not needed if project is set to false
    - uses: Logerfo/triage-action@0.0.1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }} # The `GITHUB_TOKEN` secret.
        label: triage # The triage label of your repository.
        project: true # Enable or disable the idea that adding an issue to a project drops its triage state.
        milestone: true # Enable or disable the idea that setting a milestone to an issue drops its triage state.
        config-path: .github/triage.yml # The path of the addtional configurations file. Only useful if project is set to true.
```

### Additional configurations file
If `project: true`, you may need create a additional configuration file. The default path is `.github/triage.yml`, but you can change it in the action configuration file, as shown above.  
This file allows you to set extra project sources (users and organizations) to look for the issue being analyzed by the action. The host repository will always be looked by default.  
The file must follow the following structure:
```yml
owner:
  token: <token>
  type: <user|organization>

  include: [1, 2]
  # or
  exclude: [3, 4]
```
For example:
```yml
dotnet:
  token: ${{ secrets.DOTNET_TOKEN }}
  type: organization
  include: [1]
```
You cannot apply both the `include` and the `exclude` attributes at the same time. If you apply the `include` attribute, only the listed projects ids will be looked. If you apply the `exclude` attributes, every project will be looked, except for the listed ones. If you apply none of them, every project will be looked, no exceptions. If you apply both of them, the action will fail.  
The token is mandatory, even for public projects. For security reasons, it's recommended that you add the tokens as secrets in your host repository.  
Click [here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) to known how to create an access token.  
Click [here](https://help.github.com/en/github/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) to known how to create a secret.

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
