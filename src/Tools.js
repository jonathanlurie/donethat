const fs = require('fs');
const path = require('path');
require('dotenv').config();
const publicIp = require('public-ip');
const geoip = require('geoip-lite');


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

}


module.exports = Tools;
