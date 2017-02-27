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
                    'name' : 'team',
                    'url' : '/team',
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
        .controller('EditorEquiposController', function ($scope, $window) {

            var ctrl = this;

            var social = {
                "name" : "twitter",
                "url" : ""
            };

            var player = {
                "position" : "",
                "nick" : "",
                "name" : ""
            };

            var original = {
                "name":"",
                "descripcion":"",
                "social" : [
                    {
                        "name" : "twitter",
                        "url" : ""
                    }
                ],
                "player" : [
                    {
                        "position" : "",
                        "nick" : "",
                        "name" : ""
                    }
                ]
            };

            ctrl.model = angular.copy(original);

            ctrl.list = [];

            ctrl.addSocialNetwork = function () {
                ctrl.model.social.push(angular.copy(social));
            };

            ctrl.removeSocialNetwork = function (index) {
                ctrl.model.social.splice(index, 1);
            };

            ctrl.addPlayer = function () {
                ctrl.model.player.push(angular.copy(player));
            };

            ctrl.removePlayer = function (index) {
                ctrl.model.player.splice(index, 1);
            };

            ctrl.add = function () {

                ctrl.list.push(angular.copy(ctrl.model));
                ctrl.model = angular.copy(original);

            };

            ctrl.removeTeam = function (index) {
                ctrl.list.splice(index, 1);
            };

            ctrl.generate = function() {

                var blob = new Blob([JSON.stringify(ctrl.list)], { type: 'text/json;charset=utf-8' }),
                    url = $window.URL || $window.webkitURL;

                $scope.fileUrl = url.createObjectURL(blob);

            }

        });


    

})();
