
var sys=require('sys');

var enableLinks=true; //default
var objh={}, links=[];
var idCounter = 0;


Object.prototype.toYaml=OOToYaml;
Array.prototype.toYaml=OOToYaml;

exports.toYaml= toYaml;

var link={'subsub':"x"};
yaml_text = ([{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}]).toYaml();
console.log (yaml_text);

function OOToYaml(options){
  return toYaml(this, options);
}

function toYaml(obj, options){
  if (typeof options.enableLinks!==undefined)
    enableLinks=options.enableLinks;
  if (enableLinks) preProcessLinks(obj);
  console.log(links);
  return walkToYaml(obj);
}
function walkToYaml(obj, l, before) {
    if (typeof before === 'undefined') var before=""; 
    if (typeof l === 'undefined') var l=0;
    var out = "";
    var level=l;
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
        if (enableLinks){
          var ret=searchLink(obj);
          out += ret.text;
          if (ret.stop===true){
            return out;
          }
        }
        for ( i in obj ) {
          if (!obj.hasOwnProperty(i)) return out;
          //out+="level " + level +   ' index ' + index + ' before ' + before; 
          if (index!==0 || before!=="array"){  //if its the first object after an array don't draw newline nor draw an indent, else we use the arrays indentation
          //else {
            out += '\n'; //draw a new line             
            out += drawIndent(level, 'object');
          }
          //console.log("maxKeyLength ", maxKeyLength)
          var padding=maxKeyLength - i.length+2;       
          out += i+": "; //draw the attribute name with padding
          out += drawIndent(padding);
          out += walkToYaml(obj[i], level+1, 'object') ; //draw the inner thang
          index++;
        }
        return out;
    }
    return obj;
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
      console.log('searchLink match item ', sys.inspect(item), obj);
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
      console.log('match item ' , key, sys.inspect(value), obj);
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
