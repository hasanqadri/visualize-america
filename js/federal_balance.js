var state_fullD =null;
var x = 0;
var y = 0;
var str = ''
var demArr = [];
var repArr = [];
var demArr20 = [];
var demArr10 = [];
var demArr5 = [];
var indArr = [];
var repArr5 = [];
var repArr10 = [];
var repArr20 = [];
var xOrigin = 0;
var yOrigin = 0;
var newDict = {}

function federal_balance() {
    document.getElementById("federalBalance").innerHTML = 'State Leanings';

    //Width and height of map
    var width = d3.select('#right-alt').node().getBoundingClientRect().width-40;
    var height = 300;

    // D3 Projection
    var projection = d3.geo.albersUsa()
        .translate([width/2, height/2])    // translate to center of screen
        .scale([450]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
        .projection(projection);  // tell path generator to use albersUsa projection

    //SVG width and height
    var svg = d3.select('#federal-balance')
        .attr('width', width)
        .attr('height', height)
        .style("display", 'block')
        .style('margin', 'auto')
        .style('preserveAspectRatio', 'xMidYMid')

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/state-abbr2.json")
        .await(readyData);


    function readyData(error, us, state_full) {
        if (error) throw error;

        state_fullD = state_full;

        svg.selectAll('path')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'balance')
            .attr('id', function(d) { return d.properties.STATE_ABBR})
            .attr("d", path)
            .attr('fill', determineStateColor)
            .style("stroke", "#fff")
            .style("stroke-width", "1");
        // d3.select('#AL').transition().attr('transform', 'translate(0,' + -50 +')').duration(3000);
        initialPlacement()
    }
    createScale(width);
}

/**
 * Array array of default positions for each state
 * {'AZ':{x:0, y:0}},
 */
function initialPlacement() {
    var xOrigin=  1240
    var yOrigin = 500
    var x = 0;
    var y = 0;
    var transitioning = null
    var row = 0;
    //0,0 is top left. 0,height is bot left. width,0 is top right.
    $('.balance').each(function(i, obj) {
        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        str = '#' + obj.id;
        newDict[str] = [x,y]
        transitioning = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin - x) + ',' + (yOrigin - y) +')').duration(1000);
        row++;
        if (row % 7 == 0) {
            yOrigin += 35;
            row = 0;
            xOrigin = 1240
        }
        xOrigin += 70;

    });
}

/**
 * Place states according to lead and occupancy
 */
function pollingPlacement(methodCall) {
    if (currentMapChecked) { return;}
    var x = 0;
    var y = 0;
    var row = 1;
    var map = null
    var svg = d3.select('#federal-balance').transition();
    demArr = [];
    repArr = [];
    demArr20 = [];
    demArr10 = [];
    demArr5 = [];
    indArr = [];
    repArr5 = [];
    repArr10 = [];
    repArr20 = [];
    svg.selectAll('.balance').duration(1000).attr('fill', methodCall);
    $('.balance').each(function (i, obj) {
        map = null
        map = assistUpdate(obj.id)
        str = '#' + obj.id;
        if (map == undefined || map == null) {
            //var curr_tran = d3.selectAll(str).transition().attr('transform', 'translate(0, -1000)').duration(1000)
            d3.selectAll(str).transition().attr('opacity', "0").duration(1000)
        } else {
            map['obj'] = obj
            x = obj.getBoundingClientRect().x;
            y = obj.getBoundingClientRect().y;

            if (map['party'] === 'R') {
                if (map['lead'] > 20) {
                    repArr20.push([x,y, str, obj, map['lead']])
                } else if (map['lead'] > 10) {
                    repArr10.push([x,y, str, obj, map['lead']]);
                } else if (map['lead'] > 5) {
                    repArr5.push([x,y, str, obj, map['lead']]);
                } else {
                    repArr.push([x,y, str, obj, map['lead']]);
                }
            } else if (map['party'] === 'D') {
                if (map['lead'] > 20) {
                    demArr20.push([x,y, str, obj, map['lead']]);
                } else if (map['lead'] > 10) {
                    demArr10.push([x,y, str, obj, map['lead']]);
                } else if (map['lead'] > 5) {
                    demArr5.push([x,y, str, obj, map['lead']]);
                } else {
                    demArr.push([x,y, str, obj, map['lead']]);
                }
            } else {
                indArr.push([x,y, str, obj]);
            }
        }
    });

    var e = document.getElementById("raceDropdown");
    var selectedOption = e.options[e.selectedIndex].value;
    if (selectedOption == 'Default') {
        fillingDefBuckets(methodCall)
    } else {
        fillingSenBuckets(methodCall);
    }
}

function fillingSenBuckets(methodCall) {
    var xOrigin = 1280
    var yOrigin = 720
    var x = 0;
    var y = 0;
    var z = 0
    var curr_tran0 = null;


    for (z = 0; z < demArr20.length; z++) {
        $('.balance').each(function (i, obj) {
            if (demArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                str = '#' + obj.id;
                if (getView() == 'United States Senator') {
                    if (str == '#NM') {
                        yOrigin -= 30
                    } else if (str == '#CT') {
                        yOrigin += 20
                    }
                } else if (getView() == 'United States Governor') {
                    xOrigin -= 20
                    yOrigin -= 30
                }
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate(' + (xOrigin - newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) + ')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 40;
            }
        });
    }

    xOrigin = 1340
    yOrigin = 730
    for (z = 0; z < demArr10.length; z++) {
        $('.balance').each(function (i, obj) {
            if (demArr10[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;

                if (getView() == 'United States Senator') {
                    if (str == '#RI') {
                        yOrigin += 20
                    } else if (str == '#MI') {
                        yOrigin -= 20
                    }
                } else if (getView() == 'United States Governor') {
                    xOrigin -= 20
                    yOrigin -= 20
                    if (str == '#IL') {
                        xOrigin += 20
                        yOrigin -= 20
                    } else if (str == '#CA') {
                        yOrigin -= 50
                    } else if (str == '#PA') {
                        yOrigin += 40
                    }
                }
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate(' + (xOrigin - newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) + ')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 40;
            }
        });
    }

    xOrigin = 1400
    yOrigin = 740
    for (z = 0; z < demArr5.length; z++) {
        $('.balance').each(function (i, obj) {

            if (demArr5[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 40;

            }
        });
    }

     xOrigin = 1440
     yOrigin = 720
     for (z = 0; z < demArr.length; z++) {
        $('.balance').each(function (i, obj) {

            if (demArr[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 50;

            }
        });
    }

    xOrigin = 1520
    yOrigin = 700
    for (z = 0; z < indArr.length; z++) {
        $('.balance').each(function (i, obj) {
            if (indArr[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 40;

            }
        });
    }

    xOrigin = 1550
    yOrigin = 700
    for (z = 0; z < repArr.length; z++) {
        $('.balance').each(function (i, obj) {

            if (repArr[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 46;

            }
        });
    }

     xOrigin = 1620
     yOrigin = 740
     for (z = 0; z < repArr5.length; z++) {
        $('.balance').each(function (i, obj) {

            if (repArr5[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 89;

            }
        });
    }

    xOrigin = 16260
    yOrigin = 750
    for (z = 0; z < repArr10.length; z++) {
        $('.balance').each(function (i, obj) {
            if (repArr10[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                if (str == '#TX' && getView() == 'United States Governor')
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (600 - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 45;
            }
        });
    }

    xOrigin = 1730
    yOrigin = 720
    for (z = 0; z < repArr20.length; z++) {
        $('.balance').each(function (i, obj) {
            if (repArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', methodCall).duration(1000).transition().attr('opacity', 1).duration(500)
                yOrigin = yOrigin - 40;
            }
        });
    }
}

function fillingDefBuckets(methodCall) {
    var xOrigin=  1240
    var yOrigin = 500
    var x = 0;
    var y = 0;
    var transitioning = null
    var curr_tran0 = null;
    var row = 0;
    //0,0 is top left. 0,height is bot left. width,0 is top right.
    $('.balance').each(function(i, obj) {
        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        str = '#' + obj.id;
        curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin -newDict[str][0]) + ',' + (yOrigin - newDict[str][1]) +')').duration(1000).attr('fill', '#737373').duration(1000).transition().attr('opacity', 1).duration(500);
        row++;
        if (row % 7 == 0) {
            yOrigin += 35;
            row = 0;
            xOrigin = 1240
        }
        xOrigin += 70;
    });
}

function updateGraph(methodCall) {
    var svg = d3.select('#federal-balance').transition();
    svg.selectAll('.balance').attr('fill', methodCall).duration(1000);
}

function createScale(width) {
    //Create the Scale we will use for the Axis
    var xLine = d3.select('#x-axis')
        .attr('width', width)
        .attr('height', 45)
        .style("display", 'block')
        .style('margin', 'auto')
        .style('preserveAspectRatio', 'xMidYMid');

    var axisScale = d3.scale.linear().domain([-20, 20]).range([0, width-10]);
    //Create the Axis
    var xAxis = d3.svg.axis().scale(axisScale).orient('bottom');
    //Create an SVG group Element for the Axis elements and call the xAxis function
    var xAxisGroup = xLine.append("g").attr('class', 'axisGray').attr("transform", "translate(5,0)").call(xAxis);
    xAxisGroup.append('text').attr("transform", "translate(" + (width/2) + " ," + 35 + ")").style("text-anchor", "middle").text("Left to Right Leaning").attr('stroke', '#737373');
}

function assistUpdate(state_abbr) {
    var sect = document.getElementById("raceDropdown");
    selectedOption = sect.options[sect.selectedIndex].value;
    if (selectedOption === "United States Senator") {
        for (var y = 0; y < numSenStates; y++) {
            if (state_abbr === rcpsD[y].state) {
                return getPartyAndLead(rcpsD[y]);
            }
        }
        return null
    } else if (selectedOption === "United States Governor") {
        for (var y = 0; y < numGovStates; y++) {
            if (state_abbr === rcpgD[y].state) {
                return getPartyAndLead(rcpgD[y]);
            }
        }
        return null
    }
}