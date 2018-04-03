#!/usr/bin/env node

var ArgParser = require("../src/ArgParser");
var argParser = new ArgParser();

const Config = require("../src/Config.js");
var config = new Config();



function printHelp(){
  let help = `
  You can use the following options:

    --last=n    to print the history of last 'n' days.
    --help      to print this help

  `
}

config.onWorkingDirFetched( function(){
 //console.log( config.getConfigData() );

  // when no args, just launch the normal 'donethat' logger
  if( argParser.getNumberOfArgs() === 0 ){
    const createNewEntry = require('../src/_task_newEntry.js');
    createNewEntry( config.getConfigData() );
  }else{

    let didSomething = false;

    // get the last n days
    try{
      let lastNDays = argParser.getArgValue("last");
      didSomething = true;

      console.log("printing the last", lastNDays, "last days.");
    }catch( e ){}


    // print th ehekp menu
    try{
      var helpVal = argParser.getArgValue("help");
      if( helpVal ){
        didSomething = true;
        printHelp();
        process.exit()
      }
    }catch(e){}


    if( !didSomething ){
      printHelp();
      process.exit()
    }
  }

});

config.fetchWorkingDir()
