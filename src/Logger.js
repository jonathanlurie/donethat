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


  _saveNewEntry( message, tags, date, place ){
    let folder = path.resolve(
      this._configData.workingDir,
      date.getFullYear().toString(),
      (date.getMonth()+1).toString(),
      date.getDate().toString()
    )
    mkdirp.sync( folder );

    let filename = (+date) + ".json";
    let fullPath = path.resolve( folder, filename );

    let entry = {
      message: message,
      tags: tags,
      date: date.toISOString(),
      place: place
    }

    jsonfile.writeFileSync( fullPath, entry )

    // TODO: add the file path to the tag file
  }

}

module.exports = Logger;
