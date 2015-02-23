/*global angular*/

"use strict";

var lookAroundApp = angular.module("lookAroundApp", [
    "ngRoute",
    "lookAroundApp.services",
    "lookAroundApp.controllers",
    "lookAroundApp.filters",
    "lookAroundApp.directives"
    /*"ui.bootstrap"*/
]);


lookAroundApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when("/",
        {
            controller: "ZipCodeFrmCtrl",
            templateUrl: "partials/zipcode.html"
        })
        .when("/search/:zipcode/:place",
        {
            controller: "SearchCtrl",
            templateUrl: "partials/search.html"
        })
        .otherwise({ redirectTo: "/" });

}]);