# Installation Notes
Test run after "nvm use 20"  There are some warnings, but the project originally used node.js 12 or something.

nvm use 16

npx ng serve

Modified scripts in package.json to use "npx ng" instead of ng

Angular version was wrong: 
npm install --save-dev @angular/cli@9.1.0

This requires node.js version 16 or slightly earlier: 
nvm use 16
npx ng serve

or 
npm install -g @angular/cli@9.1.0
ng serve