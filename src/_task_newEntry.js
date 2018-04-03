
const Logger = require('./Logger.js');

function createNewEntry( configData ){
  let logger = new Logger( configData );
  logger.startNewEntry( function( err ){
    if( err ){
      console.log("ERROR", err.message );
    }else{
      console.log("Task added.");
    }
    process.exit()
  })
}


module.exports = createNewEntry;
