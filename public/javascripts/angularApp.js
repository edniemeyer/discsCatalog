var app = angular.module('discsCatalog', ['ui.router', 'ngAnimate', 'toastr']);

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
            })
            .state('discs', {
                url: '/discs',
                templateUrl: 'partials/discs.html',
                controller: 'MainCtrl',
                resolve: {
                    discPromise: ['discs', function(discs) {
                        return discs.getAll();
                    }]
                }
            })
            .state('create', {
                url: '/create',
                templateUrl: 'partials/create.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('/home');
    }]);

app.factory('discs', ['$http', function($http) {
    var o = {
        discs: []
    };

    o.getAll = function() {
        return $http.get('/discs').success(function(data) {
            angular.copy(data, o.discs);
        });
    };

    o.create = function(disc) {
        return $http.post('/discs', disc).success(function(data) {
            o.discs.push(data);
        });
    };

    o.search = function(query) {
        return $http.post('/search', query).success(function(res) {
            return res.data;
        });
    };

    return o;
}]);

app.controller('DiscsCtrl', [
    '$scope',
    'discs',
    'disc',
    function($scope, discs, disc) {

        $scope.disc = disc;

    }]);


app.controller('MainCtrl', [
    '$scope', 'discs', 'toastr',
    function($scope, discs, toastr) {

        $scope.discs = discs.discs;

        $scope.songs = [];
        $scope.successTextAlert = "Disc added!";
        $scope.showSongs = false;

        $scope.addDisc = function() {
            if (!$scope.title || $scope.title === '') { toastr.warning('You should add a title!'); return; }
            if (!$scope.band || $scope.band === '') { toastr.warning('You should add a band!'); return; }
            discs.create({
                band: $scope.band,
                title: $scope.title,
                songs: $scope.songs,
                description: $scope.description,
            }).success(function() {
                $scope.showSuccessAlert = true;
            });
            $scope.title = '';
            $scope.band = '';
            $scope.description = '';
            $scope.songs = [];
        };

        // switch flag
        $scope.switchBool = function(value) {
            $scope[value] = !$scope[value];
        };

        $scope.addSong = function() {
            if (!$scope.song || $scope.song === '') { return; }

            toastr.clear();

            $scope.songs.push($scope.song)

            $scope.song = '';

            toastr.success('Song added!');
        };

        $scope.search = function() {
            if (!$scope.query || $scope.query === '') { return; }
            discs.search($scope.query)
                .success(function(results) {
                    $scope.results.push(results);
                });
            $scope.query = '';
        };



    }]);
