const chalk = require('chalk');
const Tools = require('./Tools.js');
const pk = require("../package.json");



let thinSeparator = new Array( process.stdout.columns + 1).join('─');
let thickSeparator = new Array( process.stdout.columns + 1).join('═');
let blackSeparator = new Array( process.stdout.columns + 1).join('█');

class EntryPrinter  {

  static print( entries ){

    if( entries.length === 0){
      console.log("No entry was found :(");
    }else{
      Tools.clearScreen();
      console.log(blackSeparator);
      console.log(`
                 8I                                        I8    ,dPYb,                   I8
                 8I                                        I8    IP''Yb                   I8
                 8I                                     88888888 I8  8I                88888888
                 8I                                        I8    I8  8'                   I8
           ,gggg,8I    ,ggggg,     ,ggg,,ggg,    ,ggg,     I8    I8 dPgg,     ,gggg,gg    I8
          dP"  "Y8I   dP"  "Y8ggg ,8" "8P" "8,  i8" "8i    I8    I8dP" "8I   dP"  "Y8I    I8
         i8'    ,8I  i8'    ,8I   I8   8I   8I  I8, ,8I   ,I8,   I8P    I8  i8'    ,8I   ,I8,
        ,d8,   ,d8b,,d8,   ,d8'  ,dP   8I   Yb, 'YbadP'  ,d88b, ,d8     I8,,d8,   ,d8b, ,d88b,
        P"Y8888P"'Y8P"Y8888P"    8P'   8I   'Y8888P"Y88888P""Y8888P     'Y8P"Y8888P"'Y888P""Y88  v${pk.version}
        `);

      entries.forEach( function(entry, index){
        console.log( blackSeparator.substring(0, blackSeparator.length - index.toString().length - 1) + " " + index );
        let tags = entry.tags.map(function(t){ return chalk.white.bgBlack( ' ' + t + ' ')}).join(' ');
        console.log("Date:", entry.date, "\t│ Location:", entry.place, "\t│ Tags:", tags);
        console.log(thinSeparator);
        console.log(entry.message);
        console.log();
      })
      console.log( blackSeparator );
    }
  }

}


module.exports = EntryPrinter;
