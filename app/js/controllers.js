/*globals angular*/
"use strict";


angular.module("lookAroundApp.controllers", [ ])
    
    /**
     * [ZipCodeFrmCtrl]
     * Responsible for updating the route whenever zipcode is changed
     * appears in the first page,  and the header
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $location
     * @param  {[type]} $routeParams
     * @return {[type]}
     */
    .controller("ZipCodeFrmCtrl",
        ["$scope", "$location", "$routeParams", 
        function ($scope, $location, $routeParams){

        var placeurl = $routeParams.place || "atm";


        $scope.sendZip = function (zipcode) {
            var queryLugar = zipcode.comunas.nombre + ", " + zipcode.regiones.nombre;
            $location.path("/search/" + queryLugar + "/" + placeurl);
        };

        $scope.buscaLugar = function (regionChile) {
            var queryLugar = regionChile.comunas.nombre + ", " + regionChile.regiones.nombre;
            $location.path("/search/" + queryLugar + "/" + placeurl);  
        };


    }])

    /**
     * [SearchCtrl]
     * This controller is responsible for the main search in the view
     * 
     * - It first gets the zip code from the route params and check for the place data
     * - default place type is 'atm'
     * - it then gets the map latitude and longitude from the zipcode ( using Google GeoCoder )
     * - using the places Api, it will fetch the data for the given place type ( 'atm|bar|bus-station' ..etc)
     * - and renders the map using this data
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} googleMap
     * @param  {[type]} $http
     * @param  {[type]} $filter
     * @return {[type]}
     */
    .controller("SearchCtrl",
        ["$scope", "$routeParams", "$location", "googleMap", "$http", "$filter",
        function ($scope, $routeParams, $location, googleMap, $http, $filter) {
        
        $scope.zipCode = $routeParams.zipcode;
        $scope.place = $routeParams.place;
        
        var seleccion = $scope.zipCode.split(",");
        var comunaSelected = seleccion[0];
        var regionSelected = seleccion[1].substring(1);


        //fucking loop.... para rescatar el index selected - región + comuna
        for(var i=0;i<15;i++){
            if($scope.regiones[i].nombre == regionSelected){
                $scope.indexRegion = i;
                for(var k=0;k<$scope.regiones[i].comunas.length; k++){
                    if($scope.regiones[i].comunas[k].nombre == comunaSelected){
                        $scope.indexComuna = k;
                    }
                }
            }
        }

        

        /* redirect to the home page if there's no zipcode */
        if (!$scope.zipCode) {
            $location.path("/");
        }

        /* 
        Gets the default place types
        @TODO: this should go to a resolve object
        */
       // $http.get("data/places.json").success(function (results) {
       //     $scope.places = results.data;
       // });
        

        /**
         * [getUrl get the url for different type of places ]
         * @param  {string} placeurl
         * @return {string}
         */
        $scope.getUrl = function (placeurl) {
            return "#/search/" + $scope.zipCode + placeurl;
        };
        
        /*
        Simple utility method to set the active class
         */
        $scope.activeClass = function (place) {
            return place.url.slice(1).toLowerCase() === $scope.place ? "active" : "";
        };
        
        /**
         * Method for finding out the place name for the search results
         * Used to show in the header
         * 
         * @param  {[type]} details
         * @return {[type]}
         */
        $scope.getLocation = function (details) {
            var location = ( details && details.geometry && details.geometry.location ),
                out = [ ];
            if (!location) {
                return "location not available";
            } else {
                angular.forEach(location, function (value, key) {
                    this.push($filter("number")(value, 4));
                }, out);
                return out.join(", ");
            }
        };

        if (!$scope.place) {
            /* select the default place type as 'atm' */
            $location.path($scope.getUrl("/atm").slice(1));
        } else {
            /* 
            start the Geocoding to get the latitude and longitude from the 
            zipcode proviced. This lat/long will be served to the places api to fetch the places details
            */
            //console.log("GEO CODE ------>");
            //console.log($scope.zipCode);
            googleMap.getGeoCoder().geocode({
                address: $scope.zipCode
            }, function (results, status) {
                
                //console.log("RESULTS -----> STATUS ----->");
                //console.log(results);
                //console.log(status);

                var lat = results[ 0 ].geometry.location.lat(),
                    lng = results[ 0 ].geometry.location.lng();

                /* $scope.$apply is required as this function will be executed inside the GeoCoder context */
                $scope.$apply(function () {
                    $scope.searchplace = results[ 0 ] && results[ 0 ].formatted_address;
                });
                //console.log("SCOPE SEARCHPLACE --->");
                //console.log($scope.searchplace);

                var arrayLugar = $scope.place.split(',');
                
                //console.log("ARRAY LUGAR ------->");
                //console.log(arrayLugar);

                /* Do a text search and find all the places for the given query ( place type ) */
               // googleMap.placeService.textSearch({
                googleMap.placeService.search({
                    /*query: $scope.place,
                    type: $scope.place, */
                    location: new googleMap._maps.LatLng(lat, lng),
                    radius: 3000,
                    types: arrayLugar
                }, function (data, status) {
                    console.log(data);
                    if(status == 'ZERO_RESULTS'){
                        console.log(" NO HAY RESULTADOSSSSSS ----> o.O!!! ");
                        console.log(data);
                        //$location.path("/");
                    }else{
                       
                    }
                    /*
                    Once getting the data, set it to the controller scope.
                    $scope.$apply is required because this function will be executed in the googleMap object scope
                    */
                    $scope.$apply(function () {
                        $scope.data = data;
                        //console.log(data);
                    });
                });
                $scope.elLugarCompleto = googleMap.elLugarCompleto;
                // console.log("-->");
                // console.log($scope.elLugarCompleto);
            });
        }


        $scope.initSlider = function () {

               $(function () {
                 // wait till load event fires so all resources are available
                   //$scope.$slider = $('.nav-controller').on('click', function(event){


                   $('nav#barra, .nav-controller').on('click', function(event) {
                       $('nav#barra').toggleClass('focus');
                   });


                   /*$('nav#barra, .nav-controller').on('mouseover', function(event) {
                       $('nav#barra').addClass('focus');
                   }).on('mouseout', function(event) {
                       $('nav#barra').removeClass('focus');
                   })*/

               });

              /* $scope.onSlide = function (e, ui) {
                  $scope.model = ui.value;
                  $scope.$digest();
               }; */
           };

           $scope.initSlider();


          
 

    }])
    
    /**
     * [ResultsTabCtrl]
     * Controller resposible for the map view and list view tabs.
     * 
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} googleMap
     * @param  {[type]} scrollToElem
     * @return {[type]}
     */
    .controller("ResultsTabCtrl",
        ["$scope", "$routeParams", "$location", "googleMap", "scrollToElem",
        function ($scope, $routeParams, $location, googleMap, scrollToElem) {
        $scope.tabs = {
            "map": false,
            "list": true
        };
        $scope.selectedMarker = 0;

        $scope.listView = function () {
            $scope.tabs = {
                "map": false,
                "list": true
            };
        };

        $scope.mapView = function () {
            $scope.tabs = {
                "map": true,
                "list": false
            };
        };

        $scope.selectFromList = function(num) {
            $scope.mapView();
            $scope.selectedMarker = num;
            // need to get better user experience
            googleMap.zoomToMarker(num);
            googleMap.bounceMarker(num);
        }

        /*
        Watches for any click inside the map markers, and switches to the list view.
        Also scroll down the details of the selected marker in the list.
         */
        $scope.$watch(function () {
            return googleMap.selectedMarkerIdx;
        }, function (newVal) {
            var fn = function () {
                $scope.selectedMarker = newVal;
                if (newVal !== null) {
                    $scope.listView();
                    // need to get better user experience
                    googleMap.zoomToMarker(newVal);
                    googleMap.bounceMarker(newVal);
                    scrollToElem.scrollTo("listItem" + newVal);
                }
            };
            fn();
        });
    }])
    
    /**
     * [MainCtrl]
     * @param  {[type]} $scope
     * @param  {[type]} $routeParams
     * @param  {[type]} $location
     * @param  {[type]} $window
     * @return {[type]}
     */
    .controller("MainCtrl",
        ["$scope", "$routeParams", "$location", "$window", "$http",
        function ($scope, $routeParams, $location, $window, $http) {

        // checks if the url contains any valid zipcode

        $scope.applied = function () {
            return !!$routeParams.zipcode;
        };
        
        // some Google analytics
        /*$scope.$on("$viewContentLoaded", function (event) {
            $window.ga("send", "pageview", {
                "page": $location.path()
            });
        }); */
    
       $http.get("data/chile.json").success(function (results) {
           $scope.regiones = results.regiones;
       });



       /* 
       Gets the default place types
       @TODO: this should go to a resolve object
       */
       $http.get("data/places.json").success(function (results) {
           $scope.places = results.data;
       });
       
        

    }])





