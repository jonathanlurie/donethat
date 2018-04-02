const Prompter = require("./src/Prompter.js");
const Tools = require("./src/Tools.js");
const Config = require("./src/Config.js");

/*
Prompter.multiline( function( result ){
  process.stdout.write(`message: ${result}\n`);
})
*/

/*
Prompter.monoline( function( result ){
  process.stdout.write(`message: ${result}\n`);
})
*/

//Tools.clearScreen();
//
//
var config = new Config();

config.onWorkingDirFetched( function(){
 console.log( config.getConfigData() );
});

config.fetchWorkingDir()
