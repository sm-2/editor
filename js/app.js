(function () {
    
    'use script';

    function isLogedIn(localStorageService) {
        var token = localStorageService.get("token");
        if(!token) throw new Error('401');
    }

    angular.module('esportscalendar', ['ui.bootstrap.datetimepicker', 'ui.router', 'LocalStorageModule', 'ngTable','angularFileUpload'])
        .constant('API', {'base' : 'https://api-esports.herokuapp.com'}) //
        //.constant('API', {'base' : 'http://localhost:8080'}) //
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
                    'name' : 'matchNew',
                    'url' : '/match',
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
                    'name' : 'teamNew',
                    'url' : '/team',
                    'templateUrl' : 'partials/team.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'roster',
                    'url' : '/roster/:{Players:json}/:teamId',
                    'templateUrl' : 'partials/roster.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'socials',
                    'url' : '/socials/:id',
                    'templateUrl' : 'partials/socials.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'player',
                    'url' : '/player',
                    'templateUrl' : 'partials/player.html',
                    'params': {
                        Player: null
                    },
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'playerNew',
                    'url' : '/player/:TeamId',
                    'templateUrl' : 'partials/player.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'redsocial',
                    'url' : '/social',
                    'templateUrl' : 'partials/social.html',
                    'params': {
                        social: null
                    },
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'newredsocial',
                    'url' : '/social/:TeamId',
                    'templateUrl' : 'partials/social.html',
                    'resolve': {
                        'validate': isLogedIn
                    }
                })
                .state({
                    'name' : 'login',
                    'url' : '/login',
                    'templateUrl' : 'partials/login.html'
                })
	            .state({
		            'name' : 'logout',
		            'url' : '/logout',
		            'resolve': {
			            'validate': function () {

			            }
		            }
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

            };

            ctrl.logout = function () {
	            localStorageService.remove('token');
	            $state.go('login');
            };

        })
        .controller('ListarPartidosController', function ($http,$state, API, NgTableParams) {

            var ctrl = this;

            ctrl.matches = [];

            ctrl.competitions = [{id: "1", title: "SHL#1"}, {id: '2', title: 'SHL#2'}];

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
            ctrl.newMatch = function(id) {
                $state.go('matchNew');
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
        .controller('EditorEquiposController', function ($stateParams,$http, $state, API,FileUploader) {

            var ctrl = this;

            ctrl.crearEditar = $stateParams.id;


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

            ctrl.editRoster = function (Players,teamId) {
                $state.go('roster',{'Players':Players,
                                    'teamId':teamId});
            };

            ctrl.editSocials = function (id) {
                $state.go('socials',{'id':id});
            };

        })
        .controller('ListarEquiposController', function ($http,$state, API, NgTableParams,$filter, $q,$scope) {

            var ctrl = this;

            ctrl.teams = [];


            ctrl.competitions = [{id: "1", title: "SHL#1"}, {id: '2', title: 'SHL#2'},{id: '3', title: 'TheFirst'}];


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

            ctrl.newTeam = function() {
                $state.go('teamNew');
            }


        })
        .controller('ListarRosterController', function ($http,$state, API, NgTableParams,$stateParams) {

            var ctrl = this;

            ctrl.roster = $stateParams.Players;

            ctrl.teamId = $stateParams.teamId;

            ctrl.tableParams = new NgTableParams({}, { "dataset" : ctrl.roster });

            ctrl.newPlayer = function(teamId) {
                $state.go('playerNew',{'TeamId':teamId});
            }

            ctrl.editPlayer = function (Player) {
                $state.go('player',{'Player':Player});
            }

            ctrl.deletePlayer = function (player) {
                $http({
                    method: 'DELETE',
                    url: API.base + '/player/'+player.id
                }).then(function successCallback(response) {
                    $state.go('team',{'id': ctrl.teamId});
                }, function errorCallback(response) {
                    console.log("error borrar jugador")
                });
            }

        })
        .controller('ListarSocialsController', function ($http,$state, API, NgTableParams,$stateParams) {

            var ctrl = this;

            if($stateParams.id){
                $http({
                    method: 'GET',
                    url: API.base + '/team/'+$stateParams.id
                }).then(function successCallback(response) {
                    ctrl.team = response.data;
                    ctrl.tableParams = new NgTableParams({}, { "dataset" : ctrl.team.Socials });
                    ctrl.teamId = ctrl.team.id;

                }, function errorCallback(response) {
                    console.log("error redes sociales")
                });
            }

            ctrl.newSocial = function(TeamId) {
                $state.go('newredsocial',{'TeamId':TeamId});
            }

            ctrl.editSocial = function (Social) {
                $state.go('redsocial',{'social':Social});
            }

            ctrl.deleteSocial = function (social) {
                $http({
                    method: 'DELETE',
                    url: API.base + '/social/'+social.id
                }).then(function successCallback(response) {
                    $state.go('team',{'id': ctrl.teamId});
                }, function errorCallback(response) {
                    console.log("error redes sociales")
                });
            }

        })
        .controller('EditorPlayerController', function ($stateParams,$http, $state, API) {

            var ctrl = this;

            ctrl.player = $stateParams.Player;

            ctrl.teamId = $stateParams.TeamId;

            ctrl.save = function () {

                var method = 'POST',
                    url = API.base + '/player';

                //si existe el partido, lo actulizamos
                if($stateParams.Player){
                    method = 'PUT';
                    url = API.base + '/player/'+ ctrl.player.id;

                }else {
                    ctrl.player.TeamId = ctrl.teamId;
                }

                $http({
                    method: method,
                    url: url,
                    data : ctrl.player
                }).then(function successCallback(response) {
                    $state.go('team',{'id': ctrl.player.TeamId});
                    ctrl.player = response.data;
                }, function errorCallback(response) {
                    console.log("error" + response);
                });
            }


        })
        .controller('EditorSocialController', function ($stateParams,$http, $state, API) {

        var ctrl = this;

        ctrl.social = $stateParams.social;
        ctrl.teamId = $stateParams.TeamId;

        ctrl.save = function () {

            var method = 'POST',
                url = API.base + '/social';

            //si existe el partido, lo actulizamos
            if($stateParams.social){
                method = 'PUT';
                url = API.base + '/social/'+ ctrl.social.id;
            }else{
                ctrl.social.TeamId = ctrl.teamId;
            }

            $http({
                method: method,
                url: url,
                data : ctrl.social
            }).then(function successCallback(response) {
                $state.go('team',{'id': ctrl.social.TeamId});
                ctrl.social = response.data;
            }, function errorCallback(response) {
                console.log("error" + response.data);
            });
        }


    })
    .filter('adaptCompetition', function() {
        return function(input, liga) {

            var array = ['SHL,TheFirst']
            var out;
            if(input == 1 || input ==2)
               out = 'SHL#'+input;
            if(input == 3)
                out = 'TheFirst';
            return out;
        };
    });


    

})();
