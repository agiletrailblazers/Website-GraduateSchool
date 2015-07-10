![GraduateSchool](https://upload.wikimedia.org/wikipedia/en/2/2d/Graduate_School_USA_Logo.png)
# Website-GraduateSchool
This is the [Express.js](http://expressjs.com/) repository for the GraduateSchool's new website.

## Testing Tools
  1. [Mocha](http://mochajs.org/) (Test Framework) [Wiki](https://github.com/mochajs/mocha/wiki)
  2. [Cucumber.js](https://github.com/cucumber/cucumber-js) (BDD)
  3. [Expect.js](https://github.com/Automattic/expect.js) (Minimalistic BDD assertion toolkit.)
  4. [Chai](http://chaijs.com/)
  To run tests use the command `mocha`.
## API's
  1. [Contentful] (https://github.com/contentful/contentful.js)
  2. Facebook
  3. Twitter

## Installation

### Mac OSX || Linux
  1. Download the latest version of [Node.js](https://nodejs.org/). This will install Node and NPM (Node's Package Manager).
  2. Fork repo to your Github Account
  3. Clone Repo to your machine.
  4. Set your [upstream-url](https://help.github.com/articles/configuring-a-remote-for-a-fork/) to [this](https://github.com/GraduateSchoolUSA/Website-GraduateSchool.git).
  5. Navigate inside repository and run `npm install`.
  6. To start run `$ DEBUG=myapp npm start`

### Windows
  1. Download the latest version of [Node.js](https://nodejs.org/). This will install Node and NPM (Node's Package Manager).
  2. Fork repo to your Github Account
  3. Clone Repo to your machine.
  4. Set your [upstream-url](https://help.github.com/articles/configuring-a-remote-for-a-fork/) to [this](https://github.com/GraduateSchoolUSA/Website-GraduateSchool.git).
  5. Navigate inside repository using Powershell || Command Prompt and run `npm install`.
  6. To start run `> set DEBUG=myapp & npm start` (will run on localhost:3000).

## Adding Packages
  When adding packages please use the `--save` option to add to our list of dependencies in the package.json file. If you add a package please notify the team on SLACK that you have added a package so we can install the dependency on our local machines after pulling from upstream master.

  Example: `npm install [NAME] --save`

## Environment Preferences
IDE: Intellij || Eclipse <br>
[ATOM](https://atom.io/)

## What is Express?
<ol>
  <li>Minimal unopinionated web framework.</li>
  <li>Thin layer over core Node.js http module</li>
  <li>Leverages various middleware packages to provide useful functionality, such as parsing HTTP headers, request parameters and bodies, parsing cookies, automatic response header based on data types.</li>
  <li>MVC-like structure and routing available.</li>
</ol>
