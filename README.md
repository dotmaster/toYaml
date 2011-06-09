# toYaml - A json to yaml serializer  #

toYaml is a very simple and superfast JSON to YAML serializer - encoder - dumper - whatever you like ;)  
NEW: from 1.0.0 you can use toYAML directly from the command line

## Features and Support ##

Javascript Objects and Arrays are supported by extending Object.prototype and Array.prototype.
Right now toYaml features cicular dependency resolution and relational links.


## YAML Spec ##

right now it doen't support the spec completely. It just works for my use case ;) But feel free to pull it and extend it to become a full YAML serializer.

## Technology ##

toYaml substantially is a deep copier! It works in a two pass process! First it does some preprocessing, where it searches for linked objects and enumerates them in the hashes linkHashIn (the links under the key references), and linkHashOut (the referenced object under the key of the linking object). It thereby also creates an enumerated new Object which it passes to the YAML parser. The enumerated object contains each object under the key 'obj' and a unique id for reference under the key "id". The second stage is a pass over the newly constructed Object and outputs the objects with proper indentation and references.

## Usage from Command line ##

Usage is simple:

    npm install toYaml
    
then from the command line 

a) File mode (pass in a well formatted JSON file! check the [Online JSON parser](http://json.parser.online.fr/)  for well formatted JSON)   

    toYaml filename.js [-o outputname](@see --help to get more options)   
      
b) HERDOC or pipe mode (like cat file >> toYaml or toYAM << HEREDOC>>)  will outpu to STDOUT       
  
    toYaml <<HEREDOC
    {"hello":"world"}
    HEREDOC

c) pass JSON directly as first command line argument only single line (for multiline usse b))
    toYaml '{"hello":"world"}'                    
    
## Usage as a module##

Usage is simple:

    npm install toYaml

    YAML=require ('toYaml');

    Then you can use it in an OO fashion style:
    calling YAML.extendObjects(true);
    {'YAML': {'aint':{'markup': 'language'}}}.toYaml();

    ot if you orefer the functional style:
    YAML.toYaml({'YAML': {'aint':{'markup': 'language'}}});

## Test cases ##

call node test.js to run the tests 
or call toYaml yamayam.js to transform it into a yaml file 
 
## Options ##
* you can enable links creation by passing {enableLinks:true} to toYaml({'enableLinks':true})
Default is on; But some serializers might not understand it, so you can turn it off, by passing false;
* if you need to reencode with yaml from TJ Holowaychuk you can use the option {yamlCompatible:true} to make the output look even more human readable on lists, default is false and will fail to reencode into JSON

* there is a security mechanism for circularity which defaults to a depth level of 50 iterations. If you want to set deeper limits set maxLevel to the depth you need.

* usePadding: uses a look ahead algorithm to see which is the longest hashtag in a group and pads out the others to match the maximum length  

* setDefaults: set default options to be used by all calls to YAML: e.g. YAML.setDefaults({YAMLCompatible:true});

## Exported functions ##

- toYaml(obj, opts) or obj.toYaml(opts) ... the YAML serializer
- setDefaults(defaults) ... a function for setting the default options

//mainly for testing purpose, returns the output of preprocessing links
- preProcessLinks (obj, opts) or obj.preProcessLinks(opts)

## Dependencies ##

optimist

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