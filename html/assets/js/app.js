(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    // 'ngResource',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',

    // custom
    'itgwo'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function config($urlProvider, $locationProvider, $httpProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    $httpProvider.interceptors.push('itgwo.service.httpInterceptor');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo', []);

  // --[ Config ]---------------------------------------------------------------

  itgwo.constant('config', {

    site: {
      title: 'ITGWO',
      payoff: 'Into the Great Wide Open 2015'
    },

    app: {
      version: '0.1'
    },

    api: {
      url: 'http://programma.greatwideopen.nl/json/'
    }

  });

  // --[ Filters ]--------------------------------------------------------------
  //
  // These are useful helper filters useful when working with contents that come
  // from Bolt's JSON API extension. Perhaps these need to be directives, I'm
  // not sure yet what the best solution is.
  //
  // ---------------------------------------------------------------------------

  // Returns the (first) key of an Object:
  // { key : value } => key
  itgwo.filter('key', function() {
    return function(input) {
      if (input === null || input === undefined) {
        return "";
      }
      return Object.keys(input)[0];
    };
  });

  // Returns the value (of the first key) of an Object:
  // { key : value } => value
  itgwo.filter('value', function() {
    return function(input) {
      return input[ Object.keys(input)[0] ];
    };
  });

  // Returns the last part of a string split by forward slashes.
  // "/foo/bar/baz" => "baz"
  itgwo.filter('slug', function() {
    return function(input) {
      var array = input.split('/');
      return array[array.length - 1];
    };
  });

  // --[ Directives ]-----------------------------------------------------------

  itgwo.directive("getThema",
    ['$http', '$filter', 'config', '$state',
    function($http, $filter, config, $state) {

    return {
      template: '<span class="label">{{ thema }}</span>', // TODO: make these things nice with includes?
      scope: {
        onderwerpSlug: "=getThema"
      },
      link: function(scope, element, attrs) {

        var key = $filter('key');
        var value = $filter('value');
        var slug = $filter('slug');

        $http
        .get(config.api.url + 'onderwerpen/' + scope.onderwerpSlug, { cache: true })
        .then(function(result) {

          var themaName = value(result.data.data.attributes.taxonomy.themas);
          var themaId = slug(key(result.data.data.attributes.taxonomy.themas));
          scope.thema = themaName;
          element[0].href = $state.href('thema', { id : themaId });

        }, function(err) {
          scope.thema = "Unknown";
          scope.url = "#";
        });
      }
    }
  }]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.anekdotes', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch anekdote ]---------------------------------------------------

      $http
      .get(config.api.url + 'anekdotes/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.anekdote = result.data.data;
        $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      })

      // --[ extend base controller ]-------------------------------------------

      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Use this controller to set the title and config on every page.
  itgwo.controller('itgwo.controller.base', [
    '$http', '$scope', '$state', '$stateParams', '$controller', '$location', '$rootScope', 'config', 'FoundationApi', 'itgwo.service.notification', 'itgwo.service.httpInterceptor',
    function ($http, $scope, $state, $stateParams, $controller, $location, $rootScope, config, FoundationApi, itgwoServiceNotification, itgwoServiceHttpInterceptor) {

      $rootScope.title = $state.current.data.vars.title;
      $rootScope.config = config;

      // --[ isLoading ]--------------------------------------------------------

      $rootScope.isLoading = function() {
        return itgwoServiceHttpInterceptor.isLoading();
      }

      // --[ contenttype to route ]---------------------------------------------

      $scope.contenttypeToRoute = function(contenttypeSlug) {
        var lookup = {
          'onderwerpen': 'onderwerp',
          'programmas' : 'programmaItem',
          'anekdotes' : 'anekdote',
          'themas' : 'thema'
        };

        return lookup[contenttypeSlug];
      }

      // --[ contenttype to singular ]------------------------------------------

      $scope.contenttypeToSingular = function(contenttypeSlug) {
        var lookup = {
          'onderwerpen': 'onderwerp',
          'programmas' : 'programma',
          'anekdotes' : 'anekdote',
          'themas' : 'thema'
        };

        return lookup[contenttypeSlug];
      }

      // --[ function range ]---------------------------------------------------

      $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
      };

      return $scope;
    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.berichten', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch onderwerpen ]------------------------------------------------
      // $http
      // .get(config.api.url + 'onderwerpen?' + jQuery.param({ 'filter[themas]': $state.params.id }), { cache: true })
      // .then(function(result){
      //   $scope.onderwerpen = result.data.data;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // --[ fetch thema ]------------------------------------------------------
      $http
      .get(config.api.url + 'berichten/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.thema = result.data.data;
        // $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));
    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.home', [
    '$scope', '$controller', '$state','$http', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, config, itgwoServiceNotification) {

      // --[ fetch berichten ]-----------------------------------------------------
      $http
      .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
      .then(function(result){
        $scope.berichten = result.data.data;
        // console.log(result.data.data);
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.onderwerpen', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch anekdotes ]--------------------------------------------------
      $http
      .get(config.api.url + 'anekdotes?' + jQuery.param({ 'filter[onderwerpen]': $state.params.id }), { cache: true })
      .then(function(result){
        $scope.anekdotes = result.data.data;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ fetch onderwerp ]--------------------------------------------------
      $http
      .get(config.api.url + 'onderwerpen/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.onderwerp = result.data.data;
        $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.plattegrond', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {



      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));
    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.programma', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      $scope.filter = "vr";

      if ($state.params.id) {

        // --[ fetch single programma ]-----------------------------------------
        $http
        .get(config.api.url + 'programmas/' + $state.params.id, { cache: true })
        .then(function(result){
          $scope.programma = result.data.data;
          $rootScope.title = result.data.data.attributes.title;
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      } else {

        // --[ fetch programmas ]-----------------------------------------------

        // update bolt_speeltijden AS s SET s.image = (select p.image from bolt_programmaonderdelen as p where p.id = s.programmaonderdelen)

        $http
        .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
        .then(function(result){
          $scope.speeltijden = result.data.data;
          console.log($scope.speeltijden);
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.qrscan', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // // --[ fetch onderwerpen ]------------------------------------------------
      // $http
      // .get(config.api.url + 'onderwerpen?' + jQuery.param({ 'filter[themas]': $state.params.id }), { cache: true })
      // .then(function(result){
      //   $scope.onderwerpen = result.data.data;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // // --[ fetch thema ]------------------------------------------------------
      // $http
      // .get(config.api.url + 'themas/' + $state.params.id, { cache: true })
      // .then(function(result){
      //   $scope.thema = result.data.data;
      //   $rootScope.title = result.data.data.attributes.title;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // // --[ extend base controller ]-------------------------------------------
      // angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      $scope.counter = 0;

      $scope.myClick = function() {
          $scope.counter++;
          $scope.name = 'ctrl' + $scope.counter;
      };

      $scope.scan = function() {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {

            alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        } );
      }



    }
  ]);

})();



(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.themas', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ fetch onderwerpen ]------------------------------------------------
      $http
      .get(config.api.url + 'onderwerpen?' + jQuery.param({ 'filter[themas]': $state.params.id }), { cache: true })
      .then(function(result){
        $scope.onderwerpen = result.data.data;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ fetch thema ]------------------------------------------------------
      $http
      .get(config.api.url + 'themas/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.thema = result.data.data;
        $rootScope.title = result.data.data.attributes.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));
    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.tijdlijn', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // todo: itgwo.controller.timeline query parameters as array
      // $scope.type = 'anekdotes'; // ?sort=timelineposition

      // $rootScope.timeline = true; // doesn't get set to false.
      $rootScope.title = $state.current.data.vars.title;

      // --[ fetch anekdotes ]--------------------------------------------------

      $http
      .get(config.api.url + 'anekdotes?' + jQuery.param({ 'sort': 'timelineposition' }), { cache: true })
      .then(function(result){
        $scope.anekdotes = result.data.data;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

  itgwo.directive('tijlijnScroll', ['$document', function($document){
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind("click", function () {

          var anekdotes = jQuery('.anekdote');
          var container = jQuery(anekdotes[0]).parent().parent();

          anekdotes = anekdotes.filter(function(index) {
            var position = $(this).data('position');
            return attrs.from <= position && position <= attrs.to;
          });

          var scrollTo = 0;

          if (anekdotes.length >= 1) {
            var anekdote = jQuery(anekdotes[0]);
            console.log(anekdote.offset().top);
            scrollTo = anekdote.offset().top + container.scrollTop()
          }

          container.animate({
            scrollTop: scrollTo
          }, 150);

        });

      }
    };
  }]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.zoeken', [
    '$scope', '$controller', '$state','$http', '$rootScope', '$location', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, $location, config, itgwoServiceNotification) {

      var q = ($state.params.q || '');
      var p = ($state.params.p || 1);
      var limit = 10;

      $scope.q = q;
      $scope.query = q; // duplicate
      $scope.p = p;
      $scope.zoekresultaten = [];
      $scope.title = "Zoeken"
      $scope.numPages = 0;

      if (q) {

        var params = {
          q: q,
          page: {
            number: p,
            size: limit
          }
        };

        $http
        .get(config.api.url + 'search?' + jQuery.param(params), { cache: true })
        .then(function(result){

          $scope.numPages = Math.ceil( result.data.meta.total / limit );
          $scope.zoekresultaten = result.data.data;
          $rootScope.title = 'Zoekresultaten';

        });

      }

      $scope.onFormSubmit = function(form) {
        $state.go('zoeken', { q: $scope.query, p: 1 });
      }

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  // Source: http://stackoverflow.com/questions/23804981/alternative-of-httpprovider-responseinterceptors
  // See also: https://docs.angularjs.org/api/ng/service/$http#interceptors
  // Not entirely sure if this is the best solution!

  itgwo.factory('itgwo.service.httpInterceptor',
    ['$q', '$window',
    function ($q, $window) {

      var count = 0;

      return {
        'request': function(config) {
          count++;
          // console.log('start', count);
          return config;
        },
        // 'requestError': function(rejection) {
        //   return $q.reject(rejection);
        // },
       'response': function(response) {
          count--;
          // console.log('stop', count);
          return response;
        },
       'responseError': function(rejection) {
          count--;
          // console.log('stop', count);
          return $q.reject(rejection);
        },
        'isLoading': function() {
          return count != 0;
        }
      };
      // end: return

    }
  ]);
})();

(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.service('itgwo.service.notification', [
    'config', '$filter', '$http', 'FoundationApi',
    function (config, $filter, $http, FoundationApi) {

      this.notification = function(e) {
          FoundationApi.publish('notifications', {
            title: 'Error: ' + e.errors.title,
            content: e.errors.detail,
            color: 'alert'
          });
      }

  }]);

})();
