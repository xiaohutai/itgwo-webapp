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
        return $sce.trustAsHtml; }
    );

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


