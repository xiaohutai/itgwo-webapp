/**
 * (C) Timetable code was orignally created by the Lowlove crew: http://www.lowlove.nl,
 * and is used with permission. Modifications for ITGWO, by Bob den Otter - bob@twokings.nl
 */

var utils = function(){

    // var dataUrl = '/blokkenschema/program.json';
    var dataUrl = 'http://programma.greatwideopen.nl/json/speeltijden?page[size]=400';
    //var dataUrl = 'program.json';
    var data = null;



    function loadData(callback){
        $.getJSON(dataUrl, null, function(json, status){
            data = json.data;
            callback(json, status);
        })
    }


    function getProgram(day, config){
        day = day || currentDay;

        var program = [];

        for (i=0; i < data.length; i++) {
            if (data[i].attributes.starttijd) {

                start = new Date( Date.parse(data[i].attributes.starttijd) );
                lower = new Date( Date.parse(config.dates[day-1].starttime) );
                upper = new Date( Date.parse(config.dates[day-1].endtime) );
                if (lower < start && start < upper  ) {
                    program.push(data[i].attributes);
                }
            }
        }

        return program;

    }

    return {
        loadData : loadData,
        getProgram : getProgram
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



var timetable = function(utils){

    var root, container, scrollcontainer, locations, blocks, nav, popup = null;
    // var data = null;
    var modificationDate = null;
    var currentDay = 1;
    var supportsTouch = false;

    var options = {
        width: 180 // width of 1 hour
    };

    var config = null


    var dragging = false;
    var mql = null;

    function init(gwoconfig){

        config = gwoconfig;

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
        for(var index in config.dates){
            var dayId = config.dates[index].shortname;
            var link = $('<a></a>');
            link.click(onSwitchDay);
            link.html( config.dates[index].shortname );
            link.attr({
                'href' : '#',
                'data-day' : 1 + parseInt(index)
            });
            if(parseInt(index)+1 == currentDay){
                link.addClass('selected');
            }
            nav.append(link);
        }

        // get all the right sizes for the buildup
        size = sizes();

        // get program and start time of current day
        dayData = utils.getProgram(day, config);
        dayStartTime = new Date( config.dates[day-1]['starttime'] );
        dayEndTime = new Date( config.dates[day-1]['endtime'] );
        totalHours = Math.ceil( (dayEndTime - dayStartTime) / 3600000 );
        totalWidth = totalHours * size.hour;

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

            locations.html('');

            // loop over all locations
            for(var index in config.locations){
                // get the current location
                locData = config.locations[index];
                // the row will contain all the acts and the background
                row = $('<div class="row"></div>');
                row.css({
                    width: totalWidth + size.hour
                });

                // these layers will be on top of each other
                backgroundLayer = $('<div class="layer"></div>');
                actsLayer = $('<div class="layer"></div>');

                // add a div for each hour; draw the background dynamically
                time = new Date(dayStartTime.getTime());
                for(var i = 0; i <= totalHours; i++){
                    time.setHours( time.getHours() + 1 );
                    backgroundLayer.append( $('<div class="hour"></div>').css({ width : size.hour }) );
                }

                // find acts for this location on the current day and add them to the top layer
                actsOnLocation = Finder.findBy(dayData, 'speellokatie', locData.locationId)

                console.log("Acts: ", actsOnLocation, locData.locationId);
                for(var i = 0, l = actsOnLocation.length; i < l; i++){
                    actData = actsOnLocation[i];

                    // showData = utils.getAct( actData.contentId );

                    startTime = new Date( actData.starttijd );
                    endTime = new Date();
                    endTime.setTime( startTime.getTime() + (actData.lengte * 60000) );

                    act = $('<a class="act"></a>')
                    act.css({
                        // offset left is the numbers of minutes from day start time times the size per minute
                        left: ( (startTime - dayStartTime) / 60000 ) * size.minute,
                        // width is duration in minutes times the size per minute
                        width: ( (endTime - startTime) / 60000 ) * size.minute
                    });
                    act.attr({
                        'data-programmaonderdelen' :  actData.programmaonderdelen,
                        'title' : actData.title,
                        'href' : '#!/onderdeel/' + actData.programmaonderdelen,
                        'ui-sref': "onderdeel({ id: " + actData.programmaonderdelen + " })"
                    });
                    // act.click(onShowProgramItem);

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
                    if (actData.class) {
                        act.addClass(actData.class);
                    }

                    // Voeg de slug als extra class toe.
                    act.addClass('act-' + actData.slug);

                    act.append( name );
                    actsLayer.append( act );

                }

                // finaly add the last layer with the location
                location = $('<div class="location"></div>');
                location.html( locData.abbr );
                location.attr({
                    title : locData.title
                });


                if (actsOnLocation.length) {
                    // Er zijn acts. Toon ze..
                    row.append(backgroundLayer);
                    row.append(actsLayer);
                    blocks.append( row );
                    locations.append(location);
                }
            }

            blocks.fadeIn(400);
        });
    }

    function onShowProgramItem(e){
        e.preventDefault();
        if(dragging) return;
        //showProgramItem( parseInt( $(this).attr('data-act') ) );
        console.log('this', $(this).attr('data-programmaonderdelen'));
        // showProgramItem( parseInt( $(this).attr('data-programmaonderdelen') ) );
    }

    function showProgramItem(id){
        console.log('id', id);
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

