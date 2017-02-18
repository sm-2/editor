(function () {
    
    'use script';

    angular.module('esportscalendar', [])
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

        });
    

})();
