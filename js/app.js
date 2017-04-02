(function () {
    
    'use script';

    angular.module('esportscalendar', ['ui.bootstrap.datetimepicker', 'ui.router'])
        .config(['$compileProvider', '$stateProvider', '$urlRouterProvider', function ($compileProvider, $stateProvider,$urlRouterProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);

            $stateProvider
                .state({
                    'name' : 'competition',
                    'url' : '/competition',
                    'templateUrl' : 'partials/competition.html'
                })
                .state({
                    'name' : 'match',
                    'url' : '/match',
                    'templateUrl' : 'partials/match.html'
                })
                .state({
                    'name' : 'teams',
                    'url' : '/teams',
                    'templateUrl' : 'partials/teams.html'
                })
                .state({
                    'name' : 'team',
                    'url' : '/team/:id',
                    'templateUrl' : 'partials/team.html'
                });

            $urlRouterProvider.otherwise('/competition');

        }])
        .controller('EditorCompeticionController', function ($scope, $window) {

            var ctrl = this;

            ctrl.model = {};
            ctrl.generate = function() {

                var blob = new Blob([JSON.stringify(ctrl.model)], { type: 'text/json;charset=utf-8' }),
                    url = $window.URL || $window.webkitURL;

                $scope.fileUrl = url.createObjectURL(blob);

            }

        })
        .controller('EditorPartidosController', function ($scope, $window) {

            var ctrl = this;

            var original = {
                "teamA" : { "result" : 0 },
                "teamB" : { "result" : 0 }
            };

            ctrl.model = angular.copy(original);

            ctrl.list = [];

            ctrl.add = function () {

                ctrl.list.push(angular.copy(ctrl.model));
                ctrl.model = angular.copy(original);

            };

            ctrl.generate = function() {

                var blob = new Blob([JSON.stringify(ctrl.list)], { type: 'text/json;charset=utf-8' }),
                    url = $window.URL || $window.webkitURL;

                $scope.fileUrl = url.createObjectURL(blob);

            }

        })
        .controller('EditorEquiposController', function ($stateParams,$http) {

            var ctrl = this;

            $http({
                method: 'GET',
                url: 'https://api-esports.herokuapp.com/team/'+$stateParams.id
            }).then(function successCallback(response) {
                ctrl.team = response.data;
                console.log(ctrl.team)
            }, function errorCallback(response) {
                console.log("error listar equipo")
            });


        })
        .controller('ListarEquiposController', function ($http,$state) {

            var ctrl = this;

            ctrl.teams = [];

            $http({
                method: 'GET',
                url: 'https://api-esports.herokuapp.com/team'
            }).then(function successCallback(response) {
                ctrl.teams = response.data.data;
            }, function errorCallback(response) {
                console.log("error listar equipo")
            });

            ctrl.editTeam = function(id) {
                $state.go('team',{'id':id});
            }

        });


    

})();
