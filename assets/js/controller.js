'use strict';

function MyController($scope, $routeParams, MyService) {

    // get store and cart from service
    $scope.store = MyService.store;
    $scope.cart = MyService.cart;
    
    $scope.submitUserForm = function() {
        // check to make sure the form is completely valid
        if ($scope.checkoutForm.$valid) {
            
            MyService.cart.saveUser($scope.cart.user);  
            
            window.location.href = 'index.html#/checkout';
        }
    };
}
