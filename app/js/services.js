/*globals angular, google*/

"use strict";

/* Services */

angular.module("guiachilenaApp.services", [ ])

    .factory("googleMap", function ($rootScope) {
        var factory = {};

        factory._maps = google.maps;
        factory.markers = [ ];
        factory.selectedMarkerIdx = null;
        factory.icons = {};
        factory.iconNameTmpl = 'img/markers/number_{0}.png';
        factory.mapWidth = 0;
		factory.mapWidth = 0;
        factory.buscaLaReferencia = function(){},
        factory.lugarSeleccionadoPorClick = '';
        factory.elLugarCompleto = {};
        


        factory.buscaLaReferencia = function(referencia){
            /* DETALLE DE LUGAR */ 
            this.placeService.getDetails({
                reference: this.lugarSeleccionadoPorClick
            }, function (data, status) {
                //console.log("ESTATUS DE LA REFERENCIA DE LUGAR ------>");
                //console.log(status);
              //  console.log("ESTA ES LA DATAAAAAAAA ------>");
              //  console.log(data);
                factory.elLugarCompleto = data;
            });
        }


        /**
         * Initialise the map
         * 
         * @param  {[type]} elem - html element
         * @param  {[type]} options
         * @return {object} - map instance
         */
        factory.initializeMap = function (elem, options) {
            options = options || {
                zoom: 14,
                center: new google.maps.LatLng(21.508742, -0.120850),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
               
               /* zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                panControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },*/

                scrollwheel: false,
                styles: [{featureType:'water',elementType:'all',stylers:[{hue:'#d7ebef'},{saturation:-5},{lightness:54},{visibility:'on'}]},{featureType:'landscape',elementType:'all',stylers:[{hue:'#eceae6'},{saturation:-49},{lightness:22},{visibility:'on'}]},{featureType:'poi.park',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'poi.medical',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-80},{lightness:-2},{visibility:'on'}]},{featureType:'poi.school',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-91},{lightness:-7},{visibility:'on'}]},{featureType:'landscape.natural',elementType:'all',stylers:[{hue:'#c8c6c3'},{saturation:-71},{lightness:-18},{visibility:'on'}]},{featureType:'road.highway',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:60},{visibility:'on'}]},{featureType:'poi',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-81},{lightness:34},{visibility:'on'}]},{featureType:'road.arterial',elementType:'all',stylers:[{hue:'#dddbd7'},{saturation:-92},{lightness:37},{visibility:'on'}]},{featureType:'transit',elementType:'geometry',stylers:[{hue:'#c8c6c3'},{saturation:4},{lightness:10},{visibility:'on'}]}]

            };
            if (this.map) {
                delete this.map;
                this.selectedMarkerIdx = null;
            }
            var map = this.map = new google.maps.Map(elem, options);
            // cw: This will fire off several times. We only want the time when we actually have data.
            if (elem.clientWidth > 0) {
                this.mapWidth = elem.clientWidth;
            }
            return map;
        };
        
        /**
         * [getGeoCoder - gets a new geoCoder object]
         * @return {[type]}
         */
        factory.getGeoCoder = function () {
            return new google.maps.Geocoder();
        };

        /**
         * [initPlacesService - initialise the place service on a given map object]
         * @param  {object} map
         * @return {object}
         */
        factory.initPlacesService = function (map) {
            this.placeService = new google.maps.places.PlacesService(map);
            return this.placeService;
        };

        /**
         * [getIcon - Return the icon object used by google.maps.Marker calls]
         * @param  {integer} num
         * @return {object}
         */
        factory.getIcon = function(num) {
            var i = this.icons['m' + num];
            if (typeof i === 'undefined' || i === null) {
                i = this.icons['m' + num] = {
                    url: factory.iconNameTmpl.format(num)
                };
            }
            return i;
        };

        /**
         * [placeMarkers description]
         * @param  {array} data
         * @return {void}
         */
        factory.placeMarkers = function (data) {

            this.clearAllMarkers();
            var me = this,
                bounds = new google.maps.LatLngBounds();
            var count = 1;
            angular.forEach(data, function (item, key) {
                var latLng = new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng()),
                    currentMarker;    

                var tipoLugar = item.types[0].replace('_','-');
                //console.log(tipoLugar);

                me.markers.push(currentMarker =  new Marker({
                    map: me.map,
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    //icon: me.getIcon(count++)
                    icon: {
                        path: MAP_PIN,
                        fillColor: '#0E77E9',
                        fillOpacity: 1,
                        strokeColor: '',
                        strokeWeight: 0,
                        scale: 1/4
                    },
                    label: '<i class="map-icon-' + tipoLugar + '"></i>'
                }));
                bounds.extend(latLng);
                google.maps.event.addListener(currentMarker, "click", function () {
                    
                    me.selectedMarkerIdx = key;
                    
                    factory.lugarSeleccionadoPorClick = data[key].reference;
                    
                    factory.buscaLaReferencia(factory.lugarSeleccionadoPorClick);

                    //console.log("kkkkk------>>>>");
                    //console.log(factory.lugarSeleccionadoPorClick);

                    //$('tr.lugarActivo').parent().prependTo("tbody#listLugares");
                    //insertBefore($("table tr:first"));


                    $('nav#barra').toggleClass('focus');

                    $rootScope.$apply();


                });
            });
            me.map.fitBounds(bounds);
        };

        /**
         * [clearAllMarkers - clear all markers in the map]
         * @return {void}
         */
        factory.clearAllMarkers = function () {
            angular.forEach(this.markers, function (item, key) {
                item.setMap(null);
            });
            this.markers = [ ];
        };

        /**
         * [zoomToMarker - zoom to a marker on the map]
         * @param  {integer} marker index
         * @return {void}
         */
        factory.zoomToMarker = function(idx) {
            // Zoom to marker with proper zoom based on bounds.
            var p = this.markers[idx].getPosition();
            // cw: Would like to pan & zoom to this, but V3 API doesn't make this possible.
            this.map.setCenter(p);
            // cw: Zoom level determined by hand. Should be a better way.
            
            this.map.setZoom(16);
            
            // cw: Alternative -- find closest marker, add both points to bounds and zoom to 
            // that to show context.
        };

        /**
         * [bounceMarker - use the bounce animation on the marker]
         * @param  {[type]} idx [index of the marker in markers array]
         * @return {[type]}     [void]
         */
        factory.bounceMarker = function(idx){
            var marker  = this.markers[idx];
            angular.forEach(this.markers, function (item, key) {
                item.setAnimation(null);
            });
            marker && marker.setAnimation(google.maps.Animation.BOUNCE);
        };

        return factory;
    })

    .factory("scrollToElem", function ($window, $timeout) {
        return {
            scrollTo: function (elemId) {

              var elem = document.getElementById(elemId);
                if (!elem) {
                    $window.scrollTo(0, 0);
                    return;
                }

                $timeout(function () {
                   // elem.scrollIntoView();
                    $('tr.lugarActivo').insertBefore($("table tr:first"));

                }, 100);

            }
        };
    });
