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

            var original = {
                
            };

            ctrl.model = angular.copy(original);

            ctrl.list = [];


            ctrl.generate = function() {

                var blob = new Blob([JSON.stringify(ctrl.list)], { type: 'text/json;charset=utf-8' }),
                    url = $window.URL || $window.webkitURL;

                $scope.fileUrl = url.createObjectURL(blob);

            }

        });


    

})();
