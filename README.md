# jsonToYaml - A json to yaml serializer  #

jsonToYaml is a very simple and superfast JSON to YAML serializer - encoder - dumper - whatever you like ;)

## Features and Support ##

Javascript Objects and Arrays are supported by extending Object.prototype and Array.prototype.
Right now jsonToYaml features cicular dependency resolution and relational links.


## YAML Spec ##

right now it doen't support the spec completely. It just works for my use case ;) But feel free to pull it and extend it to become a full YAML serializer.

## Technology ##

jsonToYaml substantially is a deep copier! It works in a two pass process! First it does some preprocessing, where it searches for linked objects and enumerates them in the hashes linkHashIn (the links under the key references), and linkHashOut (the referenced object under the key of the linking object). It thereby also creates an enumerated new Object which it passes to the YAML parser. The enumerated object contains each object under the key 'obj' and a unique id for reference under the key "id". The second stage is a pass over the newly constructed Object and outputs the objects with proper indentation and references.

## Usage ##

Usage is simple:

npm install jsonToYaml

YAML=require ('jsonToYaml');

Then you can use it in an OO fashion style:
calling YAML.extendObjects(true);
{'YAML': {'aint':{'markup': 'language'}}}.toYaml();

ot if you orefer the functional style:
YAML.toYaml({'YAML': {'aint':{'markup': 'language'}}});

## Test cases ##

call node test.js to run the tests
 
## Options ##
* you can enable links creation by passing {enableLinks:true} to toYaml({'enableLinks':true})
Default is on; But some serializers might not understand it, so you can turn it off, by passing false;
* if you don't need to reencode with yaml from TJ Holowaychuk you can use the option {yamlCompatible:false} to make the output look even more human readable on lists, however it will fail to reencode into JSON

* there is a security mechanism for circularity which defaults to a depth level of 50 iterations. If you want to set deeper limits set maxLevel to the depth you need.

* usePadding: uses a look ahead algorithm to see which is the longest hashtag in a group and pads out the others to match the maximum length  

## Dependencies ##

none

## Todos ##

* extend and test yaml 1.3 spec cases;)
* make the second parsing phase even faster by just traversing over the history created in the first pass (including the indent level in the first pass and saving it under a key in the new Object)

# License 

(The MIT License)

Copyright (c) 2010 Gregor Schwab <isimpl@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.