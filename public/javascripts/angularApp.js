var app = angular.module('discsCatalog', ['ui.router', 'ngAnimate', 'toastr']);

//configuring state for ui-router
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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
                    discPromise: ['discs', function (discs) {
                        return discs.getAll();
                    }]
                }
            })
            .state('create', {
                url: '/create',
                templateUrl: 'partials/create.html',
                controller: 'MainCtrl'
            })
            .state('edit', {
                url: '/discs/{id}',
                templateUrl: 'partials/edit.html',
                controller: 'DiscsCtrl',
                resolve: {
                    disc: ['$stateParams', 'discs', function ($stateParams, discs) {
                        return discs.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('/home');
    }]);

// services
app.factory('discs', ['$http', function ($http) {
    var o = {
        discs: []
    };

    o.get = function (id) {
        return $http.get('/discs/' + id).then(function (res) {
            return res.data;
        });
    };

    o.getAll = function () {
        return $http.get('/discs').success(function (data) {
            angular.copy(data, o.discs);
        });
    };

    o.create = function (disc) {
        return $http.post('/discs', disc).success(function (data) {
            o.discs.push(data);
        });
    };

    o.edit = function (id, disc) {
        return $http.put('/discs/' + id, disc).success(function (data) {
            o.discs.push(data);
        });
    };

    o.delete = function (id) {
        return $http.delete('/discs/' + id);
    };

    o.search = function (query) {
        return $http.post('/search', query).success(function (res) {
            return res.hits;
        });
    };

    return o;
}]);

app.controller('DiscsCtrl', [
    '$scope',
    'discs',
    'disc',
    'toastr',
    function ($scope, discs, disc, toastr) {

        $scope.disc = disc;

        $scope.showSuccessAlert = false;

        $scope.title = disc.title;
        $scope.band = disc.band;
        $scope.description = disc.description;
        $scope.songs = disc.songs;

        $scope.editDisc = function () {
            if (!$scope.title || $scope.title === '') { toastr.warning('You should add a title!'); return; }
            if (!$scope.band || $scope.band === '') { toastr.warning('You should add a band!'); return; }
            discs.edit(disc._id, {
                band: $scope.band,
                title: $scope.title,
                songs: $scope.songs,
                description: $scope.description,
            }).success(function () {
                $scope.successTextAlert = "Disc edited!";
                $scope.showSuccessAlert = true;
                $scope.title = '';
                $scope.band = '';
                $scope.description = '';
                $scope.songs = [];
            });
        };

        // switch flag
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };

        $scope.addSong = function () {
            if (!$scope.song || $scope.song === '') { return; }

            toastr.clear();

            $scope.songs.push($scope.song)

            $scope.song = '';

            toastr.success('Song added!');
        };

    }]);


app.controller('MainCtrl', [
    '$scope', 'discs', 'toastr',
    function ($scope, discs, toastr) {

        $scope.discs = discs.discs;

        $scope.songs = [];
        $scope.successTextAlert = "Disc added!";
        $scope.showSongs = false;

        $scope.addDisc = function () {
            if (!$scope.title || $scope.title === '') { toastr.warning('You should add a title!'); return; }
            if (!$scope.band || $scope.band === '') { toastr.warning('You should add a band!'); return; }
            discs.create({
                band: $scope.band,
                title: $scope.title,
                songs: $scope.songs,
                description: $scope.description,
            }).success(function () {
                $scope.showSuccessAlert = true;
                $scope.title = '';
                $scope.band = '';
                $scope.description = '';
                $scope.songs = [];
            });
        };

        // switch flag
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };

        $scope.addSong = function () {
            if (!$scope.song || $scope.song === '') { return; }

            toastr.clear();

            $scope.songs.push($scope.song)

            $scope.song = '';

            toastr.success('Song added!');
        };

        $scope.deleteDisc = function (disc) {
            discs.delete(disc._id).success(function () {
                $scope.removeRow(disc._id);
                toastr.error("Disc deleted!");
            });
        };

        $scope.removeRow = function (id) {
            var index = -1;
            var comArr = eval($scope.discs);
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            $scope.discs.splice(index, 1);
        };


        $scope.showResults = false;

        $scope.search = function () {
            if (!$scope.query || $scope.query === '') { return; }
            discs.search({ query: $scope.query })
                .success(function (results) {
                    if (results.hits.hits.length > 0) {
                        $scope.showResults = true;
                        $scope.results = results.hits.hits;
                    }
                    else
                        toastr.info('No discs found for this query! Try again!')
                    
                    $scope.query = '';

                });

        };



    }]);
