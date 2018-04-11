const fs = require('fs');
const path = require('path');
const publicIp = require('public-ip');
const geoip = require('geoip-lite');
const pk = require("../package.json");


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
    return `
               8I                                        I8    ,dPYb,                   I8
               8I                                        I8    IP''Yb                   I8
               8I                                     88888888 I8  8I                88888888
               8I                                        I8    I8  8'                   I8
         ,gggg,8I    ,ggggg,     ,ggg,,ggg,    ,ggg,     I8    I8 dPgg,     ,gggg,gg    I8
        dP"  "Y8I   dP"  "Y8ggg ,8" "8P" "8,  i8" "8i    I8    I8dP" "8I   dP"  "Y8I    I8
       i8'    ,8I  i8'    ,8I   I8   8I   8I  I8, ,8I   ,I8,   I8P    I8  i8'    ,8I   ,I8,
      ,d8,   ,d8b,,d8,   ,d8'  ,dP   8I   Yb, 'YbadP'  ,d88b, ,d8     I8,,d8,   ,d8b, ,d88b,
      P"Y8888P"'Y8P"Y8888P"    8P'   8I   'Y8888P"Y88888P""Y8888P     'Y8P"Y8888P"'Y888P""Y88  v${pk.version}
      `
  }

}


module.exports = Tools;
