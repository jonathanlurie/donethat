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
        callbackDone( null );
      }

    })
    .catch( function( err ){
      callbackDone( null );
    }) ;
  }


}


module.exports = Tools;
