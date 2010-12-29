# jsonToYaml - A json to yaml serializer  #

yaml is a very simple and superfast JSON to YAML serializer - encoder - dumper - whatever you like ;)

## Features and Support ##

Javascript Objects and Arrays are supported by extending Object.prototype and Array.prototype.
Right now jsonToYaml features cicular dependency resolution and relational links.


## YAML Spec ##

right now it doen't support the spec completely. It just works for my use case ;) But feel free to pull it and extend it to become a full YAML serializer.



## Usage ##

Usage is simple:

npm install jsonToYaml

YAML=require ('jsonToYaml');

Then you can use it in an OO fashion style:
{'YAML': {'aint':{'markup': 'language'}}}.toYaml();

ot if you orefer the functional style:
YAML.toYaml({'YAML': {'aint':{'markup': 'language'}}});
 
## Options ##
* you can enable links creation by passing {enableLinks:true} to toYaml({'enableLinks':true})
Default is on; But some serializers might not understand it, so you can turn it off, by passing false;
* if you don't need to reencode with yaml from TJ you can use the option {yamlComapatible:false} to make the output look even more human readable on lists

## Dependencies ##

none

## Todos ##

* extend and test yaml 1.3 spec cases;)