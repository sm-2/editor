(function () {
    
    'use script';

    function isLogedIn(localStorageService) {
        var token = localStorageService.get("token");
        if(!token) throw new Error('401');
    }

    angular.module('esportscalendar', ['ui.bootstrap.datetimepicker', 'ui.router', 'LocalStorageModule', 'ngTable'])
        .constant('API', {'base' : 'https://api-esports.herokuapp.com'}) //
        .config(['$compileProvider', '$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider',
            function ($compileProvider, $stateProvider,$urlRouterProvider, localStorageServiceProvider) {

            localStorageServiceProvider.setPrefix('esportscalendar');

            $stateProvider
                .state({
                    'name' : 'matches',
                    'url' : '/matches',
                    'templateUrl' : 'partials/matches.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'match',
                    'url' : '/match/:id',
                    'templateUrl' : 'partials/match.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'teams',
                    'url' : '/teams',
                    'templateUrl' : 'partials/teams.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'team',
                    'url' : '/team/:id',
                    'templateUrl' : 'partials/team.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'login',
                    'url' : '/login',
                    'templateUrl' : 'partials/login.html'
                });

            $urlRouterProvider.otherwise('/matches');

        }])
        .run(['$http', 'localStorageService', '$rootScope', '$state', function ($http, localStorageService, $rootScope, $state) {

            $rootScope.$on('$stateChangeError', onStateChangeError);

            function onStateChangeError(event, toState, toParams, fromState, fromParams, error) {
                if (error.message === '401') {
                    return $state.go('login');
                }
            }

            var token = localStorageService.get('token');
            if (token) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + token;
            }


        }])
        .controller('LoginController', function ($http, localStorageService, $state, API) {

            var ctrl = this;

            ctrl.login = function () {

                ctrl.msg = null;
                $http.post(API.base + '/auth', {"email" : ctrl.email, "password" : ctrl.password})
                    .then(function (res) {
                            localStorageService.set('token', res.data.data);
                            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.data;
                            $state.go('matches');
                        },
                        function (error) {
                            ctrl.msg = error.data.error;
                        });

            }

        })
        .controller('ListarPartidosController', function ($http,$state, API, NgTableParams) {

            var ctrl = this;

            ctrl.matches = [];

            $http({
                method: 'GET',
                url: API.base + '/match'
            }).then(function successCallback(response) {
                ctrl.matches = response.data.data;
                ctrl.tableParams = new NgTableParams({ "sorting": { start_date : "asc" }}, { "dataset" : ctrl.matches });
            }, function errorCallback(response) {
                console.log("error" + response);
            });

            ctrl.editMatch = function(id) {
                $state.go('match',{'id':id});
            }

        })
        .controller('EditorPartidosController', function ($stateParams, $http, API, $state) {

            var ctrl = this;

            $http({
                method: 'GET',
                url: API.base + '/team'
            }).then(function successCallback(response) {
                ctrl.teams = response.data.data;
            }, function errorCallback(response) {
                console.log("error" + response);
            });

            $http({
                method: 'GET',
                url: API.base + '/competitionGame'
            }).then(function successCallback(response) {
                ctrl.competitionsGames = response.data.data;
            }, function errorCallback(response) {
                console.log("error" + response);
            });

            if($stateParams.id){
                $http({
                    method: 'GET',
                    url: API.base + '/match/'+$stateParams.id
                }).then(function successCallback(response) {
                    ctrl.match = response.data.data;
                    ctrl.match.team_a = ctrl.match.teamAId+"";
                    ctrl.match.team_b = ctrl.match.teamBId+"";
                    ctrl.match.CompetitionGameId = ctrl.match.CompetitionGameId+"";
                }, function errorCallback(response) {
                    console.log("error" + response);
                });
            }

            ctrl.save = function () {

                var method = 'POST',
                    url = API.base + '/match';

                //si existe el partido, lo actulizamos
                if($stateParams.id){
                    method = 'PUT';
                    url = API.base + '/match/'+$stateParams.id;
                }

                $http({
                    method: method,
                    url: url,
                    data : ctrl.match
                }).then(function successCallback(response) {
                    $state.go('matches');
                    ctrl.match = response.data;
                }, function errorCallback(response) {
                    console.log("error" + response);
                });
            }




        })
        .controller('EditorEquiposController', function ($stateParams,$http, $state, API) {

            var ctrl = this;

            $http({
                method: 'GET',
                url: API.base + '/competitionGame'
            }).then(function successCallback(response) {
                ctrl.competitionsGames = response.data.data;
            }, function errorCallback(response) {
                console.log("error" + response);
            });

            if($stateParams.id){
                $http({
                    method: 'GET',
                    url: API.base + '/team/'+$stateParams.id
                }).then(function successCallback(response) {
                    ctrl.team = response.data;
                    ctrl.team.CompetitionGameId = ctrl.team.CompetitionGameId+"";
                }, function errorCallback(response) {
                    console.log("error listar equipo")
                });
            }

            ctrl.save = function () {

                var method = 'POST',
                    url = API.base + '/team';

                //si existe el partido, lo actulizamos
                if($stateParams.id){
                    method = 'PUT';
                    url = API.base + '/team/'+$stateParams.id;
                }

                $http({
                    method: method,
                    url: url,
                    data : ctrl.team
                }).then(function successCallback(response) {
                    $state.go('teams');
                    ctrl.team = response.data;
                }, function errorCallback(response) {
                    console.log("error" + response);
                });
            }


        })
        .controller('ListarEquiposController', function ($http,$state, API, NgTableParams) {

            var ctrl = this;

            ctrl.teams = [];

            $http({
                method: 'GET',
                url: API.base + '/team'
            }).then(function successCallback(response) {
                ctrl.teams = response.data.data;
                ctrl.tableParams = new NgTableParams({}, { "dataset" : ctrl.teams });
            }, function errorCallback(response) {
                console.log("error" + response);
            });

            ctrl.editTeam = function(id) {
                $state.go('team',{'id':id});
            }

        });


    

})();
