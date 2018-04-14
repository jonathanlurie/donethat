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
    --config=/path/     defines the directory to save your data (absolute path)
    --help              print this help menu

    The different options can be combined.
    If no --end date is provided, now is chosen
    If no --start is provided, the oldest date available is chosen

    Bug or issues: https://github.com/jonathanlurie/donethat

    donethat v${pk.version}
  `

  console.log( help );
}

function showWrongArgMsg(){
  console.log();
  Tools.displayErrorMessage("ERROR: wrong argument format.")
}


// print the header
Tools.clearScreen();
console.log(Tools.getHeader());

config.onWorkingDirFetched( function(){
 //console.log( config.getConfigData() );

  if( argParser.hasCorruptedArgument() ){
    showWrongArgMsg();
    printHelp();
    process.exit();
  }

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

    try{
      let all = argParser.getArgValue("config");
      defineWorkingDir()
    }catch( e ){
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
      if( typeof tags === 'string' ){
        entrySelector.withComaSeparatedTags( tags );
        somethingToPrint = true;
      }else{
        showWrongArgMsg();
      }

    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }

    // --last
    try{
      let last = argParser.getArgValue("last");
      if( typeof last === 'number'){
        entrySelector.theLastNDays( last );
        somethingToPrint = true;
      }else{
        showWrongArgMsg();
      }

    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }


    // --start
    try{
      let startDate = argParser.getArgValue("start");

      if( startDate instanceof Date ){
        entrySelector.starting( startDate );
        somethingToPrint = true;
      }else{
        showWrongArgMsg();
      }

    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }



    // --end
    try{
      let endDate = argParser.getArgValue("end");

      if( endDate instanceof Date ){
        entrySelector.ending( endDate );
        somethingToPrint = true;
      }else{
        showWrongArgMsg();
      }

    }catch( e ){
      if( !("stillOk" in e) ){
        console.error( e );
      }
    }


    // --location
    try{
      let location = argParser.getArgValue("location");
      if( typeof location === "string"){
        entrySelector.atLocation( location );
        somethingToPrint = true;
      }else{
        showWrongArgMsg();
      }

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


config.onWorkingDirMissing( defineWorkingDir )


function defineWorkingDir( ){
  // when no arg is done
  if( argParser.getNumberOfArgs() === 0 ){
    console.log("First time using donethat?")
    console.log("Define your saving directory with")
    Tools.displayErrorMessage("donethat --config=/some/absolute/path")
    console.log()
    process.exit();
  }

  try{
    let workingdir = argParser.getArgValue("config");
    if( typeof workingdir === 'string'){
      config.defineWorkingFolder( workingdir )
    }else{
      throw {message: 'The saving directory must be a valid string.', stillOk: true}
    }

  }catch( e ){
    //console.log( e );
    if('stillOk' in e){
      Tools.displayErrorMessage( e.message + '\n');
    }
    console.log("Define your saving directory with")
    Tools.displayOkMessage("donethat --config=/some/absolute/path")
    console.log()

  }
  process.exit();
}

config.fetchWorkingDir()
