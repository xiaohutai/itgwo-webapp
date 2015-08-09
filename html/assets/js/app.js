<<<<<<< HEAD
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
      title: 'ITGWO 2015',
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

/**
 * @license jquery.panzoom.js v2.0.5
 * Updated: Thu Jul 03 2014
 * Add pan and zoom functionality to any element
 * Copyright (c) 2014 timmy willison
 * Released under the MIT license
 * https://github.com/timmywil/jquery.panzoom/blob/master/MIT-License.txt
 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(c){return b(a,c)}):"object"==typeof exports?b(a,require("jquery")):b(a,a.jQuery)}("undefined"!=typeof window?window:this,function(a,b){"use strict";function c(a,b){for(var c=a.length;--c;)if(+a[c]!==+b[c])return!1;return!0}function d(a){var c={range:!0,animate:!0};return"boolean"==typeof a?c.animate=a:b.extend(c,a),c}function e(a,c,d,e,f,g,h,i,j){this.elements="array"===b.type(a)?[+a[0],+a[2],+a[4],+a[1],+a[3],+a[5],0,0,1]:[a,c,d,e,f,g,h||0,i||0,j||1]}function f(a,b,c){this.elements=[a,b,c]}function g(a,c){if(!(this instanceof g))return new g(a,c);1!==a.nodeType&&b.error("Panzoom called on non-Element node"),b.contains(l,a)||b.error("Panzoom element must be attached to the document");var d=b.data(a,m);if(d)return d;this.options=c=b.extend({},g.defaults,c),this.elem=a;var e=this.$elem=b(a);this.$set=c.$set&&c.$set.length?c.$set:e,this.$doc=b(a.ownerDocument||l),this.$parent=e.parent(),this.isSVG=r.test(a.namespaceURI)&&"svg"!==a.nodeName.toLowerCase(),this.panning=!1,this._buildTransform(),this._transform=!this.isSVG&&b.cssProps.transform.replace(q,"-$1").toLowerCase(),this._buildTransition(),this.resetDimensions();var f=b(),h=this;b.each(["$zoomIn","$zoomOut","$zoomRange","$reset"],function(a,b){h[b]=c[b]||f}),this.enable(),b.data(a,m,this)}var h="over out down up move enter leave cancel".split(" "),i=b.extend({},b.event.mouseHooks),j={};if(a.PointerEvent)b.each(h,function(a,c){b.event.fixHooks[j[c]="pointer"+c]=i});else{var k=i.props;i.props=k.concat(["touches","changedTouches","targetTouches","altKey","ctrlKey","metaKey","shiftKey"]),i.filter=function(a,b){var c,d=k.length;if(!b.pageX&&b.touches&&(c=b.touches[0]))for(;d--;)a[k[d]]=c[k[d]];return a},b.each(h,function(a,c){if(2>a)j[c]="mouse"+c;else{var d="touch"+("down"===c?"start":"up"===c?"end":c);b.event.fixHooks[d]=i,j[c]=d+" mouse"+c}})}b.pointertouch=j;var l=a.document,m="__pz__",n=Array.prototype.slice,o=!!a.PointerEvent,p=function(){var a=l.createElement("input");return a.setAttribute("oninput","return"),"function"==typeof a.oninput}(),q=/([A-Z])/g,r=/^http:[\w\.\/]+svg$/,s=/^inline/,t="(\\-?[\\d\\.e]+)",u="\\,?\\s*",v=new RegExp("^matrix\\("+t+u+t+u+t+u+t+u+t+u+t+"\\)$");return e.prototype={x:function(a){var b=a instanceof f,c=this.elements,d=a.elements;return b&&3===d.length?new f(c[0]*d[0]+c[1]*d[1]+c[2]*d[2],c[3]*d[0]+c[4]*d[1]+c[5]*d[2],c[6]*d[0]+c[7]*d[1]+c[8]*d[2]):d.length===c.length?new e(c[0]*d[0]+c[1]*d[3]+c[2]*d[6],c[0]*d[1]+c[1]*d[4]+c[2]*d[7],c[0]*d[2]+c[1]*d[5]+c[2]*d[8],c[3]*d[0]+c[4]*d[3]+c[5]*d[6],c[3]*d[1]+c[4]*d[4]+c[5]*d[7],c[3]*d[2]+c[4]*d[5]+c[5]*d[8],c[6]*d[0]+c[7]*d[3]+c[8]*d[6],c[6]*d[1]+c[7]*d[4]+c[8]*d[7],c[6]*d[2]+c[7]*d[5]+c[8]*d[8]):!1},inverse:function(){var a=1/this.determinant(),b=this.elements;return new e(a*(b[8]*b[4]-b[7]*b[5]),a*-(b[8]*b[1]-b[7]*b[2]),a*(b[5]*b[1]-b[4]*b[2]),a*-(b[8]*b[3]-b[6]*b[5]),a*(b[8]*b[0]-b[6]*b[2]),a*-(b[5]*b[0]-b[3]*b[2]),a*(b[7]*b[3]-b[6]*b[4]),a*-(b[7]*b[0]-b[6]*b[1]),a*(b[4]*b[0]-b[3]*b[1]))},determinant:function(){var a=this.elements;return a[0]*(a[8]*a[4]-a[7]*a[5])-a[3]*(a[8]*a[1]-a[7]*a[2])+a[6]*(a[5]*a[1]-a[4]*a[2])}},f.prototype.e=e.prototype.e=function(a){return this.elements[a]},g.rmatrix=v,g.events=b.pointertouch,g.defaults={eventNamespace:".panzoom",transition:!0,cursor:"move",disablePan:!1,disableZoom:!1,increment:.3,minScale:.4,maxScale:5,rangeStep:.05,duration:200,easing:"ease-in-out",contain:!1},g.prototype={constructor:g,instance:function(){return this},enable:function(){this._initStyle(),this._bind(),this.disabled=!1},disable:function(){this.disabled=!0,this._resetStyle(),this._unbind()},isDisabled:function(){return this.disabled},destroy:function(){this.disable(),b.removeData(this.elem,m)},resetDimensions:function(){var a=this.$parent;this.container={width:a.innerWidth(),height:a.innerHeight()};var c,d=a.offset(),e=this.elem,f=this.$elem;this.isSVG?(c=e.getBoundingClientRect(),c={left:c.left-d.left,top:c.top-d.top,width:c.width,height:c.height,margin:{left:0,top:0}}):c={left:b.css(e,"left",!0)||0,top:b.css(e,"top",!0)||0,width:f.innerWidth(),height:f.innerHeight(),margin:{top:b.css(e,"marginTop",!0)||0,left:b.css(e,"marginLeft",!0)||0}},c.widthBorder=b.css(e,"borderLeftWidth",!0)+b.css(e,"borderRightWidth",!0)||0,c.heightBorder=b.css(e,"borderTopWidth",!0)+b.css(e,"borderBottomWidth",!0)||0,this.dimensions=c},reset:function(a){a=d(a);var b=this.setMatrix(this._origTransform,a);a.silent||this._trigger("reset",b)},resetZoom:function(a){a=d(a);var b=this.getMatrix(this._origTransform);a.dValue=b[3],this.zoom(b[0],a)},resetPan:function(a){var b=this.getMatrix(this._origTransform);this.pan(b[4],b[5],d(a))},setTransform:function(a){for(var c=this.isSVG?"attr":"style",d=this.$set,e=d.length;e--;)b[c](d[e],"transform",a)},getTransform:function(a){var c=this.$set,d=c[0];return a?this.setTransform(a):a=b[this.isSVG?"attr":"style"](d,"transform"),"none"===a||v.test(a)||this.setTransform(a=b.css(d,"transform")),a||"none"},getMatrix:function(a){var b=v.exec(a||this.getTransform());return b&&b.shift(),b||[1,0,0,1,0,0]},setMatrix:function(a,c){if(!this.disabled){c||(c={}),"string"==typeof a&&(a=this.getMatrix(a));var d,e,f,g,h,i,j,k,l,m,n=+a[0],o=this.$parent,p="undefined"!=typeof c.contain?c.contain:this.options.contain;return p&&(d=this._checkDims(),e=this.container,l=d.width+d.widthBorder,m=d.height+d.heightBorder,f=(l*Math.abs(n)-e.width)/2,g=(m*Math.abs(n)-e.height)/2,j=d.left+d.margin.left,k=d.top+d.margin.top,"invert"===p?(h=l>e.width?l-e.width:0,i=m>e.height?m-e.height:0,f+=(e.width-l)/2,g+=(e.height-m)/2,a[4]=Math.max(Math.min(a[4],f-j),-f-j-h),a[5]=Math.max(Math.min(a[5],g-k),-g-k-i+d.heightBorder)):(g+=d.heightBorder/2,h=e.width>l?e.width-l:0,i=e.height>m?e.height-m:0,"center"===o.css("textAlign")&&s.test(b.css(this.elem,"display"))?h=0:f=g=0,a[4]=Math.min(Math.max(a[4],f-j),-f-j+h),a[5]=Math.min(Math.max(a[5],g-k),-g-k+i))),"skip"!==c.animate&&this.transition(!c.animate),c.range&&this.$zoomRange.val(n),this.setTransform("matrix("+a.join(",")+")"),c.silent||this._trigger("change",a),a}},isPanning:function(){return this.panning},transition:function(a){if(this._transition)for(var c=a||!this.options.transition?"none":this._transition,d=this.$set,e=d.length;e--;)b.style(d[e],"transition")!==c&&b.style(d[e],"transition",c)},pan:function(a,b,c){if(!this.options.disablePan){c||(c={});var d=c.matrix;d||(d=this.getMatrix()),c.relative&&(a+=+d[4],b+=+d[5]),d[4]=a,d[5]=b,this.setMatrix(d,c),c.silent||this._trigger("pan",d[4],d[5])}},zoom:function(a,c){"object"==typeof a?(c=a,a=null):c||(c={});var d=b.extend({},this.options,c);if(!d.disableZoom){var g=!1,h=d.matrix||this.getMatrix();"number"!=typeof a&&(a=+h[0]+d.increment*(a?-1:1),g=!0),a>d.maxScale?a=d.maxScale:a<d.minScale&&(a=d.minScale);var i=d.focal;if(i&&!d.disablePan){var j=this._checkDims(),k=i.clientX,l=i.clientY;this.isSVG||(k-=(j.width+j.widthBorder)/2,l-=(j.height+j.heightBorder)/2);var m=new f(k,l,1),n=new e(h),o=this.parentOffset||this.$parent.offset(),p=new e(1,0,o.left-this.$doc.scrollLeft(),0,1,o.top-this.$doc.scrollTop()),q=n.inverse().x(p.inverse().x(m)),r=a/h[0];n=n.x(new e([r,0,0,r,0,0])),m=p.x(n.x(q)),h[4]=+h[4]+(k-m.e(0)),h[5]=+h[5]+(l-m.e(1))}h[0]=a,h[3]="number"==typeof d.dValue?d.dValue:a,this.setMatrix(h,{animate:"boolean"==typeof d.animate?d.animate:g,range:!d.noSetRange}),d.silent||this._trigger("zoom",h[0],d)}},option:function(a,c){var d;if(!a)return b.extend({},this.options);if("string"==typeof a){if(1===arguments.length)return void 0!==this.options[a]?this.options[a]:null;d={},d[a]=c}else d=a;this._setOptions(d)},_setOptions:function(a){b.each(a,b.proxy(function(a,c){switch(a){case"disablePan":this._resetStyle();case"$zoomIn":case"$zoomOut":case"$zoomRange":case"$reset":case"disableZoom":case"onStart":case"onChange":case"onZoom":case"onPan":case"onEnd":case"onReset":case"eventNamespace":this._unbind()}switch(this.options[a]=c,a){case"disablePan":this._initStyle();case"$zoomIn":case"$zoomOut":case"$zoomRange":case"$reset":this[a]=c;case"disableZoom":case"onStart":case"onChange":case"onZoom":case"onPan":case"onEnd":case"onReset":case"eventNamespace":this._bind();break;case"cursor":b.style(this.elem,"cursor",c);break;case"minScale":this.$zoomRange.attr("min",c);break;case"maxScale":this.$zoomRange.attr("max",c);break;case"rangeStep":this.$zoomRange.attr("step",c);break;case"startTransform":this._buildTransform();break;case"duration":case"easing":this._buildTransition();case"transition":this.transition();break;case"$set":c instanceof b&&c.length&&(this.$set=c,this._initStyle(),this._buildTransform())}},this))},_initStyle:function(){var a={"backface-visibility":"hidden","transform-origin":this.isSVG?"0 0":"50% 50%"};this.options.disablePan||(a.cursor=this.options.cursor),this.$set.css(a);var c=this.$parent;c.length&&!b.nodeName(c[0],"body")&&(a={overflow:"hidden"},"static"===c.css("position")&&(a.position="relative"),c.css(a))},_resetStyle:function(){this.$elem.css({cursor:"",transition:""}),this.$parent.css({overflow:"",position:""})},_bind:function(){var a=this,c=this.options,d=c.eventNamespace,e=o?"pointerdown"+d:"touchstart"+d+" mousedown"+d,f=o?"pointerup"+d:"touchend"+d+" click"+d,h={},i=this.$reset,j=this.$zoomRange;if(b.each(["Start","Change","Zoom","Pan","End","Reset"],function(){var a=c["on"+this];b.isFunction(a)&&(h["panzoom"+this.toLowerCase()+d]=a)}),c.disablePan&&c.disableZoom||(h[e]=function(b){var d;("touchstart"===b.type?!(d=b.touches)||(1!==d.length||c.disablePan)&&2!==d.length:c.disablePan||1!==b.which)||(b.preventDefault(),b.stopPropagation(),a._startMove(b,d))}),this.$elem.on(h),i.length&&i.on(f,function(b){b.preventDefault(),a.reset()}),j.length&&j.attr({step:c.rangeStep===g.defaults.rangeStep&&j.attr("step")||c.rangeStep,min:c.minScale,max:c.maxScale}).prop({value:this.getMatrix()[0]}),!c.disableZoom){var k=this.$zoomIn,l=this.$zoomOut;k.length&&l.length&&(k.on(f,function(b){b.preventDefault(),a.zoom()}),l.on(f,function(b){b.preventDefault(),a.zoom(!0)})),j.length&&(h={},h[(o?"pointerdown":"mousedown")+d]=function(){a.transition(!0)},h[(p?"input":"change")+d]=function(){a.zoom(+this.value,{noSetRange:!0})},j.on(h))}},_unbind:function(){this.$elem.add(this.$zoomIn).add(this.$zoomOut).add(this.$reset).off(this.options.eventNamespace)},_buildTransform:function(){return this._origTransform=this.getTransform(this.options.startTransform)},_buildTransition:function(){if(this._transform){var a=this.options;this._transition=this._transform+" "+a.duration+"ms "+a.easing}},_checkDims:function(){var a=this.dimensions;return a.width&&a.height||this.resetDimensions(),this.dimensions},_getDistance:function(a){var b=a[0],c=a[1];return Math.sqrt(Math.pow(Math.abs(c.clientX-b.clientX),2)+Math.pow(Math.abs(c.clientY-b.clientY),2))},_getMiddle:function(a){var b=a[0],c=a[1];return{clientX:(c.clientX-b.clientX)/2+b.clientX,clientY:(c.clientY-b.clientY)/2+b.clientY}},_trigger:function(a){"string"==typeof a&&(a="panzoom"+a),this.$elem.triggerHandler(a,[this].concat(n.call(arguments,1)))},_startMove:function(a,d){var e,f,g,h,i,j,k,m,n=this,p=this.options,q=p.eventNamespace,r=this.getMatrix(),s=r.slice(0),t=+s[4],u=+s[5],v={matrix:r,animate:"skip"};o?(f="pointermove",g="pointerup"):"touchstart"===a.type?(f="touchmove",g="touchend"):(f="mousemove",g="mouseup"),f+=q,g+=q,this.transition(!0),this.panning=!0,this._trigger("start",a,d),d&&2===d.length?(h=this._getDistance(d),i=+r[0],j=this._getMiddle(d),e=function(a){a.preventDefault();var b=n._getMiddle(d=a.touches),c=n._getDistance(d)-h;n.zoom(c*(p.increment/100)+i,{focal:b,matrix:r,animate:!1}),n.pan(+r[4]+b.clientX-j.clientX,+r[5]+b.clientY-j.clientY,v),j=b}):(k=a.pageX,m=a.pageY,e=function(a){a.preventDefault(),n.pan(t+a.pageX-k,u+a.pageY-m,v)}),b(l).off(q).on(f,e).on(g,function(a){a.preventDefault(),b(this).off(q),n.panning=!1,a.type="panzoomend",n._trigger(a,r,!c(r,s))})}},b.Panzoom=g,b.fn.panzoom=function(a){var c,d,e,f;return"string"==typeof a?(f=[],d=n.call(arguments,1),this.each(function(){c=b.data(this,m),c?"_"!==a.charAt(0)&&"function"==typeof(e=c[a])&&void 0!==(e=e.apply(c,d))&&f.push(e):f.push(void 0)}),f.length?1===f.length?f[0]:f:this):this.each(function(){new g(this,a)})},g});
/**
 * (C) Timetable code was orignally created by the Lowlove crew: http://www.lowlove.nl,
 * and is used with permission. Modifications for ITGWO, by Bob den Otter - bob@twokings.nl
 */

var utils = function(){

    // var dataUrl = '/blokkenschema/program.json';
    var dataUrl = 'http://programma.greatwideopen.nl/json/speeltijden?page[size]=500';
    //var dataUrl = 'program.json';
    var data = null;



    function loadData(callback){
        $.getJSON(dataUrl, null, function(json, status){
            data = json.data;
            callback(json, status);
        })
    }

    function getLocation(id){
        return Finder.find(data.locations, id, 'locationId');
    }

    function getAct(id){
        return Finder.find(data.shows, id, 'showId');
    }

    function getProgramItem(id, day){
        if(day){
            return Finder.find(getProgram(day).items, id, 'programId');
        } else {
            for(var dayIndex in data.program){
                var item = Finder.find(data.program[dayIndex].items, id, 'programId');
                if(item){
                    return item;
                }
            }
        }
        return null;
    }

    function getProgram(day){
        day = day || currentDay;
        console.log('day', dates[day-1]);

        var program = [];

        for (i=0; i < data.length; i++) {
            // console.log(i, data[i].attributes.starttijd, dates[day-1]['date']);
            if (data[i].attributes.starttijd) {

                start = new Date(data[i].attributes.starttijd);
                lower = new Date(dates[day-1].starttime);
                upper = new Date(dates[day-1].endtime);
                if (lower < start && start < upper) {
                    program.push(data[i].attributes);
                }
            }
        }

        // console.log(program);
        return program;

    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    function setCookie(name, value, expires_seconds) {
        expires_seconds = expires_seconds || 100 * 24 * 3600;
        var d = new Date();
        d = new Date(d.getTime() + 1000 * expires_seconds);
        document.cookie = name + '=' + value + '; expires=' + d.toGMTString() + ';';
    }

    return {
        loadData : loadData,
        getLocation : getLocation,
        getAct : getAct,
        getProgramItem : getProgramItem,
        getProgram : getProgram,
        getCookie: getCookie,
        setCookie: setCookie
    }

}();


function Finder(){}

Finder.cache = {};
Finder.find = function (data, id, prop){
    prop = prop || 'id';

    if(Finder.cache[data] && Finder.cache[data][id]){
        return Finder.cache[data][id];
    }

    for(var o in data){
        //console.log(data[o][prop] + ' <=> ' + id);
        if(data[o][prop] == id){
            if(!Finder.cache[data]){
                Finder.cache[data] = {};
            }
            Finder.cache[data][id] = data[o];
            return data[o];
        }
    }
    return null;
}
Finder.findBy = function (data, prop, val){
    var result = [];
    for(var o in data){
        if(data[o][prop] == val){
            result.push(data[o]);
        }
    }
    return result;
}


var dates = [
    {
        "day": 1,
        "date": "2015-09-03",
        "name": "Donderdag",
        "shortname": "Don",
        "starttime": "2015-09-03 17:00:00",
        "endtime": "2015-09-04 03:00:00"
    },
    {
        "day": 2,
        "date": "2015-09-04",
        "name": "Vrijdag",
        "shortname": "Vrij",
        "starttime": "2015-09-04 12:00:00",
        "endtime": "2015-09-05 03:00:00"
    },
    {
        "day": 3,
        "date": "2015-09-05",
        "name": "Zaterdag",
        "shortname": "Zat",
        "starttime": "2015-09-05 09:00:00",
        "endtime": "2015-09-06 01:00:00"
    },
    {
        "day": 4,
        "date": "2015-09-06",
        "name": "Zondag",
        "shortname": "Zon",
        "starttime": "2015-09-06 10:00:00",
        "endtime": "2015-09-07 03:00:00"
    }];

var locationData = [
    {
        "locationId": "sportveld",
        "title": "Sportveld",
        "abbr": "SpVe",
        "icon": ""
    },
    {
        "locationId": "bospodium",
        "title": "Bospodium",
        "abbr": "BosP",
        "icon": ""
    },
    {
        "locationId": "fortweg",
        "title": "Fortweg",
        "abbr": "FortW",
        "icon": ""
    },
    {
        "locationId": "bolder-zaal",
        "title": "Bolder Zaal",
        "abbr": "BolZ",
        "icon": ""
    },
    {
        "locationId": "Bolder-cafe",
        "title": "Bolder Cafe",
        "abbr": "BolC",
        "icon": ""
    },
    {
        "locationId": "podium-vlieland",
        "title": "Podium Vlieland",
        "abbr": "PoVl",
        "icon": ""
    }];


var timetable = function(utils){

    var root, container, scrollcontainer, locations, blocks, nav, popup = null;
    // var data = null;
    var modificationDate = null;
    var currentDay = 1;
    var supportsTouch = false;

    var options = {
        width: 150 // width of 1 hour
    };



    var dragging = false;
    var mql = null;

    function init(){
        // check for touch devices. On touch devices will not use the jQuery drag
        supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        // build up the necessary divs & blocks
        nav = $('<div class="navigation"></div>'); // will hold the days of the week

        locations = $('<div class="locations"></div>'); // will hold the tents, fixed to the left side

        blocks = $('<div id="timetableblocks"></div>'); // will hold all the acts

        scrollcontainer = $('<div class="scroll-container"></div>'); // will hold the container with acts, and provide scrolling
        scrollcontainer.append(blocks);

        container = $('<div class="container"></div>'); // will hold both the locations, fixed to the left and the scroll container
        container.append(scrollcontainer);
        container.append(locations);

        root = $('#timetable'); // and finally everything is added to the html element on the webpage. Both the navigation, and the container that holds the rest
        root.append(nav);
        root.append(container);

        if(!supportsTouch){
            // on non touch devices we use jQuery drag
            blocks.draggable({
                axis: blocks.height() < $('#timetable').height() ? "x" : "both",
                start: function() {
                    blocks.stop();
                    dragging = true; // prevent accidently clicking on an act when you stop dragging
                },
                stop: function() {
                    // prevent accidently clicking on an act when you stop dragging
                    setTimeout(function(){
                        dragging = false;
                    }, 100)

                    // check constraints, if the scrollcontainer is out of bounds, animate it back to a better position
                    if( parseInt(blocks.css('left')) > 10 ){
                        blocks.animate({left: 0});
                    } else if( parseInt(blocks.css('left')) < -(blocks.width() - $('#timetable').width()) ){
                        blocks.animate({left : -(blocks.width() - $('#timetable').width())});
                    }
                    if( parseInt(blocks.css('top')) > 10 ){
                        blocks.animate({top: 0});
                    } else if( parseInt(blocks.css('top')) < -(blocks.height() - $('#timetable').height()) ){
                        blocks.animate({top: -(blocks.height() - $('#timetable').height())});
                    }
                }
            });
        } else {
            // on touch devices we need to add some extra styles to make the scrollbar visible
            scrollcontainer.addClass('scroll-container-touch');
        }

        // handle different sized screens using media queries
        if(window.matchMedia){
            mql = window.matchMedia("(min-width: 880px)");
            mql.addListener( onMediaQuery );
        }

        utils.loadData(onLoadDataResult);
    }

    function onLoadDataResult(json, status){
        if(status == 'success'){
            data = json.data;
            modificationDate = json.modificationDate;

            setup( getDay() );
        } else {
            alert('De informatie voor het blokkenschema kan op dit moment niet geladen worden.');
        }
    }

    function setup(day, time){
        console.log('setup');
        day = day || currentDay;
        currentDay = day;

        var locData, actData, dayData, showData, actsOnLocation;
        var timeLayer, backgroundLayer, actsLayer;
        var row, location, act, name;
        var startTime, endTime, dayStartTime, dayEndTime, time;
        var totalHours, totalWidth;
        var size;

        // setup navigation links with the days of the week
        nav.empty();
        for(var index in dates){
            var dayId = dates[index].shortname;
            var link = $('<a></a>');
            link.click(onSwitchDay);
            link.html( dates[index].shortname );
            link.attr({
                'href' : '#',
                'data-day' : 1 + parseInt(index)
            });
            if(parseInt(index)+1 == currentDay){
                link.addClass('selected');
            }
            nav.append(link);
            // console.log(link.html());
        }

        // get all the right sizes for the buildup
        size = sizes();

        // get program and start time of current day
        dayData = utils.getProgram( day );
        dayStartTime = new Date( dates[day-1]['starttime'] );
        dayEndTime = new Date( dates[day-1]['endtime'] );
        totalHours = Math.ceil( (dayEndTime - dayStartTime) / 3600000 );
        totalWidth = totalHours * size.hour;


        console.log("daydata", dayData);

        // add a 'nice' fadeout effect on the currently visible blocks
        blocks.fadeOut(200, function(){

            // remove all existing elements in block container
            blocks.empty();

            // set the total width for the content
            blocks.width( totalWidth );

            // buildup time cells on top
            time = new Date(dayStartTime.getTime());
            timeLayer = $('<div class="timeLayer"></div>');
            for(var i = 0; i < totalHours; i++){
                time.setHours( time.getHours() + 1 );
                var hourDiv =  $('<div class="hour"></div>');
                hourDiv.css({
                    width : size.hour
                });
                hourDiv.html( '<span class="time">' + time.getHours() + ':00</span>' );
                timeLayer.append( hourDiv );
            }
            blocks.append( timeLayer );

            console.log(locationData);

            // loop over all locations
            for(var index in locationData){
                // get the current location
                locData = locationData[index];
                // console.log(locData);
                // the row will contain all the acts and the background
                row = $('<div class="row"></div>');
                row.css({
                    width: totalWidth
                });

                // these layers will be on top of each other
                backgroundLayer = $('<div class="layer"></div>');
                actsLayer = $('<div class="layer"></div>');

                // add a div for each hour; draw the background dynamically
                time = new Date(dayStartTime.getTime());
                for(var i = 0; i < totalHours; i++){
                    time.setHours( time.getHours() + 1 );
                    backgroundLayer.append( $('<div class="hour"></div>').css({ width : size.hour }) );
                }

                // find acts for this location on the current day and add them to the top layer
                actsOnLocation = Finder.findBy(dayData, 'speellokatie', locData.locationId)
                // console.log('actsOnLocation', actsOnLocation);
                for(var i = 0, l = actsOnLocation.length; i < l; i++){
                    actData = actsOnLocation[i];

                    // showData = utils.getAct( actData.contentId );

                    startTime = new Date( actData.starttijd );
                    endTime = new Date();
                    endTime.setTime( startTime.getTime() + (actData.lengte * 60000) );

                    // console.log('startTime - endTime', startTime, endTime);

                    act = $('<div class="act"></div>')
                    act.css({
                        // offset left is the numbers of minutes from day start time times the size per minute
                        left: ( (startTime - dayStartTime) / 60000 ) * size.minute,
                        // width is duration in minutes times the size per minute
                        width: ( (endTime - startTime) / 60000 ) * size.minute
                    });
                    act.attr({
                        'data-act' :  actData.contentId,
                        'data-programmaonderdelen' :  actData.programId,
                        title : actData.title
                    });
                    act.click(onShowProgramItem);

                    // we pack the name of the act in yet another div, for alignment
                    name = $('<div class="spanText"></div>');
                    name.width( act.width() );
                    name.html( actData.title );
                    name.attr({
                        title :  actData.title
                    });

                    // if(favorites.indexOf(actData.programId) > -1){
                    //     act.addClass('favorite');
                    // }

                    act.append( name );
                    actsLayer.append( act );

                }

                // finaly add the last layer with the location
                location = $('<div class="location"></div>');
                location.html( locData.abbr );
                location.attr({
                    title : locData.title
                });

                //locationsLayer.append(location);

                row.append(backgroundLayer);
                row.append(actsLayer);
                blocks.append( row );
                locations.append(location);
            }

            blocks.fadeIn(400);
        });
    }

    function onShowProgramItem(e){
        e.preventDefault();
        if(dragging) return;
        //showProgramItem( parseInt( $(this).attr('data-act') ) );
        showProgramItem( parseInt( $(this).attr('data-program') ) );
    }

    function showProgramItem(id){
        timetablePopup.show( id );
    }

    function onSwitchDay(e){
        e.preventDefault();
        var dayId = $(this).attr('data-day');
        setup(dayId);
    }

    function onMediaQuery( mediaQueryList ){
        setup( currentDay );
    }

    function getDay(){
        return root.attr('data-day') || 1;
    }

    function getDayLabel(day){
        switch(day){
            case 0: return 'Zondag';
            case 1: return 'Maandag';
            case 2: return 'Dinsdag';
            case 3: return 'Woensdag';
            case 4: return 'Donderdag';
            case 5: return 'Vrijdag';
            case 6: return 'Zaterdag';
            default: return '';
        }
    }

    function sizes(){
        if(mql){
            if(mql.matches){
                return {
                    hour : options.width,
                    minute : options.width / 60
                }
            } else {
                return {
                    hour : options.width / 2,
                    minute : (options.width / 2) / 60
                }
            }
        }

        return {
            hour : options.width,
            minute : options.width / 60
        }
    }

    return {
        init : init,
        getDay : getDay,
        getDayLabel : getDayLabel
    }

}(utils);


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

      // --[ fetch bericht ]------------------------------------------------------
      $http
      .get(config.api.url + 'berichten/' + $state.params.id, { cache: true })
      .then(function(result){
        $scope.bericht = result.data.data;
        // Larger image..
        $scope.bericht.attributes.image.thumbnail = $scope.bericht.attributes.image.thumbnail.replace('240x240', '752x564');
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

  itgwo.controller('itgwo.controller.blokkenschema', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      timetable.init();

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

  itgwo.controller('itgwo.controller.plattegrond', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      $(".panzoom-parent").panzoom({
          contain: 'invert',
          minScale: 1
      });

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
        .get(config.api.url + 'programmaonderdelen/' + $state.params.id, { cache: true })
        .then(function(result){
          $scope.onderdeel = result.data.data;
          // Larger image..
          $scope.onderdeel.attributes.image.thumbnail = $scope.onderdeel.attributes.image.thumbnail.replace('240x240', '752x564');
          $rootScope.title = result.data.data.attributes.name;
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
          //console.log($scope.speeltijden);
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
=======
!function(){"use strict";function t(t,i,n){t.otherwise("/"),i.html5Mode({enabled:!1,requireBase:!1}),i.hashPrefix("!"),n.interceptors.push("itgwo.service.httpInterceptor")}function i(){FastClick.attach(document.body)}angular.module("application",["ui.router","ngAnimate","ngSanitize","foundation","foundation.dynamicRouting","foundation.dynamicRouting.animations","itgwo"]).config(t).run(i),t.$inject=["$urlRouterProvider","$locationProvider","$httpProvider"]}();
!function(){"use strict";var t=angular.module("itgwo",[]);t.constant("config",{site:{title:"ITGWO 2015",payoff:"Into the Great Wide Open 2015"},app:{version:"0.1"},api:{url:"http://programma.greatwideopen.nl/json/"}}),t.filter("key",function(){return function(t){return null===t||void 0===t?"":Object.keys(t)[0]}}),t.filter("value",function(){return function(t){return t[Object.keys(t)[0]]}}),t.filter("slug",function(){return function(t){var e=t.split("/");return e[e.length-1]}}),t.directive("getThema",["$http","$filter","config","$state",function(t,e,n,a){return{template:'<span class="label">{{ thema }}</span>',scope:{onderwerpSlug:"=getThema"},link:function(r,i,u){var o=e("key"),l=e("value"),c=e("slug");t.get(n.api.url+"onderwerpen/"+r.onderwerpSlug,{cache:!0}).then(function(t){var e=l(t.data.data.attributes.taxonomy.themas),n=c(o(t.data.data.attributes.taxonomy.themas));r.thema=e,i[0].href=a.href("thema",{id:n})},function(t){r.thema="Unknown",r.url="#"})}}}])}();
!function(t,e){"function"==typeof define&&define.amd?define(["jquery"],function(n){return e(t,n)}):"object"==typeof exports?e(t,require("jquery")):e(t,t.jQuery)}("undefined"!=typeof window?window:this,function(t,e){"use strict";function n(t,e){for(var n=t.length;--n;)if(+t[n]!==+e[n])return!1;return!0}function i(t){var n={range:!0,animate:!0};return"boolean"==typeof t?n.animate=t:e.extend(n,t),n}function s(t,n,i,s,o,a,r,h,c){this.elements="array"===e.type(t)?[+t[0],+t[2],+t[4],+t[1],+t[3],+t[5],0,0,1]:[t,n,i,s,o,a,r||0,h||0,c||1]}function o(t,e,n){this.elements=[t,e,n]}function a(t,n){if(!(this instanceof a))return new a(t,n);1!==t.nodeType&&e.error("Panzoom called on non-Element node"),e.contains(u,t)||e.error("Panzoom element must be attached to the document");var i=e.data(t,m);if(i)return i;this.options=n=e.extend({},a.defaults,n),this.elem=t;var s=this.$elem=e(t);this.$set=n.$set&&n.$set.length?n.$set:s,this.$doc=e(t.ownerDocument||u),this.$parent=s.parent(),this.isSVG=v.test(t.namespaceURI)&&"svg"!==t.nodeName.toLowerCase(),this.panning=!1,this._buildTransform(),this._transform=!this.isSVG&&e.cssProps.transform.replace(g,"-$1").toLowerCase(),this._buildTransition(),this.resetDimensions();var o=e(),r=this;e.each(["$zoomIn","$zoomOut","$zoomRange","$reset"],function(t,e){r[e]=n[e]||o}),this.enable(),e.data(t,m,this)}var r="over out down up move enter leave cancel".split(" "),h=e.extend({},e.event.mouseHooks),c={};if(t.PointerEvent)e.each(r,function(t,n){e.event.fixHooks[c[n]="pointer"+n]=h});else{var l=h.props;h.props=l.concat(["touches","changedTouches","targetTouches","altKey","ctrlKey","metaKey","shiftKey"]),h.filter=function(t,e){var n,i=l.length;if(!e.pageX&&e.touches&&(n=e.touches[0]))for(;i--;)t[l[i]]=n[l[i]];return t},e.each(r,function(t,n){if(2>t)c[n]="mouse"+n;else{var i="touch"+("down"===n?"start":"up"===n?"end":n);e.event.fixHooks[i]=h,c[n]=i+" mouse"+n}})}e.pointertouch=c;var u=t.document,m="__pz__",f=Array.prototype.slice,p=!!t.PointerEvent,d=function(){var t=u.createElement("input");return t.setAttribute("oninput","return"),"function"==typeof t.oninput}(),g=/([A-Z])/g,v=/^http:[\w\.\/]+svg$/,b=/^inline/,_="(\\-?[\\d\\.e]+)",y="\\,?\\s*",$=new RegExp("^matrix\\("+_+y+_+y+_+y+_+y+_+y+_+"\\)$");return s.prototype={x:function(t){var e=t instanceof o,n=this.elements,i=t.elements;return e&&3===i.length?new o(n[0]*i[0]+n[1]*i[1]+n[2]*i[2],n[3]*i[0]+n[4]*i[1]+n[5]*i[2],n[6]*i[0]+n[7]*i[1]+n[8]*i[2]):i.length===n.length?new s(n[0]*i[0]+n[1]*i[3]+n[2]*i[6],n[0]*i[1]+n[1]*i[4]+n[2]*i[7],n[0]*i[2]+n[1]*i[5]+n[2]*i[8],n[3]*i[0]+n[4]*i[3]+n[5]*i[6],n[3]*i[1]+n[4]*i[4]+n[5]*i[7],n[3]*i[2]+n[4]*i[5]+n[5]*i[8],n[6]*i[0]+n[7]*i[3]+n[8]*i[6],n[6]*i[1]+n[7]*i[4]+n[8]*i[7],n[6]*i[2]+n[7]*i[5]+n[8]*i[8]):!1},inverse:function(){var t=1/this.determinant(),e=this.elements;return new s(t*(e[8]*e[4]-e[7]*e[5]),t*-(e[8]*e[1]-e[7]*e[2]),t*(e[5]*e[1]-e[4]*e[2]),t*-(e[8]*e[3]-e[6]*e[5]),t*(e[8]*e[0]-e[6]*e[2]),t*-(e[5]*e[0]-e[3]*e[2]),t*(e[7]*e[3]-e[6]*e[4]),t*-(e[7]*e[0]-e[6]*e[1]),t*(e[4]*e[0]-e[3]*e[1]))},determinant:function(){var t=this.elements;return t[0]*(t[8]*t[4]-t[7]*t[5])-t[3]*(t[8]*t[1]-t[7]*t[2])+t[6]*(t[5]*t[1]-t[4]*t[2])}},o.prototype.e=s.prototype.e=function(t){return this.elements[t]},a.rmatrix=$,a.events=e.pointertouch,a.defaults={eventNamespace:".panzoom",transition:!0,cursor:"move",disablePan:!1,disableZoom:!1,increment:.3,minScale:.4,maxScale:5,rangeStep:.05,duration:200,easing:"ease-in-out",contain:!1},a.prototype={constructor:a,instance:function(){return this},enable:function(){this._initStyle(),this._bind(),this.disabled=!1},disable:function(){this.disabled=!0,this._resetStyle(),this._unbind()},isDisabled:function(){return this.disabled},destroy:function(){this.disable(),e.removeData(this.elem,m)},resetDimensions:function(){var t=this.$parent;this.container={width:t.innerWidth(),height:t.innerHeight()};var n,i=t.offset(),s=this.elem,o=this.$elem;this.isSVG?(n=s.getBoundingClientRect(),n={left:n.left-i.left,top:n.top-i.top,width:n.width,height:n.height,margin:{left:0,top:0}}):n={left:e.css(s,"left",!0)||0,top:e.css(s,"top",!0)||0,width:o.innerWidth(),height:o.innerHeight(),margin:{top:e.css(s,"marginTop",!0)||0,left:e.css(s,"marginLeft",!0)||0}},n.widthBorder=e.css(s,"borderLeftWidth",!0)+e.css(s,"borderRightWidth",!0)||0,n.heightBorder=e.css(s,"borderTopWidth",!0)+e.css(s,"borderBottomWidth",!0)||0,this.dimensions=n},reset:function(t){t=i(t);var e=this.setMatrix(this._origTransform,t);t.silent||this._trigger("reset",e)},resetZoom:function(t){t=i(t);var e=this.getMatrix(this._origTransform);t.dValue=e[3],this.zoom(e[0],t)},resetPan:function(t){var e=this.getMatrix(this._origTransform);this.pan(e[4],e[5],i(t))},setTransform:function(t){for(var n=this.isSVG?"attr":"style",i=this.$set,s=i.length;s--;)e[n](i[s],"transform",t)},getTransform:function(t){var n=this.$set,i=n[0];return t?this.setTransform(t):t=e[this.isSVG?"attr":"style"](i,"transform"),"none"===t||$.test(t)||this.setTransform(t=e.css(i,"transform")),t||"none"},getMatrix:function(t){var e=$.exec(t||this.getTransform());return e&&e.shift(),e||[1,0,0,1,0,0]},setMatrix:function(t,n){if(!this.disabled){n||(n={}),"string"==typeof t&&(t=this.getMatrix(t));var i,s,o,a,r,h,c,l,u,m,f=+t[0],p=this.$parent,d="undefined"!=typeof n.contain?n.contain:this.options.contain;return d&&(i=this._checkDims(),s=this.container,u=i.width+i.widthBorder,m=i.height+i.heightBorder,o=(u*Math.abs(f)-s.width)/2,a=(m*Math.abs(f)-s.height)/2,c=i.left+i.margin.left,l=i.top+i.margin.top,"invert"===d?(r=u>s.width?u-s.width:0,h=m>s.height?m-s.height:0,o+=(s.width-u)/2,a+=(s.height-m)/2,t[4]=Math.max(Math.min(t[4],o-c),-o-c-r),t[5]=Math.max(Math.min(t[5],a-l),-a-l-h+i.heightBorder)):(a+=i.heightBorder/2,r=s.width>u?s.width-u:0,h=s.height>m?s.height-m:0,"center"===p.css("textAlign")&&b.test(e.css(this.elem,"display"))?r=0:o=a=0,t[4]=Math.min(Math.max(t[4],o-c),-o-c+r),t[5]=Math.min(Math.max(t[5],a-l),-a-l+h))),"skip"!==n.animate&&this.transition(!n.animate),n.range&&this.$zoomRange.val(f),this.setTransform("matrix("+t.join(",")+")"),n.silent||this._trigger("change",t),t}},isPanning:function(){return this.panning},transition:function(t){if(this._transition)for(var n=t||!this.options.transition?"none":this._transition,i=this.$set,s=i.length;s--;)e.style(i[s],"transition")!==n&&e.style(i[s],"transition",n)},pan:function(t,e,n){if(!this.options.disablePan){n||(n={});var i=n.matrix;i||(i=this.getMatrix()),n.relative&&(t+=+i[4],e+=+i[5]),i[4]=t,i[5]=e,this.setMatrix(i,n),n.silent||this._trigger("pan",i[4],i[5])}},zoom:function(t,n){"object"==typeof t?(n=t,t=null):n||(n={});var i=e.extend({},this.options,n);if(!i.disableZoom){var a=!1,r=i.matrix||this.getMatrix();"number"!=typeof t&&(t=+r[0]+i.increment*(t?-1:1),a=!0),t>i.maxScale?t=i.maxScale:t<i.minScale&&(t=i.minScale);var h=i.focal;if(h&&!i.disablePan){var c=this._checkDims(),l=h.clientX,u=h.clientY;this.isSVG||(l-=(c.width+c.widthBorder)/2,u-=(c.height+c.heightBorder)/2);var m=new o(l,u,1),f=new s(r),p=this.parentOffset||this.$parent.offset(),d=new s(1,0,p.left-this.$doc.scrollLeft(),0,1,p.top-this.$doc.scrollTop()),g=f.inverse().x(d.inverse().x(m)),v=t/r[0];f=f.x(new s([v,0,0,v,0,0])),m=d.x(f.x(g)),r[4]=+r[4]+(l-m.e(0)),r[5]=+r[5]+(u-m.e(1))}r[0]=t,r[3]="number"==typeof i.dValue?i.dValue:t,this.setMatrix(r,{animate:"boolean"==typeof i.animate?i.animate:a,range:!i.noSetRange}),i.silent||this._trigger("zoom",r[0],i)}},option:function(t,n){var i;if(!t)return e.extend({},this.options);if("string"==typeof t){if(1===arguments.length)return void 0!==this.options[t]?this.options[t]:null;i={},i[t]=n}else i=t;this._setOptions(i)},_setOptions:function(t){e.each(t,e.proxy(function(t,n){switch(t){case"disablePan":this._resetStyle();case"$zoomIn":case"$zoomOut":case"$zoomRange":case"$reset":case"disableZoom":case"onStart":case"onChange":case"onZoom":case"onPan":case"onEnd":case"onReset":case"eventNamespace":this._unbind()}switch(this.options[t]=n,t){case"disablePan":this._initStyle();case"$zoomIn":case"$zoomOut":case"$zoomRange":case"$reset":this[t]=n;case"disableZoom":case"onStart":case"onChange":case"onZoom":case"onPan":case"onEnd":case"onReset":case"eventNamespace":this._bind();break;case"cursor":e.style(this.elem,"cursor",n);break;case"minScale":this.$zoomRange.attr("min",n);break;case"maxScale":this.$zoomRange.attr("max",n);break;case"rangeStep":this.$zoomRange.attr("step",n);break;case"startTransform":this._buildTransform();break;case"duration":case"easing":this._buildTransition();case"transition":this.transition();break;case"$set":n instanceof e&&n.length&&(this.$set=n,this._initStyle(),this._buildTransform())}},this))},_initStyle:function(){var t={"backface-visibility":"hidden","transform-origin":this.isSVG?"0 0":"50% 50%"};this.options.disablePan||(t.cursor=this.options.cursor),this.$set.css(t);var n=this.$parent;n.length&&!e.nodeName(n[0],"body")&&(t={overflow:"hidden"},"static"===n.css("position")&&(t.position="relative"),n.css(t))},_resetStyle:function(){this.$elem.css({cursor:"",transition:""}),this.$parent.css({overflow:"",position:""})},_bind:function(){var t=this,n=this.options,i=n.eventNamespace,s=p?"pointerdown"+i:"touchstart"+i+" mousedown"+i,o=p?"pointerup"+i:"touchend"+i+" click"+i,r={},h=this.$reset,c=this.$zoomRange;if(e.each(["Start","Change","Zoom","Pan","End","Reset"],function(){var t=n["on"+this];e.isFunction(t)&&(r["panzoom"+this.toLowerCase()+i]=t)}),n.disablePan&&n.disableZoom||(r[s]=function(e){var i;("touchstart"===e.type?!(i=e.touches)||(1!==i.length||n.disablePan)&&2!==i.length:n.disablePan||1!==e.which)||(e.preventDefault(),e.stopPropagation(),t._startMove(e,i))}),this.$elem.on(r),h.length&&h.on(o,function(e){e.preventDefault(),t.reset()}),c.length&&c.attr({step:n.rangeStep===a.defaults.rangeStep&&c.attr("step")||n.rangeStep,min:n.minScale,max:n.maxScale}).prop({value:this.getMatrix()[0]}),!n.disableZoom){var l=this.$zoomIn,u=this.$zoomOut;l.length&&u.length&&(l.on(o,function(e){e.preventDefault(),t.zoom()}),u.on(o,function(e){e.preventDefault(),t.zoom(!0)})),c.length&&(r={},r[(p?"pointerdown":"mousedown")+i]=function(){t.transition(!0)},r[(d?"input":"change")+i]=function(){t.zoom(+this.value,{noSetRange:!0})},c.on(r))}},_unbind:function(){this.$elem.add(this.$zoomIn).add(this.$zoomOut).add(this.$reset).off(this.options.eventNamespace)},_buildTransform:function(){return this._origTransform=this.getTransform(this.options.startTransform)},_buildTransition:function(){if(this._transform){var t=this.options;this._transition=this._transform+" "+t.duration+"ms "+t.easing}},_checkDims:function(){var t=this.dimensions;return t.width&&t.height||this.resetDimensions(),this.dimensions},_getDistance:function(t){var e=t[0],n=t[1];return Math.sqrt(Math.pow(Math.abs(n.clientX-e.clientX),2)+Math.pow(Math.abs(n.clientY-e.clientY),2))},_getMiddle:function(t){var e=t[0],n=t[1];return{clientX:(n.clientX-e.clientX)/2+e.clientX,clientY:(n.clientY-e.clientY)/2+e.clientY}},_trigger:function(t){"string"==typeof t&&(t="panzoom"+t),this.$elem.triggerHandler(t,[this].concat(f.call(arguments,1)))},_startMove:function(t,i){var s,o,a,r,h,c,l,m,f=this,d=this.options,g=d.eventNamespace,v=this.getMatrix(),b=v.slice(0),_=+b[4],y=+b[5],$={matrix:v,animate:"skip"};p?(o="pointermove",a="pointerup"):"touchstart"===t.type?(o="touchmove",a="touchend"):(o="mousemove",a="mouseup"),o+=g,a+=g,this.transition(!0),this.panning=!0,this._trigger("start",t,i),i&&2===i.length?(r=this._getDistance(i),h=+v[0],c=this._getMiddle(i),s=function(t){t.preventDefault();var e=f._getMiddle(i=t.touches),n=f._getDistance(i)-r;f.zoom(n*(d.increment/100)+h,{focal:e,matrix:v,animate:!1}),f.pan(+v[4]+e.clientX-c.clientX,+v[5]+e.clientY-c.clientY,$),c=e}):(l=t.pageX,m=t.pageY,s=function(t){t.preventDefault(),f.pan(_+t.pageX-l,y+t.pageY-m,$)}),e(u).off(g).on(o,s).on(a,function(t){t.preventDefault(),e(this).off(g),f.panning=!1,t.type="panzoomend",f._trigger(t,v,!n(v,b))})}},e.Panzoom=a,e.fn.panzoom=function(t){var n,i,s,o;return"string"==typeof t?(o=[],i=f.call(arguments,1),this.each(function(){n=e.data(this,m),n?"_"!==t.charAt(0)&&"function"==typeof(s=n[t])&&void 0!==(s=s.apply(n,i))&&o.push(s):o.push(void 0)}),o.length?1===o.length?o[0]:o:this):this.each(function(){new a(this,t)})},a});
!function(){"use strict";var t=angular.module("itgwo");t.controller("itgwo.controller.anekdotes",["$scope","$controller","$state","$http","$rootScope","config","itgwo.service.notification",function(t,o,a,e,n,i,c){e.get(i.api.url+"anekdotes/"+a.params.id,{cache:!0}).then(function(o){t.anekdote=o.data.data,n.title=o.data.data.attributes.title})["catch"](function(t){c.notification(t.data)}),angular.extend(this,o("itgwo.controller.base",{$scope:t}))}])}();
!function(){"use strict";var t=angular.module("itgwo");t.controller("itgwo.controller.base",["$http","$scope","$state","$stateParams","$controller","$location","$rootScope","config","FoundationApi","itgwo.service.notification","itgwo.service.httpInterceptor",function(t,e,o,r,n,a,i,c,s,u,p){return i.title=o.current.data.vars.title,i.config=c,i.isLoading=function(){return p.isLoading()},e.contenttypeToRoute=function(t){var e={onderwerpen:"onderwerp",programmas:"programmaItem",anekdotes:"anekdote",themas:"thema"};return e[t]},e.contenttypeToSingular=function(t){var e={onderwerpen:"onderwerp",programmas:"programma",anekdotes:"anekdote",themas:"thema"};return e[t]},e.range=function(t,e,o){o=o||1;for(var r=[],n=t;e>=n;n+=o)r.push(n);return r},e}])}();
!function(){"use strict";var t=angular.module("itgwo");t.controller("itgwo.controller.berichten",["$scope","$controller","$state","$http","$rootScope","config","itgwo.service.notification",function(t,e,i,a,o,c,n){a.get(c.api.url+"berichten/"+i.params.id,{cache:!0}).then(function(e){t.bericht=e.data.data,t.bericht.attributes.image.thumbnail=t.bericht.attributes.image.thumbnail.replace("240x240","752x564")})["catch"](function(t){n.notification(t.data)}),angular.extend(this,e("itgwo.controller.base",{$scope:t}))}])}();
!function(){"use strict";var t=angular.module("itgwo");t.controller("itgwo.controller.home",["$scope","$controller","$state","$http","config","itgwo.service.notification",function(t,e,o,n,i,a){n.get(i.api.url+"berichten?"+jQuery.param({"page[size]":10}),{cache:!0}).then(function(e){t.berichten=e.data.data})["catch"](function(t){a.notification(t.data)}),angular.extend(this,e("itgwo.controller.base",{$scope:t}))}])}();
!function(){"use strict";var o=angular.module("itgwo");o.controller("itgwo.controller.plattegrond",["$scope","$controller","$state","$http","$rootScope","config","itgwo.service.notification",function(o,t,n,e,r,i,c){$(".panzoom-parent").panzoom({contain:"invert",minScale:1}),angular.extend(this,t("itgwo.controller.base",{$scope:o}))}])}();
!function(){"use strict";var t=angular.module("itgwo");t.controller("itgwo.controller.programma",["$scope","$controller","$state","$http","$rootScope","config","itgwo.service.notification",function(t,e,a,i,n,o,r){t.filter="vr",a.params.id?i.get(o.api.url+"programmaonderdelen/"+a.params.id,{cache:!0}).then(function(e){t.onderdeel=e.data.data,t.onderdeel.attributes.image.thumbnail=t.onderdeel.attributes.image.thumbnail.replace("240x240","752x564"),n.title=e.data.data.attributes.name})["catch"](function(t){r.notification(t.data)}):i.get(o.api.url+"speeltijden?"+jQuery.param({"page[size]":1e3,sort:"title"}),{cache:!0}).then(function(e){t.speeltijden=e.data.data})["catch"](function(t){r.notification(t.data)}),angular.extend(this,e("itgwo.controller.base",{$scope:t}))}])}();
!function(){"use strict";var r=angular.module("itgwo");r.factory("itgwo.service.httpInterceptor",["$q","$window",function(r,n){var t=0;return{request:function(r){return t++,r},response:function(r){return t--,r},responseError:function(n){return t--,r.reject(n)},isLoading:function(){return 0!=t}}}])}();
!function(){"use strict";var i=angular.module("itgwo");i.service("itgwo.service.notification",["config","$filter","$http","FoundationApi",function(i,t,o,n){this.notification=function(i){n.publish("notifications",{title:"Error: "+i.errors.title,content:i.errors.detail,color:"alert"})}}])}();
>>>>>>> 2a9674017efcf8b7bce9557277dd46f994b60315
