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

