#!/usr/bin/env node

const ArgParser = require("../src/ArgParser");
var argParser = new ArgParser();

const Config = require("../src/Config.js");
var config = new Config();

const EntrySelector = require('../src/EntrySelector.js');
const EntryPrinter = require("../src/EntryPrinter.js");

const pk = require("../package.json");
const Tools = require("../src/Tools.js")

function printHelp(){
  let help = `
  You can use the following options:
    no argument         --> Add a new record

    --all               print all the entries (oldest to newest)
    --tags=tag1,tag2    print entries with at least one of these tags (coma separated)
    --last=n            print the entries no older than 'n' days ago
    --start=mm/dd/yyyy  print entries since since date
    --end=mm/dd/yyyy    print entries up to this date
    --location=paris    print entries with a match of word for location
    --help              print this help menu

    The different options can be combined.
    If no --end date is provided, now is chosen
    If no --start is provided, the oldest date available is chosen

    Bug or issues: https://github.com/jonathanlurie/donethat

    donethat v${pk.version}
  `

  console.log( help );
}

config.onWorkingDirFetched( function(){
 //console.log( config.getConfigData() );

  if( argParser.hasCorruptedArgument() ){
    console.log("WARN: some argument are not in the expected format");
    printHelp();
    process.exit();
  }

  // print the header
  Tools.clearScreen();
  console.log(Tools.getHeader());

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
      if( !("stillOk" in e) ){
        console.error( e );
      }

    }


    let entrySelector = new EntrySelector( config.getConfigData() );

    // --all
    try{
      let all = argParser.getArgValue("all");
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }

    // --tags
    try{
      let tags = argParser.getArgValue("tags");
      entrySelector.withComaSeparatedTags( tags );
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }

    // --last
    try{
      let last = argParser.getArgValue("last");
      entrySelector.theLastNDays( last );
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }



    // --start
    try{
      let startDate = argParser.getArgValue("start");

      if(!(startDate instanceof Date)){
        let msg = "ERROR: he start date format is invalid";
        console.warn(msg);
        throw msg
      }
      console.log("correct date", startDate.toString());

      entrySelector.starting( startDate );
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }



    // --end
    try{
      let endDate = argParser.getArgValue("end");

      if(!(endDate instanceof Date)){
        let msg = "ERROR: he end date format is invalid";
        console.warn(msg);
        throw msg
      }
      console.log("correct date", endDate.toString());

      entrySelector.ending( endDate );
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }


    // --location
    try{
      let location = argParser.getArgValue("location");
      entrySelector.atLocation( location );
      somethingToPrint = true;
    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }

    if( somethingToPrint ){
      entrySelector.runQuery();
      let selectedEntries = entrySelector.getResult();

      EntryPrinter.print( selectedEntries )

      //console.log( selectedEntries );
    }else{
      printHelp();
      process.exit();
    }


  }
});

config.fetchWorkingDir()
