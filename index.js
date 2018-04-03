//const Prompter = require("./src/Prompter.js");
//const Tools = require("./src/Tools.js");
const Config = require("./src/Config.js");


//Tools.clearScreen();
//
//
var config = new Config();

config.onWorkingDirFetched( function(){
 //console.log( config.getConfigData() );

  const createNewEntry = require('./src/_task_newEntry.js');
  createNewEntry( config.getConfigData() );
});

config.fetchWorkingDir()
