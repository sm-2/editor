(function () {
    
    'use script';

    angular.module('esportscalendar', [])
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        }])

        .controller('EditorController', function ($scope, $window) {

            var ctrl = this;

            ctrl.model = {};

            var data = {a:1,b:2},
                blob = new Blob([JSON.stringify(data)], { type: 'text/json;charset=utf-8' }),
                url = $window.URL || $window.webkitURL;

            $scope.fileUrl = url.createObjectURL(blob);

        });

    

})();
