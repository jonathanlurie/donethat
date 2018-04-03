const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const jsonfile = require('jsonfile');
const Tools = require('./Tools.js');
const Prompter = require('./Prompter.js');


class Logger {
  constructor( configData ){
    this._configData = configData;
  }


  startNewEntry( cbDone ){
    let that = this;
    Tools.clearScreen();
    console.log("Hello, what did you do today?");
    Prompter.multiline( function( myDay ){

      if( !myDay )
        return cbDone( {message: "No message to write an entry with"} );

      console.log("Any tag to add? (comma separated)");
      Prompter.monoline( function( myTags ){
        let cleanTags = []

        if( myTags ){
          cleanTags = myTags.split(',')
                            .map( function(b){return b.trim().toLowerCase()})
                            .filter(function(t){ return (t.length > 0)})
        }

        Tools.getLocation( function( place ){
          that._saveNewEntry( myDay, cleanTags, new Date(), place );
          cbDone( null );
        })

      })
    })

  }


  /**
   * Saves a new entry and sync the tag file
   * @param  {String} message - the message (from prompt)
   * @param  {Array} tags - list of tags
   * @param  {Date} date - a date object
   * @param  {String} place - a place
   */
  _saveNewEntry( message, tags, date, place ){
    let folderRelativeToWorkingDir = "." + path.sep +
      "logs" + path.sep +
      date.getFullYear().toString() + path.sep +
      (date.getMonth()+1).toString() + path.sep +
      date.getDate().toString()

    let folderAbsolute = path.resolve(
      this._configData.workingDir,
      folderRelativeToWorkingDir
    )

    mkdirp.sync( folderAbsolute );

    //let filename = Tools.getLocalTimestampFromDate(date) + ".json";
    let filename = (+date) + ".json";
    let fullPath = path.resolve( folderAbsolute, filename );
    let relativePath =  folderRelativeToWorkingDir + path.sep + filename;

    let entry = {
      message: message,
      tags: tags,
      date: date.toString(),
      place: place
    }

    // write the message
    jsonfile.writeFileSync( fullPath, entry )

    let tagFilePath = path.resolve( this._configData.workingDir, this._configData.tagFile);
    let allTags = jsonfile.readFileSync( tagFilePath );

    for(let i=0; i<tags.length; i++){
      if(!(tags[i] in allTags))
        allTags[ tags[i] ] = [];

      allTags[ tags[i] ].push( relativePath )
    }

    jsonfile.writeFileSync( tagFilePath, allTags );
  }

}

module.exports = Logger;
