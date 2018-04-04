const path = require('path');
const glob = require("glob");
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const Logger = require('./Logger.js');
const Tools = require('./Tools.js');


/*
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

  let thinSeparator = new Array( process.stdout.columns + 1).join('─');
  let thickSeparator = new Array( process.stdout.columns + 1).join('═');
  let blackSeparator = new Array( process.stdout.columns + 1).join('█');


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
*/

class EntrySelector {
  constructor( configData ){
    this._configData = configData;
    this._startDate = null;
    this._endDate = null;
    this._tags = null;
    this._location = null;

    this._queryResult = null;
  }

  starting( d ){
    this._startDate = d;
  }

  ending( d ){
    this._endDate = d;
  }

  theLastNDays( n ){
    this._endDate = new Date();
    this._startDate = new Date();
    this._startDate.setDate( this._endDate.getDate() - n );
    this._startDate.setHours(4, 0, 0); // make it start early at the morning
  }

  withComaSeparatedTags( comaTags ){
    this._tags = comaTags.split(',').map( t => t.trim() )
  }

  atLocation( location ){
    this._location = location.toLowerCase();
  }

  runQuery(){
    let that = this;
    let entriesPaths = this._getAllEntriesPaths();
    this._orderEntriesPaths( entriesPaths );

    // we want all of them!
    if( !this._startDate && !this._endDate && !this._tags && !this._location ){
      let entriesObjects = this._getEntriesObjectsFromEntriesPaths( entriesPaths )
      this._queryResult = entriesObjects;
      return;
    }


    // TODO: ArgParse is messed up when arg is a date
    // select entries only newer than such date
    if( this._startDate ){
      entriesPaths = entriesPaths.filter( function( logPath ){
        let timestamp = parseInt(path.basename( logPath, '.json' ));
        console.log(timestamp ,+that._startDate );
        return timestamp >= (+that._startDate);
      })
    }

    // select entries on older than such date
    if( this._endDate ){
      entriesPaths = entriesPaths.filter( function( logPath ){
        let timestamp = parseInt(path.basename( logPath, '.json' ));
        return timestamp <= (+that._endDate);
      })
    }

    // sorting entries, older on top
    this._orderEntriesPaths( entriesPaths );

    // at this moment, we have to read the files to go further
    let entriesObjects = this._getEntriesObjectsFromEntriesPaths( entriesPaths )

    // keeping only some tags
    if( this._tags ){
      entriesObjects = entriesObjects.filter(function(entryObj){
        return that._entryObjectHasOneOfTheseTags( entryObj , that._tags );
      })
    }

    // keeping only some location
    if( this._location ){
      entriesObjects = entriesObjects.filter(function(entryObj){
        return ( entryObj.place.toLowerCase().indexOf( that._location ) !== -1 )
      })
    }

    this._queryResult = entriesObjects;
  }


  _getAllEntriesPaths(){
    let logGlobPath = this._configData.workingDir + path.sep + 'logs' + path.sep + '**' + path.sep + '*.json';
    return glob.sync( logGlobPath );
  }


  _orderEntriesPaths( ep ){
    // sorting older on top
    ep.sort( function(pathA, pathB){
      let timestampA = parseInt(path.basename( pathA, '.json' ));
      let timestampB = parseInt(path.basename( pathB, '.json' ));
      return timestampA > timestampB;
    })
  }


  _getEntriesObjectsFromEntriesPaths( ep ){
    var entriesObj = ep.map(function( logPath ){
      return jsonfile.readFileSync( logPath );
    })
    return entriesObj;
  }


  _entryObjectHasOneOfTheseTags( entryObject, tags ){
    for(let i=0; i<tags.length; i++){
      if( entryObject.tags.indexOf( tags[i].toLowerCase() ) !== -1 )
        return true
    }
    return false;
  }


  getResult(){
    return this._queryResult;
  }

}

module.exports = EntrySelector;
