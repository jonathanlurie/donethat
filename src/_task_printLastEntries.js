const path = require('path');
const glob = require("glob");
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const Logger = require('./Logger.js');
const Tools = require('./Tools.js');

function printLastEntries( configData, howManyDays ){
  Tools.clearScreen();

  let today = new Date();
  let nDaysAgo = new Date();
  nDaysAgo.setDate(today.getDate() - howManyDays);
  nDaysAgo.setHours(4, 0, 0); // make it start early at the morning
  //let timestampFromNdaysAgo = Tools.getLocalTimestampFromDate( nDaysAgo );
  let timestampFromNdaysAgo = ( +nDaysAgo );
  //console.log( "timestamps greater than", timestampFromNdaysAgo );

  let logGlobPath = configData.workingDir + path.sep + 'logs' + path.sep + '**' + path.sep + '*.json';
  let allLogs = glob.sync( logGlobPath );

  // keeping only the ones since the given date
  let logsToKeep = allLogs.filter( function( logPath ){
    let timestamp = parseInt(path.basename( logPath, '.json' ));
    return timestamp >= timestampFromNdaysAgo;
  })


  // sorting older on top
  logsToKeep.sort( function(pathA, pathB){
    let timestampA = parseInt(path.basename( pathA, '.json' ));
    let timestampB = parseInt(path.basename( pathB, '.json' ));
    return timestampA > timestampB;
  })

  var logList = logsToKeep.map(function( logPath ){
    return jsonfile.readFileSync( logPath );
  })

  


  logList.forEach( function(entry, index){
    console.log( blackSeparator );
    let tags = entry.tags.map(function(t){ return chalk.white.bgBlack( ' ' + t + ' ')}).join(' ');
    console.log("Date:", entry.date, "\t│ Location:", entry.place, "\t│ Tags:", tags);
    console.log(thinSeparator);
    console.log(entry.message);
    console.log();
  })
  console.log( blackSeparator );
  //console.log( logList );


}


module.exports = printLastEntries;
