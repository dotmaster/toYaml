#!/usr/bin/env node
/*
 * toYaml command line
 *
 * MIT License (@see License)
 * @author        Gregor Schwab
 * @copyright     (c) 2011 Gregor Schwab
 * Usage Command Line: ./toYaml yamyam.js (@see Readme.md)
 * @requires optimist
 */      
var YAML=require ('./toYaml');        
var logging=false; //set to true to turn on logging
var log=function(){if(logging)console.log('toYaml \n' + Array.prototype.slice.call(arguments) + '\n')}
var sys = require('util');
var constants = require('constants');
var path=require('path'), fs=require('fs');
var command=process.ARGV[1];
var lastPath=path.basename(command);
var argv = require('optimist').usage('Usage: $0 filenameA [filenameB ... -o fileNameOutA -o fileNameOutB] or \n $0 \'JSON\' (don\'t forget to include in \'\' wrappers!)').argv;
var cl=true; //command line  
//console.log(sys.inspect((/.*nmd/).test(argv['$0']), false, 20));
if (!((/.*toYaml/).test(argv['$0']))) {throw Error();} //if not called from commandline

//argv -o normalization
//if there is only one argument inr argv.o optimist doesn't create an array
if(typeof argv.o == 'string') var tmp = argv.o; argv.o=[];argv.o[0]=tmp;
//console.log(sys.inspect(argv, false, 20));           

if (argv.help || argv._[0]=="/?"){console.log('Usage: '+argv.$0+' filenameA [filenameB ... -o fileNameOutA -o fileNameOutB] \n or ' +argv.$0+ ' \'JSON\' (don\'t forget to include it in \'\' wrappers!)'); return;}     
               
var toYaml=function toYamlFn(fileArr, outArr, callback){
    //console.log(sys.inspect(fileArr, false, 20), sys.inspect(outArr, false, 20));
    // Relative or absolute path
    function respondError(msg, context) {
      if (msg.errno===constants.ENOENT) {console.log('ERROR: no such file \"'+ msg.path + '\" perhaps you wanted to use option -o');}
      else console.log("Error: "+sys.inspect(msg));
    }    

    fileArr.forEach(function(fileName, index, fileArr){ 
      try {        
        //input = path.join(__dirname, path.basename(fileName));
        input=fileName;
        log("parsing: "+input); 
        fs.stat(input, function (err, stats) {
          if (err) {
              return respondError(err);
          }
          log("stats: "+sys.inspect(stats)); 
          fs.open(input, 'r', stats.mode, function (err, fd) {
            if (err) return;
            fs.read(fd, stats.size, 0, "utf8", function (e, data) {
              if (e) {
                return respondError(e)
              }
              log("data: "+ data);    
              jsonObj = JSON.parse(data);
              var yaml = YAML.toYaml(jsonObj);
              log("yaml: "+ yaml);              
              handleResponse(yaml);
            });
          });//end fs.open                       
          function handleResponse(yaml){
            writeToFile(yaml)
          }

          function writeToFile(yaml){//write the file to disk
            var buf=new Buffer(yaml, encoding='utf8');
            var outputName = outArr[index]; //if ther is only one argument inr argv.o optimist doesn't create an array
            if( outputName ){outputName=outputName.replace(/([^\.]+)$/,'yaml')}
            else {
              outputName=input.replace(/([^\.]+)$/,'yaml')              
            }
            log(argv.o instanceof Array, sys.inspect(argv), outputName)
            fs.open(outputName, 'w', stats.mode, function (e, fd) {
              fs.write(fd, buf, 0, buf.length, 0, function(err, written){
                if (err) {
                  respondError(err)
                }
                fs.close(fd, function(err){
                  if (err) {
                    respondError(err)
                  }                       
                })
              })
            })        
          }
        })//end fs.stat
      }catch(e){
        respondError(e);
      }//end try..catch        
    })//end forEach
  }//end toYaml   
                                                        
//see if we were passed no argument (means read from stdin)
if((argv._.length))  {
  //try to see if we were passed a file as first parameter  
  try{
    fs.statSync(argv._[0])        
    toYaml(argv._, argv.o);   
  }
  catch(e){                 
       log(argv._[0])   
       //test if we were passed a JSON object as first argument we just output the parsed Yaml file 
       var jsObj = JSON.parse(argv._[0])   
       console.log(YAML.toYaml(jsObj))  
  }         
}      
else{
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var data="";
  process.stdin.on('data', function (chunk) {
    data +=chunk; 
  });

  process.stdin.on('end', function () {     
    console.log(YAML.toYaml(JSON.parse(data))) 
  });
}
