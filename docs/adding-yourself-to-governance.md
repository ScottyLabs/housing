# Adding Yourself to Governance

1. Make sure you've correctly setup your [git.cmu.dev](https://git.cmu.dev/) account (this should be the same email you'd use for GitHub). Don't have an account? Just click "register" in the top right and follow those instructions to make an account.

1. Make sure you [link all available accounts](https://idp.scottylabs.org/realms/scottylabs/account/account-security/linked-accounts) in Keycloak. You'll want to link at least CMU SAML, Discord, GitHub, and Slack.

1. Open [governance](https://git.cmu.dev/ScottyLabs/governance).

1. Fork the repository. Press the fork button in the top right. Then you'll be prompted with details of the fork. You'll want to just keep all as given and press the "Fork repository" button. ![fork-button](images/fork_button.png)

1. Take a look at the file system below. This is all of governances file as displayed on a web view. Follow this file path on git.cmu.dev: data -> teams -> cmu-housing.toml

1. This is our team's file and once your name is added to the list of members governance will give you access to the housing repository! So you'll want to press the edit/pencil icon on the top right of the code block which will let you make edits to the file.

1. Don't edit any other line than to add your name to the list. Go to the last name select the end of the line and add a line with your git.cmu.dev's username (case-sensitive) in quotations then a comma.

1. After that scroll down to where it says commit signed changes. There is two text box inputs. The first is the commit name and the second is the commit description. Add to the commit name "feat: add YOUR-GIT.CMU.DEV-USERNAME to housing". If you're curious why it is like that take a look at [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

1. Now go back to the root of the forked repository. You can do this by clicking it says "your-user/Governance". Then go to Pull Requests and open a new Pull Request.

1. Change the destination (left address) to `Scottylabs:main` then press New Pull Request.
