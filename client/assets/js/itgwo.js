(function() {
  'use strict';

  var itgwo = angular.module('itgwo', []);

  // --[ Config ]---------------------------------------------------------------

  itgwo.constant('config', {

    site: {
      title: 'ITGWO 2015',
      payoff: 'Into the Great Wide Open 2015'
    },

    app: {
      version: '0.3.7 β'
    },

    api: {
      url: 'http://programma.greatwideopen.nl/json/'
    },

    dates: [
      {
          "day": 1,
          "date": "2015-09-03",
          "name": "Donderdag",
          "shortname": "Don",
          "starttime": "2015-09-03T17:00:00+02:00",
          "endtime": "2015-09-04T03:00:00+02:00"
      },
      {
          "day": 2,
          "date": "2015-09-04",
          "name": "Vrijdag",
          "shortname": "Vrij",
          "starttime": "2015-09-04T09:00:00+02:00",
          "endtime": "2015-09-05T03:00:00+02:00"
      },
      {
          "day": 3,
          "date": "2015-09-05",
          "name": "Zaterdag",
          "shortname": "Zat",
          "starttime": "2015-09-05T09:00:00+02:00",
          "endtime": "2015-09-06T03:00:00+02:00"
      },
      {
          "day": 4,
          "date": "2015-09-06",
          "name": "Zondag",
          "shortname": "Zon",
          "starttime": "2015-09-06T09:00:00+02:00",
          "endtime": "2015-09-07T03:00:00+02:00"
      }
    ],

    locations: [
      {
          "locationId": "sportveld",
          "title": "Sportveld",
          "abbr": "Sport<br>veld",
          "icon": ""
      },
      {
          "locationId": "fortweg",
          "title": "Fortweg",
          "abbr": "Fort<br>weg",
          "icon": ""
      },
      {
          "locationId": "bospodium",
          "title": "Bospodium",
          "abbr": "Bos<br>podium</small>",
          "icon": ""
      },
      {
          "locationId": "bolder-zaal",
          "title": "Bolder Zaal",
          "abbr": "De<br>Bolder",
          "icon": ""
      },
      {
          "locationId": "bolder-cafe",
          "title": "Bolder Cafe",
          "abbr": "Bolder<br>Café",
          "icon": ""
      },
      {
          "locationId": "kerk",
          "title": "Kerk",
          "abbr": "Kerk",
          "icon": ""
      },
      {
          "locationId": "voetbalkooi",
          "title": "Voetbalkooi",
          "abbr": "<em>Voetbal kooi</em>",
          "icon": ""
      },
      {
          "locationId": "dorpsstraat",
          "title": "Dorpsstraat",
          "abbr": "<em>Dorps<br>straat</em>",
          "icon": ""
      },
      {
          "locationId": "podium-vlieland",
          "title": "Podium Vlieland",
          "abbr": "Podium<br><small>Vlieland</em>",
          "icon": ""
      },
      {
          "locationId": "strandtuin",
          "title": "Strandtuin Weltevree",
          "abbr": "<em>Strand<br>tuin</em>",
          "icon": ""
      },
    ]

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

  // Turns the video field returned by Bolt (generated by Embedly) into a
  // workable version for mobiles and phonegap applications.
  //
  // This function is also required so that the video does not autoplay in a
  // different view, when the app is "added to homescreen" on iOS devices.
  itgwo.filter('embedvideo', [ '$sce', function($sce) {
    return function(input) {

        var url = input.url;
        // Ideally, you want to extract the Youtube ID from `v`.
        url = url.replace('www.youtube.com', 'www.youtube-nocookie.com');
        url = url.replace('/watch?v=', '/embed/');

        // This fix is required if there's some querystrings at the end of the
        // inputted URL, e.g.
        //
        //     https://www.youtube-nocookie.com/embed/jhaA28DwvH4&feature=youtu.be
        //
        // This should only be used for Youtube videos.
        url = url.replace(/&[\S]*/, '');

        var iframe = $( input.responsive )
                      .find('iframe')
                      .attr('src', url)
                      .parent() // .responsive-video
                      .prop('outerHTML');

        return $sce.trustAsHtml( iframe );
    };
  }]);

  // Simple raw filter. Use sparingly. This is required for fields such as the
  // video field, where you want to do the following:
  //
  //    ng-bind-html="record.attributes.video.responsive|raw"
  //
  // The `embedvideo` filter above is better for handling videos on mobile, but
  // this `raw` filter may be useful for other (complex) fields.
  itgwo.filter('raw', [ '$sce', function($sce) {
    return function(input) {
        return $sce.trustAsHtml( input );
    };
  }]);

  // http://stackoverflow.com/questions/17289448/angularjs-to-output-plain-text-instead-of-html
  itgwo.filter('striptags', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
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


  // Generic back button.
  itgwo.directive('backButton', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          $window.history.back();
        });
      }
    };
  }]);


})();
