YAML=require('./toYaml');
_=require('./support/underscore/underscore');
var sys=require('sys');



preProcessLinks=YAML.preProcessLinks;

//a test for seeing if preprocessing works
var link=[{s:"hello"}];
var refactoredObj = preProcessLinks([{x:link},{y:7, link:link, assafdsf:link}]);

if((refactoredObj.obj[0].obj.x.obj[0].obj.s.obj)=="\'hello\'") 
  console.log("preProcessLinks new Object composition Test passed");
else 
  console.log("ERROR: preProcessLinks new Object composition Test did not pass"); 


//Test preprocessing on a circular object
var helper = {'test':{'threeway':{'circularity':'circularObject2'}}}
var circularObject1={'circ': { 'name': helper.test, 'id': 123 }}
var circularObject2={'someAttr': { 'attr': circularObject1.circ, 'id': 456 }}
helper.test.threeway.circularity=circularObject2;


try {
  var refactoredObj =  preProcessLinks(helper, {'maxLevel':50});
  if(refactoredObj.obj.test.obj.threeway.obj.circularity.obj.someAttr.obj.attr.obj.name.link=='object1') 
    console.log("preProcessLinks on circular Object Test passed\n");
  else throw new Error()
}catch (e){
   console.log("ERROR: preProcessLinks on circular Object did not pass\n". e); 
   return;
}

//console.log('*********preprocess\n', sys.inspect(refactoredObj, false, 15));

var link={'subsub':"x"};
var complexObj=[{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}];
var testObj= { greg: { name: 'greg', tel: 123 }};
//see the ouput of some objects Just visually


console.log('\n\n------------a circular object with enableLinks: true -------------');
yaml_text = YAML.toYaml(helper, {enableLinks:true});
console.log (yaml_text);
//testCases.add('a circular Object', circularObject1);
console.log('------------OO Style-------------');
//OO Style
YAML.extendObjects(true);
var yaml_text = testObj.toYaml();
YAML.extendObjects(false);
console.log (yaml_text);
console.log('\n\n------------functional Style-------------');
//functional Style
yaml_text = YAML.toYaml(testObj);
console.log (yaml_text);
//test enableLinks option
console.log('\n\n------------functional Style with enableLinks: true-------------');
yaml_text = YAML.toYaml(complexObj, {enableLinks:true});
console.log (yaml_text);
console.log('\n\n------------functional Style with enableLinks: false-------------');
yaml_text = YAML.toYaml(complexObj, {enableLinks:false});
console.log (yaml_text);
//encode back to JSON (please npm install yaml to do this or git update --init --recursive submodules)


var yaml=YAML.toYaml({});
if (YAML.toYaml({})==="") {
  console.log('Test "'+  "an empty object" + '" PASS'+ '\n'
  +'------------------------------------------------------\n'); 
}
else {
  throw new Error('Test didn\'t pass: '+ "an empty object"+ '\n'
  +'------------------------------------------------------\n');
}
  
if (YAML.toYaml([])==="") 
  console.log('Test "'+  "an empty array" + '" PASS'+ '\n'
  +'------------------------------------------------------\n'); 
else throw new Error('Test didn\'t pass: '+ "an empty object"+ '\n'
  +'------------------------------------------------------\n');

/*
 * Here is where the real tests begin 
 */
YAMLDecode=require('./support/yaml/lib/yaml');_=require('./support/underscore/underscore');
var testCases=[]
testCases.add = function(desc, obj){
  testCases.push({'desc':desc, 'obj':obj});
}
testCases.add('hash in hash', testObj);
testCases.add('a complex Object containing 2 links', [{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}]);
testCases.add('list in list', [[1,2,3,[4,5]]]);
testCases.add('a simple string', "hello greg");



console.log('\n ****RUNNING TESTS *****\n');
for (var i=0; i<testCases.length;i++){
  var testCase=testCases[i];
  var yaml=YAML.toYaml(testCase.obj, {enableLinks:false});
  var json=YAMLDecode.eval(yaml);
  if (!_.isEqual(json, testCase.obj)) throw new Error('Test didn\'t pass: '+ testCase.desc+ '\n'
  +'------------------------------------------------------\n'
  +yaml);
  else console.log('Test "'+ testCase.desc + '" PASS'+ '\n'
  +'------------------------------------------------------\n'
  +yaml);
}
console.log('all tests passed - Thank you for running tests');
/*var json=YAMLDecode.eval(yaml_text);
console.log(json)
//deep test fo equal using _
_=require('./support/underscore/underscore');
console.log(_.isEqual(json, testObj));*/