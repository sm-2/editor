(function () {
    
    'use script';

    angular.module('esportscalendar', ['ui.bootstrap.datetimepicker'])
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
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
