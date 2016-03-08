![GraduateSchool](https://upload.wikimedia.org/wikipedia/en/2/2d/Graduate_School_USA_Logo.png)
[![Build Status](http://ec2-54-165-8-77.compute-1.amazonaws.com/buildStatus/icon?job=Dev-Env-Website-Graduate-School)](http://ec2-54-165-8-77.compute-1.amazonaws.com/job/Dev-Env-Website-Graduate-School)
# Website-GraduateSchool
This is the source repository for the GraduateSchool's new website.

## Core Application Technologies
* [Node.js](https://nodejs.org/en/) (Javascript Framework)
* [Express.js](http://expressjs.com/) (Web Framework for Node.js)
* [npm](https://www.npmjs.com/) (Package Manager for Node.js)
* [Contentful](https://github.com/contentful/contentful.js) (Content Management)

## Core Testing Technologies
* [Tap](https://www.npmjs.com/package/tap) (Unit Testing)
* [Istanbul](https://www.npmjs.com/package/istanbul) (Unit Testing / Code Coverage)
* [Proxyquire](https://github.com/thlorenz/proxyquire) (Unit Testing / Mocking)
* [nock](https://github.com/pgte/nock) (Unit Testing / Mocking)
* [Chai](http://chaijs.com/) (Unit Testing / Expectations and Assertions)
* [Expect.js](https://github.com/Automattic/expect.js) (Unit Testing / Expectations and Assertions)
* [should](https://www.npmjs.com/package/should) (Unit Testing / Expectations and Assertions)

## Installation

1. Download and install [Node.js](https://nodejs.org/en/)
2. Clone the remote Website-GraduateSchool repository to your local development directory
3. Change directories to the root application directory: `cd {your-dev-dir}/Website-GraduateSchool`
4. Run `npm install` to download all the dependent node.js packages

## Running Unit Tests
The complete suite of unit tests can be executed by running the npm test script.  All unit tests must be passing before you submit a pull request to merge any changes.
Using this command, the tests will be executed using the [Tap](https://www.npmjs.com/package/tap) test runner which produces nice, easy to read, output to the console during the test execution.

    npm test

Individual unit test files can be executed as follows

    tap [relative-path-to-test-js-file]

## Running Unit Tests with Code Coverage Reporting
All good unit tests provide not only quality tests, but a high level of code coverage.  Currently, this project does not enforce
any code coverage thresholds, but that will soon change.  It is important when implementing your unit tests to ensure that you are
providing a high level of code coverage.  The complete suite of unit tests can be executed and generate a code coverage report
by running the npm test-coverage script.  Using this command, the tests will be executed using the [Istanbul](https://www.npmjs.com/package/istanbul) test runner and coverage reporter.
The console output during the test execution is a bit more verbose than the output produced by the Tap test runner.

    npm run test-coverage

Upon completion of the test execution, the console will report a summary of the code coverage.  A very detailed, HTML-based,
coverage report is also generated and can be viewed in any browser by navigating to the following file

    {your-dev-dir}/Website-GraduateSchool/coverage/index.html

Individual unit test files can be executed as follows, with the coverage report being generated to the same location as the full test

    istanbul cover [relative-path-to-test-js-file]

## Running the Website-GraduateSchool Application Locally
1. Change directories to the root application directory: `cd {your-dev-dir}/Website-GraduateSchool`
2. To start node using the "dev" configuration: `NODE_ENV=dev node ./bin/www`
3. To start node using the "test" configuration: `NODE_ENV=test node ./bin/www`
4. Access the application via any browser: http://localhost:3000

## Adding Packages
When adding packages please use the `--save` option to add to our list of dependencies in the package.json file. If you add a package please notify the team on SLACK that you have added a package so we can install the dependency on our local machines after syncing with the remote repository.
Using the `-g` option will install the package globally so that you will be able to execute it directly from the commandline.

    Example: npm install [NAME] -g --save

## Tutorials, Blogs, Articles, etc. <br>
### Testing
  1. [Unit Testing Controllers in Express](http://www.designsuperbuild.com/blog/unit_testing_controllers_in_express/)
  2. [Unit Testing Express.js Routes](http://winder.ws/2014/01/20/unit-testing-express-dot-js-routes.html)

## Misc
* [Google Analytics Sharepoint Page](https://agiletrailblazers.sharepoint.com/_layouts/15/WopiFrame.aspx?sourcedoc={28056b3d-a969-4c41-96d0-53760c3f97a4}&action=edit&wd=target%28%2F%2FGS%20General%20Info.one%7C8951f769-4734-400b-9fc4-1b1f404b0a03%2FGoogle%20Analytics%7C8ebbfb76-7ad9-4523-8682-c6d1f9a8da82%2F%29)
