/*global angular*/

"use strict";

var guiachilenaApp = angular.module("guiachilenaApp", [
    "ngRoute",
    "guiachilenaApp.services",
    "guiachilenaApp.controllers",
    "guiachilenaApp.filters",
    "guiachilenaApp.directives"
]);


guiachilenaApp.config(['$routeProvider', function ($routeProvider) {

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