![GraduateSchool](https://upload.wikimedia.org/wikipedia/en/2/2d/Graduate_School_USA_Logo.png)
![[Build Status](http://ec2-54-165-8-77.compute-1.amazonaws.com/job/Dev-Env-Website-Graduate-School/badge/icon)](http://ec2-54-165-8-77.compute-1.amazonaws.com/job/Dev-Env-Website-Graduate-School/)
# Website-GraduateSchool
This is the [Express.js](http://expressjs.com/) repository for the GraduateSchool's new website.<br>
[Google Analytics Sharepoint Page](https://agiletrailblazers.sharepoint.com/_layouts/15/WopiFrame.aspx?sourcedoc={28056b3d-a969-4c41-96d0-53760c3f97a4}&action=edit&wd=target%28%2F%2FGS%20General%20Info.one%7C8951f769-4734-400b-9fc4-1b1f404b0a03%2FGoogle%20Analytics%7C8ebbfb76-7ad9-4523-8682-c6d1f9a8da82%2F%29)

## Tools & Technologies
  1. [Mocha](http://mochajs.org/) (Test Framework) [Wiki](https://github.com/mochajs/mocha/wiki)
  2. [Cucumber.js](https://github.com/cucumber/cucumber-js) (BDD)
  3. [Expect.js](https://github.com/Automattic/expect.js) (Minimalistic BDD assertion toolkit.)
  4. [Chai](http://chaijs.com/).To run tests use the command `mocha` :: Chai is an assertion library.
  5. [Contentful](https://github.com/contentful/contentful.js)
  6. Facebook
  7. Twitter
  8. [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver)
  9. [nock](https://github.com/pgte/nock)

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

#### Running in Different Environments
By defauly "npm start" will run the "dev" environment.
To run as a different environment use: `$ NODE_ENV={env} npm start`
Options for {env} are: NONE, dev, test, prod

Example for running LOCAL: `NODE_ENV= node ./bin/www`

## Adding Packages
  When adding packages please use the `--save` option to add to our list of dependencies in the package.json file. If you add a package please notify the team on SLACK that you have added a package so we can install the dependency on our local machines after pulling from upstream master.

  Example: `npm install [NAME] --save`

## Environment Preferences
IDE: Intellij || Eclipse <br>
[ATOM](https://atom.io/)

## Tutorials and help <br>
### Testing
  1. [How to build and test apps using Mocha](https://thewayofcode.wordpress.com/tag/route-unit-test/)
  2. [How to unit test routes w/ Express](http://stackoverflow.com/questions/9517880/how-does-one-unit-test-routes-with-express)
  3. [Testing Express Routes](http://javascriptplayground.com/blog/2014/07/testing-express-routes/)
  4. [Unit Testing Controllers in Express](http://www.designsuperbuild.com/blog/unit_testing_controllers_in_express/)
  5. [Unit Testing Express.js Routes](http://winder.ws/2014/01/20/unit-testing-express-dot-js-routes.html)

## What is Express?
<ol>
  <li>Minimal unopinionated web framework.</li>
  <li>Thin layer over core Node.js http module</li>
  <li>Leverages various middleware packages to provide useful functionality, such as parsing HTTP headers, request parameters and bodies, parsing cookies, automatic response header based on data types.</li>
  <li>MVC-like structure and routing available.</li>
</ol>
