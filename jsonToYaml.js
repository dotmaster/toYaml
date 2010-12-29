
var sys=require('sys');
var opts={
  enableLinks:true, //default
  yamlCompatible:true //default
}

var objh={}, links=[];
var idCounter = 0;


Object.prototype.toYaml=OOToYaml;
Array.prototype.toYaml=OOToYaml;

exports.toYaml= toYaml;


function OOToYaml(options){
  return toYaml(this, options);
}

function toYaml(obj, options){
  helper.extend(opts, options);
  if (opts.enableLinks) preProcessLinks(obj);
  //console.log(links);
  var header = "";
  var ret = walkToYaml(obj);
  //reset global objects
  objh={}, links=[];
  idCounter = 0;
  return header+ret+"\n";

  function walkToYaml(obj, l, before) {
      if (typeof before === 'undefined') var before=""; 
      if (typeof l === 'undefined') var l=0;
      var level=l;
      var out="";
      if (Object.prototype.toString.call(obj) === '[object Array]') {
          var i = 0, len = obj.length;
          for ( ; i < len; i++ ) { //for each thang in the array

              out += '\n'; //draw a new line             
              out += drawIndent(level, 'array'); //draw the indent


            out += walkToYaml(obj[i], level+1, 'array'); //draw the inner thang
          }
          return out;
      }
      if (typeof obj === 'object') {
          //if (enableLinks ){
          //  var match= history(obj);
          //}
          var i, index=0;

          //preprocess the object to find the perfect indent
          var maxKeyLength=0;
          for ( i in obj ){
            maxKeyLength=Math.max(i.length, maxKeyLength);
          }
          if (opts.enableLinks){
            var ret=searchLink(obj);
            out += ret.text;
            if (ret.stop===true){
              return out;
            }
          }
          for ( i in obj ) {
            if (!obj.hasOwnProperty(i)) return out;
            //out+="level " + level +   ' index ' + index + ' before ' + before; 
            if (index===0 && before === "array" && opts.yamlCompatible){
              out += '\n'; //draw a new line             
              out += drawIndent(level, 'object');            
            }
            if (index!==0 || before!=="array"){  //if its the first object after an array don't draw newline nor draw an indent, else we use the arrays indentation
            //else {
              out += '\n'; //draw a new line             
              out += drawIndent(level, 'object');
            }
            //console.log("maxKeyLength ", maxKeyLength)
            var padding=maxKeyLength - i.length+2;       
            out += i+": "; //draw the attribute name with padding
            //out += drawIndent(padding);
            out += walkToYaml(obj[i], level+1, 'object') ; //draw the inner thang
            index++;
          }
          return out;
      }
      //if(typeof obj === 'string') return '"'+obj+'"'
      return obj;
  }

}


function drawIndent(level, thang){
  var indent="";  
  if(typeof thang== 'undefined'){ //level variable is a padding instead
    var pad=level;
    for (var j=0; j<pad; j++) {indent += " ";}//identation  
    return indent;    
  }
  //console.log("drawIndent ", level, thang)

  if (thang === "object"){
    for (var j=0; j<level; j++) {indent += "  ";}//identation  
  }else if (thang === "array"){
    for (var j=0; j<level; j++) {indent += "  ";}//identation with a -  
    indent +="- ";
  }
  return indent; 
}

// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.

function uniqueId(prefix) {
  var id = idCounter++;
  return prefix ? prefix + id : id;
}

function preProcessLinks(obj){
    var out = "";
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var i = 0, len = obj.length;
        for ( ; i < len; i++ ) { //for each thang in the array
          out += preProcessLinks(obj[i]); 
        }
        return out;
    }
    if (typeof obj === 'object') {
        history(obj);
        var i, index=0;
        for ( i in obj ) {
          out += preProcessLinks(obj[i]) ; //draw the inner thang
          index++;
        }
        return out;
    }
}

function searchLink(obj){
  var len= links.length;
  for (var j=0; j<len; j++) {
    var item=links[j];
    if(item.linkedTo===obj && typeof item.touched==='undefined'){
      //console.log('searchLink match item ', sys.inspect(item), obj);
      item.touched=true;
      var retVal={'text':'&'+item.linkedToId, 'stop':false}
      return retVal;
    }else if(item.linkedTo===obj && typeof item.touched!=='undefined'){
      var retVal={'text':'*'+item.linkedToId, 'stop':true}
      return retVal;  
    }
  }
  return {'text':"", 'stop':false}
}
function history(obj){

  //search the history
  var match = null;
  for (key in objh){
    var value=objh[key];
    if(obj==value){
      //console.log('match item ' , key, sys.inspect(value), obj);
      links.push({'object': obj, 'linkedTo':value, 'linkedToId':key});
    }
  } 
  if (match==null){
    //create a new history object
    var uId=uniqueId('object');
    objh[uId]=obj;
    obj=uId;
    match={'uId':uId, 'first':true}
  }//return object itsself
  
  return match; 
}


/**
 * YAML grammar tokens. 
 */

var tokens = [
  ['comment', '\n'],
  ['indent', ' '],
  ['doc', "---"]
]


helper={
  // Extend a given object with all the properties in passed-in object(s).
  extend: function(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  }
}

