const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile')
require('dotenv').config();
const homedir = require('homedir');
const Prompter = require("./Prompter.js");


let trials = 0;
let trialMax = 3;

class Config {

  constructor( ){
    this._configFilePath = path.resolve( homedir(), process.env.CONFIG_FILE );
    this._workingDir = null;
    this._cbOnWorkingDirFetched = null;
  }

  fetchWorkingDir( ){
    let workingDir = null;

    if( fs.existsSync( this._configFilePath ) ){
      let config = jsonfile.readFileSync( this._configFilePath );
      console.log( config );
      this._workingDir = config.workingDir;
      this._cbOnWorkingDirFetched()
      return;
    }

    if( !workingDir ){
      console.log("Where do you want to store your DoneThat data?");
      this._askForWorkingFolder( this._cbOnWorkingDirFetched )
      return;
    }
  }


  _askForWorkingFolder( cbDone ){
    let that = this;
    Prompter.monoline( function( result ){
      if(fs.existsSync( result )){
        trials = 0;
        that._workingDir = result;
        var config = {
          workingDir: result
        }

        jsonfile.writeFileSync( that._configFilePath, config )
        cbDone( result )
      }else{
        trials ++;
        if( trials < trialMax ){
          console.log("The folder should exist, please retry.");
          that._askForWorkingFolder( cbDone );
        }else{
          process.exit();
        }
      }
    })
  }


  getWorkingDir(){
    return this._workingDir;
  }

  onWorkingDirFetched( cb ) {
    this._cbOnWorkingDirFetched = cb;
  }

}


module.exports = Config;
