const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const homedir = require('homedir');
const Prompter = require("./Prompter.js");


let trials = 0;
let trialMax = 3;

class Config {

  constructor( ){
    this._configFilePath = path.resolve( homedir(), ".donethat.json");
    this._cbOnWorkingDirFetched = null;
    this._configData = { workingDir: null }
  }


  /**
   * Fetch the working dir, either by reading the config file (if it exists) or
   * by asking the user to type if in a prompt.
   */
  fetchWorkingDir( ){
    let workingDir = null;

    if( fs.existsSync( this._configFilePath ) ){
      this._configData = jsonfile.readFileSync( this._configFilePath );
      this._cbOnWorkingDirFetched();
      return;
    }

    if( !workingDir ){
      console.log("Where do you want to store your DoneThat data?");
      this._askForWorkingFolder( this._cbOnWorkingDirFetched )
      return;
    }
  }


  /**
   * [PRIVATE]
   * Displays a prompt so that the user can type the path of the working directory.
   * This is supposed to happen only if the config file was not found
   * @param  {Function} cbDone - callback for when the user is done typing
   */
  _askForWorkingFolder( cbDone ){
    let that = this;
    Prompter.monoline( function( result ){
      if(fs.existsSync( result )){
        trials = 0;
        that._workingDir = result;
        that._configData.workingDir = result;
        that._configData.tagFile = "tags.json";
        that._writeConfigData()
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


  /**
   * Get the path to the working directory
   * @return {String} the path
   */
  getConfigData(){
    return this._configData;
  }


  /**
   * Specify the callback for when the path to the working directpry is fetched
   * @param  {Function} cb - the callback
   */
  onWorkingDirFetched( cb ) {
    this._cbOnWorkingDirFetched = cb;
  }


  /**
   * Write the configData object on disc
   */
  _writeConfigData(){
    jsonfile.writeFileSync( this._configFilePath, this._configData )

    let tagFilePath = path.resolve( this._configData.workingDir, this._configData.tagFile);
    if( !fs.existsSync( tagFilePath ) ){
      jsonfile.writeFileSync( tagFilePath, {} )
    }

  }

}


module.exports = Config;
