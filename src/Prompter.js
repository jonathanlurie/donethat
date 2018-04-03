const readline = require('readline');

class Prompter {

  static multiline( callbackDone, exitStr=':q', promptStr='░░░ '){
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: promptStr
    });

    let lines = [];

    process.stdout.write(`» type '${exitStr}' on a new line to validate\n`);
    rl.prompt();

    rl.on('line', function(line){
      let cleanLine = line.trim();

      if( cleanLine === exitStr ){
        rl.close()
        return;
      }

      if( cleanLine.length !== 0){
        lines.push( cleanLine );
      }

      rl.prompt();
    });

    rl.on('close', () => {
      let wholeStr = lines.length === 0 ? null : lines.join('\n');
      callbackDone( wholeStr );
    });
  }


  static monoline( callbackDone, promptStr='░░░ '){
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: promptStr
    });

    rl.prompt();
    let cleanLine = null;

    rl.on('line', function(line){
      cleanLine = line.trim();
      rl.close();
    });

    rl.on('close', () => {
      callbackDone( cleanLine );
    });
  }

}


module.exports = Prompter;
