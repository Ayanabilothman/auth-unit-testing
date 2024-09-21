# Jest to test express controllers

## Description

How to use jest with Nodejs ES modules to test express controllers. Here you will find how to test asynchronous code and how to use mocks to get rid of side effects.

Note: Babel is used to enable Jest using with ES6 modules.

## Setup

To go through it on your own:

1. Initialize your app
   `npm init`

2. To use ES modules, add `type: "module"` to `package.json` file.

3. Install express, mongoose and jest packages
   `npm install express mongoose jest`

4. Initialize jest
   `npm init jest@latest`

5. In `jest.config.mjs` file: de-comment `transform` key and assign it a value like `transform: { "^.+\\.js$": "babel-jest" }`. Just be aware that the `rejex` will depend on the file extensions on your project.

6. Install babel
   `npm i @babel/core @babel/node @babel/preset-env`

7. Configure babel by creating `.babelrc` file in the root folder.

8. Inside `.babelrc` file write

   ```
   {
       "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]]
   }
   ```

## Article

If you have no background in testing, check out this tutorial:

https://www.freecodecamp.org/news/how-to-handle-side-effects-in-jest/
