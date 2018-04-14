const Tools = require("./Tools.js");
const Logger = require('./Logger.js');

function createNewEntry( configData ){
  let logger = new Logger( configData );
  logger.startNewEntry( function( err ){
    if( err ){
      Tools.displayErrorMessage( err.message );
    }else{
      Tools.displayOkMessage("\nEntry successfully added!\n");
    }
    process.exit()
  })
}


module.exports = createNewEntry;
