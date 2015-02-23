/*globals angular*/

"use strict";

/* Filters */

angular.module("guiachilenaApp.filters", [ ]).
    filter("interpolate", [ "version",
        function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        } ]).
    filter("changeMapIcon", function(){
       return function(input){
          var output = input.replace("_", "-");
          return output; 
       }
    });
