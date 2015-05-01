(function() {
    'use strict';

    var app = angular.module('application', [
        'ui.router',
        'ngAnimate',

        //foundation
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations'
    ])
        .config(config)
        .run(run)
    ;

    config.$inject = ['$urlRouterProvider', '$locationProvider'];

    function config($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }

    function run() {
        FastClick.attach(document.body);
    }

    //
    app.filter('html', function($sce) {
        return $sce.trustAsHtml;
    });

    // app.filter('datum', function($sce) {
    //     console.log('date', $date);
    // });

//     myApp.controller('TimestampCtrl', ['$scope', function($scope) {
//   $scope.toTimestamp = function(date) {
//     var dateSplitted = date.split('-'); // date must be in DD-MM-YYYY format
//     var formattedDate = dateSplitted[1]+'/'+dateSplitted[0]+'/'+dateSplitted[2];
//     return new Date(formattedDate).getTime();
//   };
// }]);

})();

