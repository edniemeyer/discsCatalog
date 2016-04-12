var app = angular.module('discsCatalog', ['ui.router']);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';
}]);


//configuring state for ui-router
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise('/home');
}]);