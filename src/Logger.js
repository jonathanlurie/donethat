class Logger {
  constructor( configData ){
    this._configData = configData;
  }

  createEntry(){
    console.log("Hello, what did you do today?");
    Prompter.multiline( function( myDay ){

      if( !myDay )
        return;

      console.log("Any tag to add? (comma separated)");
      Prompter.monoline( function( myTags ){
        let cleanTags = []

        if( myTags ){
          cleanTags = myTags.split(',').map( function(b){return b.trim().toLowerCase()}).filter(function(t){ return (t.length > 0)})
        }


      })
    })


    /*
    Prompter.monoline( function( result ){
      process.stdout.write(`message: ${result}\n`);
    })
    */

  }


}

module.exports = Logger;
