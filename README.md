<div align="center">
  <img src="/icons/stylescript-logo-full.png" width="210">
</div>
<br>

<div align="left">
  <img src="https://img.shields.io/badge/node-%3E%3D%206.0.0-brightgreen">
  <img src="https://img.shields.io/badge/platform-linux--64%20%7C%20win--32%20%7C%20osx--64%20%7C%20win--64-lightgrey">
  <img src="https://img.shields.io/badge/license-ISC-blue">
  <img src="https://img.shields.io/badge/language-TypeScript-yellow">
 </div>

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
