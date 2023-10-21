<h1><img src="https://github.com/Crisp32/StyleScript/blob/master/icons/stylescript-logo-full.png?raw=true" width="230"></h1>
<br>

<div align="left">
  <img src="https://img.shields.io/badge/node-%3E%3D%206.0.0-brightgreen">
  <img src="https://img.shields.io/badge/license-ISC-blue">
  <img src="https://img.shields.io/badge/language-TypeScript-yellow">
  <img src="https://img.shields.io/badge/developer-Connell Reffo-red">
 </div>

# Table of Contents
 - [Info](#info)
 - [Installation](#installation)
 - [Dependancies](#dependancies)
 - [Examples](#stylescript-code-examples)
 - [Integration](#integration-with-ts-node)

# Info
StyleScript is a CSS superset designed to be directly integrated with a TypeScript Node.js webserver.

# Dependancies
```json
"dependencies": {
  "@types/node": "^13.7.1",
  "body-parser": "^1.19.0",
  "fs": "0.0.1-security",
  "nodemon": "^2.0.2",
  "ts-node": "^8.6.2",
  "ts-node-dev": "^1.0.0-pre.44",
  "tsc": "^1.20150623.0",
  "typescript": "^3.7.5"
}
```

# Installation
 - Inside of your Node.js project, run **npm install @crisp32/stylescript**
 - You are now ready to use StyleScript in your project

# StyleScript Code Examples
```scss
/* Include Multiple Files (Automatically Assumes *.sscr File Extension) */
%include(./styles1, ./styles2);

/* Variable Declaration */
%var(bgColour, #131313);
%var(txtColour, white);

/* Variable Re-Assignment */
%var(txtColour, lightgrey);

/* Style Script Block Definition */
%testBlock {
  text-align: center;
  color: %txtColour; /* Variable Insertion */
}

div {
  %testBlock; /* Insert Code Block */
  margin-bottom: 5px;
}

```

# Integration With TS-Node
```typescript
import { StyleScript as ss } from "stylescript"; // Can also use require("stylescript").StyleScript;

const express = require("express");
const parser = require("body-parser");
const app = express();
const port = 3000;

// Use Body Parser Middleware
app.use(parser.urlencoded({ extended:true }));

// StyleScript Auto Compile Middleware
app.use(async (req, res, next):void => {
    
    // Set __dirname to the Root Directory of the Project
    ss.autoCompile(req, res, next, __dirname, {
        highlightColour: "blue" // Can be used in SSCR { background-color: %highlightColour; }
    });
});

// Another way of Serving StyleScript
app.get("/someStyles", async (req, res):void => {
  res.setHeader("content-type", "text/css");
  res.send(ss.compile("./styles.sscr"), {
    someVar: "red",
    divWidth: "20px"
  });
});

// Simple Page that will Reference the example.sscr Style Sheet
app.get("/", (req, res):void => res.send(`
  <link rel="stylesheet" type="text/css" href="example.sscr">
  <div>Hello World!</div>
`));

// Start Server
app.listen(port, ():void => console.log(`SSCR Example Listening on Port ${port}!`));
```
