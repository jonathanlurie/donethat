#!/usr/bin/env node

var ArgParser = require("../src/ArgParser");
var argParser = new ArgParser();

const Config = require("../src/Config.js");
var config = new Config();

const EntrySelector = require('../src/EntrySelector.js');


function printHelp(){
  let help = `
  You can use the following options:
    no argument         --> Add a new record

    --all               print all the entries (oldest to newest)
    --tags=tag1,tag2    print entries with at least one of these tags (coma separated)
    --last=n            print the entries that no older than 'n' days
    --start=mm/dd/yyyy  a starting date
    --end=mm/dd/yyyy a ending date
    --location=paris

    --help      --> to print this help

  `

  console.log( help );
}

config.onWorkingDirFetched( function(){
 //console.log( config.getConfigData() );

  // when no args, just launch the normal 'donethat' logger
  if( argParser.getNumberOfArgs() === 0 ){
    const createNewEntry = require('../src/_task_newEntry.js');
    createNewEntry( config.getConfigData() );
  }else{
    let somethingToPrint = false;

    // --help
    try{
      let help = argParser.getArgValue("help");
      if( help ){
        printHelp();
        process.exit();
      }
    }catch( e ){
      console.error( e );
    }


    let entrySelector = new EntrySelector( config.getConfigData() );

    // --all
    try{
      let all = argParser.getArgValue("all");
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }

    // --tags
    try{
      let tags = argParser.getArgValue("tags");
      entrySelector.withComaSeparatedTags( tags );
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }

    // --last
    try{
      let last = argParser.getArgValue("last");
      entrySelector.theLastNDays( last );
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }



    // --start
    try{
      let start = argParser.getArgValue("start");
      let startDate = new Date(start);
      console.log( startDate.toString());
      if(isNaN( startDate.getTime() )){
        let msg = "ERROR: he start date format is invalid";
        console.warn(msg);
        throw msg
      }
      entrySelector.starting( start );
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }



    // --end
    try{
      let end = argParser.getArgValue("end");
      entrySelector.ending( start );
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }

    // --location
    try{
      let location = argParser.getArgValue("location");
      entrySelector.atLocation( location );
      somethingToPrint = true;
    }catch( e ){
      console.error( e );
    }

    if( somethingToPrint ){
      entrySelector.runQuery();
      let selectedEntries = entrySelector.getResult();

      console.log( selectedEntries );
    }else{
      printHelp();
      process.exit();
    }


  }
});

config.fetchWorkingDir()
