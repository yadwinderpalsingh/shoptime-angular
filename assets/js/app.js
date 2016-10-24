'use strict';

// my app module
var MyApp = angular.module('shoptimeApp', []).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    
    when('/', {
        templateUrl: 'home/',
        controller: MyController
    })
    .when('/home', {
        templateUrl: 'home/',
        controller: MyController
    })
    .when('/men', {
        templateUrl: 'men/',
        controller: MyController
    })
    .when('/women', {
        templateUrl: 'women',
        controller: MyController
    })
    .when('/kids', {
        templateUrl: 'kids',
        controller: MyController
    })
    .when('/cart', {
        templateUrl: 'cart',
        controller: MyController
    })
    .when('/order', {
        templateUrl: 'order',
        controller: MyController
    })
    .when('/checkout', {
        templateUrl: 'checkout',
        controller: MyController
    });
}]);

MyApp.factory("MyService", function () {
    // create store
    var myStore = new store();
    // create shopping cart
    var myCart = new shoppingCart("shoptimeApp");
    
    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});