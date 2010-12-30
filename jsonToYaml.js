
var sys=require('sys');
var defaults={
  enableLinks:true, //default
  yamlCompatible:true, //default
  usePadding:true,
  extendObjects:false,
  maxLevel:1000,
  maxLevelMessage: function(){return 'Max Object Depth has been reached: maxLevel ' + this.maxLevel+ ' please set maxLevel to a higher level if your object is deeper than this level.'}
}
var opts={};

var objh={}, links=[], linkHashIn={}, linkHashOut={}, Path={};
var idCounter = 0;

//reset global objects not very beautiful should go in a closure
function resetGlobals(){
  opts={}, objh={}, links=[], linkHashIn={}, linkHashOut={}, Path={};
  idCounter = 0;
};

function extendObjects(bool){
  if(bool){
    Object.prototype.toYaml=OOToYaml;
    Array.prototype.toYaml=OOToYaml;
    opts.extendObjects=true;
  }else{
    delete Object.prototype.toYaml;
    delete Array.prototype.toYaml;  
    opts.extendObjects=false;      
  }


}

exports.extendObjects= extendObjects;
exports.toYaml= toYaml;
exports.preProcessLinks= preProcessLinks;
exports.resetGlobals=resetGlobals;

function OOToYaml(options){
  return toYaml(this, options);
}

function toYaml(obj, options){
  resetGlobals();
  helper.extend(opts, defaults, options); 
  try{var newObj =_preProcessLinks(obj);}catch(e){console.log(e);}
  //console.log('linkHashIn', sys.inspect(linkHashIn), 'linkHashOut', sys.inspect(linkHashOut,15));
  //console.log('*********preprocess\n', sys.inspect(newObj, false, 10));
  var header = "";
  var ret = walkToYaml(newObj);


 if(ret!=="")  return header+ret+"\n"
 else return ""

  function walkToYaml(obj, l, before) {
      if (typeof before === 'undefined') var before=""; 
      if (typeof l === 'undefined') var l=0;
      var level=l;
      var out="";
      if (Object.prototype.toString.call(obj.obj) === '[object Array]') {
          var i = 0, len = obj.obj.length;
          for ( ; i < len; i++ ) { //for each thang in the array
            out += '\n'; //draw a new line             
            out += drawIndent(level, 'array'); //draw the indent
            out += walkToYaml(obj.obj[i], level+1, 'array'); //draw the inner thang
          }
          return out;
      }
      if (typeof obj.obj === 'object') {
          var i, index=0;
          if (opts.usePadding) {
          //preprocess the object to find the perfect indent
            var maxKeyLength=0;
            for ( i in obj.obj ){
              if (!obj.obj.hasOwnProperty(i)) continue;
              maxKeyLength=Math.max(i.length, maxKeyLength);
            }
          }
          if (opts.enableLinks){
            var ret=searchLink(obj.id); //lookup the id of our object in the linksIn linksOut hashes
            out += ret.text;
            if (ret.stop===true){ //if it's a link node, we have to stop iteration here
              return out;
            }
          }
          for ( i in obj.obj ) {
            if (!obj.obj.hasOwnProperty(i)) return out;
            if (index===0 && !opts.yamlCompatible){//draw no indent if we don't need to be yaml compatible          
            }else{
              out += '\n'; //draw a new line             
              out += drawIndent(level, 'object');
            }
   
            out += i+": "; //draw the attribute name with padding
            if (opts.usePadding) {
              var padding=maxKeyLength - i.length; 
              out += drawIndent(padding);
            }            
            out += walkToYaml(obj.obj[i], level+1, 'object') ; //draw the inner thang
            index++;
          }
          //console.log('obj level ', level, 'out ', out);          
          return out;
      }
      //if(typeof obj === 'string') return '"'+obj+'"'
      return obj.obj;
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

function preProcessLinks(obj, options){
  resetGlobals();
  helper.extend(opts, defaults, options);
  return _preProcessLinks(obj);
}

function _preProcessLinks(obj, l){
    var level= (typeof l === 'undefined') ? 0:l;
    if (level>opts.maxLevel) throw new Error(opts.maxLevelMessage());//the maximum Depth of Iterations may not be exceeded
    var uId=history(obj); //history of onjects and keeps linksIn and links Out of each object
    var newObj={};
    newObj.id=uId    
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        newObj.obj=[];
        if (checkCircle(newObj)){return newObj;}//if the array is already in the path return empty array
        var i = 0, len = obj.length;
        //newObj.obj = [];
        for ( ; i < len; i++ ) { //for each thang in the array
          newObj.obj.push(_preProcessLinks(obj[i], level+1)); //copy on without change
        }
        removeFromCirclePath(newObj);        
        return newObj;
    }
    if (typeof obj === 'object') {
        newObj.obj={};
        if (checkCircle(newObj)){return newObj;}//if the object is already in the path return        
        var i, index=0;
        for ( i in obj ) {
          if (!obj.hasOwnProperty(i)) continue;

          newObj.obj[i]={};
          newObj.obj[i] = _preProcessLinks(obj[i], level+1) ; //draw the inner thang
          index++;
        }
        //pop the object from path before returning 
        removeFromCirclePath(newObj);
        return newObj;
    }
    newObj.obj=obj;
    return newObj;
}

function searchLink(id){
  if(typeof linkHashIn[id]!=='undefined') return {'text':'&'+id, 'stop':false};//a reference
  if(typeof linkHashOut[id]!=='undefined') return {'text':'*'+linkHashOut[id], 'stop':true};//a follower  
  return {'text':"", 'stop':false}
}

function checkCircle(obj){
  var linkRefId=linkHashOut[obj.id]; //the objectId References another object Id
  var id=(typeof linkRefId === 'undefined') ? obj.id : linkRefId;
  if (typeof Path === 'undefined') Path={};
  for (var key in Path){ //follow down the path
    if (!Path.hasOwnProperty(key)) continue;
    if (key===id){return true;}    
  }
  Path[obj.id]=true ; //"push" the Path
  return false;
}
function removeFromCirclePath(obj){
  delete Path[obj.id]; //"pop" the Path
  return obj;
}

function history(obj){
  var uId=uniqueId('object');//each object gets an id also if its linked
  
  //search the history

  for (var key in objh){
    var value=objh[key];
    if(obj==value){
      //console.log('match item ' , key, sys.inspect(value), obj);
      links.push({'object': obj, 'linkedTo':value, 'linkedToId':key});
      if(typeof linkHashIn[key]=='undefined') linkHashIn[key]=[];
      linkHashIn[key].push(uId); //this dock is for first obj link to all references //followers
      linkHashOut[uId]=key;//this dock is for new objects link to first object = the links
      break;
    }
  } 

  //create a new history object
  objh[uId]=obj;
  obj=uId;
  
  return uId; 
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


