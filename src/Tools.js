const fs = require('fs');
const path = require('path');
const publicIp = require('public-ip');
const geoip = require('geoip-lite');
const chalk = require('chalk');


class Tools {

  static clearScreen(){
    process.stdout.write('\u001Bc');
  }

  static getLocation( callbackDone ){
    publicIp.v4()
    .then( function(ip){
      var geo = geoip.lookup(ip);

      if( geo ){
        let location = geo.city + ", " + geo.region + ", " + geo.country;
        callbackDone( location );
      }else{
        callbackDone( '' );
      }

    })
    .catch( function( err ){
      callbackDone( '' );
    }) ;
  }


  /**
   * Get the timestamp as if it was in the local timezone, otherwise,
   * a date converted into timestamp cannot convert back into the original date.
   * @param  {[type]} d [description]
   * @return {[type]}   [description]
   */
  static getLocalTimestampFromDate( d ){
    return (d.getTime() - (d.getTimezoneOffset() * 60000));
  }

  static getHeader(){

    let header = [
      "",
      "    ██████╗  ██████╗ ███╗   ██╗███████╗████████╗██╗  ██╗ █████╗ ████████╗",
      "    ██╔══██╗██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██║  ██║██╔══██╗╚══██╔══╝",
      "    ██║  ██║██║   ██║██╔██╗ ██║█████╗     ██║   ███████║███████║   ██║",
      "    ██║  ██║██║   ██║██║╚██╗██║██╔══╝     ██║   ██╔══██║██╔══██║   ██║",
      "    ██████╔╝╚██████╔╝██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║   ██║",
      "    ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝",
      ""
    ].map( function(line){
      return line + new Array( (process.stdout.columns - line.length) +1).join(' ');
    }).join("");

    //let randomColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    let randomColor = Math.random()*0xFFFFFF<<0;
    let randomColor2 = 0xFFFFFF - randomColor;
    let randomColorStr = '#' + randomColor.toString(16);
    let randomColor2Str = '#' + randomColor2.toString(16);

    return chalk.bgHex(randomColorStr).hex(randomColor2Str)(header);


  }


  static displayErrorMessage( msg ){
    let colorMsg = chalk.bgHex("FF0000").hex("#FFFFFF")(msg);
    console.log( colorMsg );
  }

}


module.exports = Tools;
