YAML=require('./jsonToYaml');

var link={'subsub':"x"};

console.log('------------OO Style-------------');
//OO Style
yaml_text = ([{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}]).toYaml();
console.log (yaml_text);
console.log('\n\n------------functional Style-------------');
//functional Style
yaml_text = YAML.toYaml([{'anObject':{'asubObj':link}}, {x:"abc", y:{x: link, y:[{as:"sff", f:34},{as:"sfdf", f:35},{as:"sasff", f:37}]}},{f:link}]);
console.log (yaml_text);