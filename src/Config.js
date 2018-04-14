const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const homedir = require('homedir');
const Prompter = require("./Prompter.js");
const Tools = require("./Tools.js");

let trials = 0;
let trialMax = 3;

class Config {

  constructor( ){
    this._configFilePath = path.resolve( homedir(), ".donethat.json");
    this._cbOnWorkingDirFetched = null;
    this._cbOnWorkingDirMissing = null;
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
      this._cbOnWorkingDirMissing();
      return;
    }
  }


  /**
   * Defines the working folder (place to save data)
   * @param  {Function} path - a valid absolute path
   */
  defineWorkingFolder( path ){
    if(fs.existsSync( path )){
      this._workingDir = path;
      this._configData.workingDir = path;
      this._configData.tagFile = "tags.json";
      this._writeConfigData();
      Tools.displayOkMessage("Saving directory succesfully set to " + path);
    }else{
      throw {message: 'The directory doe not exist', stillOk: true}
    }
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
   * Specify a callback for when the working folder is missing
   * @param  {Function} cb - the callback
   */
  onWorkingDirMissing( cb ) {
    this._cbOnWorkingDirMissing = cb;
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
