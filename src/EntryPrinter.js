const chalk = require('chalk');
const Tools = require('./Tools.js');


let thinSeparator = new Array( process.stdout.columns + 1).join('─');
let blackSeparator = new Array( process.stdout.columns + 1).join('█');

class EntryPrinter  {

  static print( entries ){

    if( entries.length === 0){
      console.log("No entry was found :(");
    }else{
      Tools.clearScreen();
      console.log(blackSeparator);
      console.log(Tools.getHeader());

      entries.forEach( function(entry, index){
        console.log( blackSeparator.substring(0, blackSeparator.length - index.toString().length - 1) + " " + index );
        let tags = entry.tags.map(function(t){ return chalk.white.bgBlack( ' ' + t + ' ')}).join(' ');
        console.log("Date:", entry.date, "\t│ Location:", entry.place || "somewhere", "\t│ Tags:", tags);
        console.log(thinSeparator);
        console.log(entry.message);
        console.log();
      })
      console.log( blackSeparator );
    }
  }

}


module.exports = EntryPrinter;
