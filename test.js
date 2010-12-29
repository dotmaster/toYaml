YAML=require('./jsonToYaml');

var link={'subsub':"x"};
//var testObj=[{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}];
var testObj= { greg: { name: 'greg', tel: 123 }};
var testCases=[
  {
  desc:"hash in hash",
  obj:{ greg: { name: 'greg', tel: 123}}
  },
  {
  desc:"a complex Object containing links",
  obj:[{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}]
  }
]

testCases.add = function(desc, obj){
  testCases.push({'desc':desc, 'obj':obj});
}
testCases.add('list in list', [[1,2,3,[4,5]]]);
testCases.add('a simple string', "hello greg");

console.log('------------OO Style-------------');
//OO Style
var yaml_text = testObj.toYaml();
console.log (yaml_text);
console.log('\n\n------------functional Style-------------');
//functional Style
yaml_text = YAML.toYaml(testObj);
console.log (yaml_text);

console.log('\n\n------------functional Style with enableLinks: false-------------');
yaml_text = YAML.toYaml(testObj, {enableLinks:false});
console.log (yaml_text);
//encode back to JSON (please npm install yaml to do this or git update --init --recursive submodules)
YAMLDecode=require('./support/yaml/lib/yaml');_=require('./support/underscore/underscore');
for (var i=0; i<testCases.length;i++){
  var testCase=testCases[i];
  var yaml=YAML.toYaml(testCase.obj);
  var json=YAMLDecode.eval(yaml);
  if (!_.isEqual(json, testCase.obj)) throw new Error('Test didn\'t pass: '+ testCase.desc);
  else console.log('Test "'+ testCase.desc + '" PASS'+ '\n'
  +'------------------------------------------------------\n'
  +yaml);
}
console.log('all tests passed');
/*var json=YAMLDecode.eval(yaml_text);
console.log(json)
//deep test fo equal using _
_=require('./support/underscore/underscore');
console.log(_.isEqual(json, testObj));*/