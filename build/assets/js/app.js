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


(function() {
    'use strict';

    angular.module('application').controller('EntriesController',
        [
            '$http', '$scope', '$stateParams', '$controller',
            function ($http, $scope, $stateParams, $controller)
            {

                angular.extend(this, $controller(
                    'DefaultController',
                    { $http: $http, $scope: $scope, $stateParams: $stateParams}
                    ));

                $scope.loadEntries = function() {
                    $http
                    .get("http://www.intothegreatwideopen.nl/json/berichten")
                    .then(function(result){
                        $scope.entries = result.data.entries;
                    }).catch(function(e) {
                        console.log("Could not fetch Entries");
                        console.log(e);
                    });

                };


                if (!$scope.entries) {
                    $scope.loadEntries($scope, $http);
                }

            }
        ]
    );



})();
angular.module('application').controller('NewsController',
    [
        '$http', '$scope', '$stateParams', '$controller',
        function ($http, $scope, $stateParams, $controller)
        {

            angular.extend(this, $controller(
                'DefaultController',
                { $http: $http, $scope: $scope, $stateParams: $stateParams}
                ));

            $scope.loadBerichten = function() {
                console.log('load berichten');

                $http.get("http://www.intothegreatwideopen.nl/json/berichten")
                    .then(function(result){

                        $scope.berichten = result.data.berichten;
                    }).catch(function(e) {
                        console.log("Could not fetch berichten");
                        console.log(e);
                    });

            };

            if (!$stateParams.id && !$scope.berichten) {
                $scope.loadBerichten();
            }

            // Als we op een specifiek nieuwsbericht zijn.
            if ($stateParams.id) {

                $http.get("http://www.intothegreatwideopen.nl/json/berichten/" + $stateParams.id)
                    .then(function(result){
                        console.log('load bericht', $stateParams.id);
                        $scope.bericht = result.data;

                    }).catch(function(e) {
                        console.log("Could not fetch entry " + $stateParams.id );
                        console.log(e);
                    });

            }


        }
    ]
);



angular.module('application').controller('ProgrammaController',
    [
        '$http', '$scope', '$stateParams', '$controller',
        function ($http, $scope, $stateParams, $controller)
        {

            angular.extend(this, $controller(
                'DefaultController',
                { $http: $http, $scope: $scope, $stateParams: $stateParams}
                ));

            $scope.loadProgramma = function() {
                console.log('load programma');

                $http.get("http://programma.greatwideopen.nl/json/speeltijden")
                    .then(function(result){
                        $scope.speeltijden = result.data.speeltijden;
                    }).catch(function(e) {
                        console.log("Could not fetch programma");
                        console.log(e);
                    });

            };

            if (!$stateParams.id && !$scope.speeltijden) {
                $scope.loadProgramma();
            }

            // Als we op een specifiek programma-item zijn.
            if ($stateParams.slug) {

                $http.get("http://programma.greatwideopen.nl/json/programmaonderdelen/" + $stateParams.slug)
                    .then(function(result){
                        console.log('load item', $stateParams.slug);
                        $scope.act = result.data;
                        console.log($scope.act);
                    }).catch(function(e) {
                        console.log("Could not fetch entry " + $stateParams.slug );
                        console.log(e);
                    });

            }


        }
    ]
);


