var main = require('./dist/main');

//ES6 quirks... Too lazy to write an es6 bootstrapper atm
var multiLink = new main.Main('./config/default.yaml');

multiLink.go();
