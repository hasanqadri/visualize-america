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
function federal_balance() {
    document.getElementById("federalBalance").innerHTML = 'State Leanings';

    //Width and height of map
    var width = d3.select('#right-alt').node().getBoundingClientRect().width-20;
    var height = 300;

    // D3 Projection
    var projection = d3.geo.albersUsa()
        .translate([width/2, height/2])    // translate to center of screen
        .scale([550]);          // scale things down so see entire US

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
    console.log('called')
    var xOrigin=  1380
    var yOrigin = 500
    var x = 0;
    var y = 0;
    //0,0 is top left. 0,height is bot left. width,0 is top right.
    $('.balance').each(function(i, obj) {
        if (obj.id == 'NY') {
            console.log(obj.id)
            console.log(obj.getBoundingClientRect())
        } else if (obj.id == 'MA') {
            console.log(obj.id)
            console.log(obj.getBoundingClientRect())
        } else if (obj.id == 'ME') {
            console.log(obj.id)
            console.log(obj.getBoundingClientRect())
        } else if (obj.id == 'VA') {
            console.log(obj.id)
            console.log(obj.getBoundingClientRect())
        }
        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        str = '#' + obj.id;
        d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin - x) + ',' + (yOrigin - y) +')').duration(500);

    });

}

/**
 * Place states according to lead and occupancy
 */
function pollingPlacement(methodCall) {
    console.log('called2')
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
    svg.selectAll('.balance').duration(500).attr('fill', methodCall);
    $('.balance').each(function (i, obj) {
        map = null
        map = assistUpdate(obj.id)
        str = '#' + obj.id;
        if (map == undefined || map == null) {
            //var curr_tran = d3.selectAll(str).transition().attr('transform', 'translate(0, -500)').duration(500)
            d3.selectAll(str).transition().attr('opacity', "0").duration(500)
        } else {
            map['obj'] = obj
            x = obj.getBoundingClientRect().x;
            y = obj.getBoundingClientRect().y;
            console.log(x)
            console.log(y)
            if (map['party'] === 'R') {
                if (map['lead'] > 20) {
                    repArr20.push([x,y, str, obj])
                } else if (map['lead'] > 10) {
                    repArr10.push([x,y, str, obj]);
                } else if (map['lead'] > 5) {
                    repArr5.push([x,y, str, obj]);
                } else {
                    repArr.push([x,y, str, obj]);
                }
            } else if (map['party'] === 'D') {
                if (map['lead'] > 20) {
                    demArr20.push([x,y, str, obj])
                } else if (map['lead'] > 10) {
                    demArr10.push([x,y, str, obj]);
                } else if (map['lead'] > 5) {
                    demArr5.push([x,y, str, obj]);
                } else {
                    demArr.push([x,y, str, obj]);
                }
            } else {
                indArr.push([x,y, str, obj]);
            }
        }
    });
    console.log(demArr20)
    console.log(demArr10)
    console.log(demArr5)
    console.log(demArr)
    console.log(repArr)
    console.log(repArr5)
    console.log(repArr10)
    console.log(repArr20)

    var sect = document.getElementById("raceDropdown");
    selectedOption = sect.options[sect.selectedIndex].value;
    if (selectedOption == 'United States Governor') {
        fillingSenBuckets(methodCall);
    } else if (selectedOption == 'United States Senator') {
        fillingGovBuckets(methodCall);
    } else if (selectedOption == 'Default') {
        fillingDefBuckets(methodCall);
    }

}

function fillingSenBuckets(methodCall) {
    var xOrigin = 1380
    var yOrigin = 700
    var x = 0;
    var y = 0;
    var z = 0
    var curr_tran0 = null;
    var curr_tran1 = null;
    var curr_tran2 = null;
    var curr_tran3 = null;
    var curr_tran3 = null;
    var curr_tran4 = null;
    var curr_tran5 = null;
    var curr_tran6 = null;
    var curr_tran7 = null;


    for (z = 0; z < demArr20.length; z++) {
        $('.balance').each(function (i, obj) {

            if (demArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -350 + ',' + (600 - y) +')').duration(500);
                curr_tran0.transition().attr('fill', methodCall).duration(500)
                curr_tran0.transition().attr('opacity', 1).duration(500)
            }
        });
    }
}


function fillingGovBuckets(methodCall) {
    var xOrigin = 1380
    var yOrigin = 700
    var x = 0;
    var y = 0;
    var z = 0
    var curr_tran0 = null;
    var curr_tran1 = null;
    var curr_tran2 = null;
    var curr_tran3 = null;
    var curr_tran4 = null;
    var curr_tran5 = null;
    var curr_tran6 = null;
    var curr_tran7 = null;


    for (z = 0; z < demArr20.length; z++) {
        $('.balance').each(function (i, obj) {

            if (demArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -350 + ',' + (600 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -300 + ',' + (600 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -250 + ',' + (600 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -150 + ',' + (600 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ 50 + ',' + (600 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ 150 + ',' + (500 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

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
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ 250 + ',' + (500 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }

    for (z = 0; z < repArr20.length; z++) {
        $('.balance').each(function (i, obj) {

            if (repArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                if (x < 1400) {
                    xOrigin = 0;
                    yOrigin = 0
                }
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ 350 + ',' + (500 - y) +')').duration(500).transition().attr('fill', methodCall).duration(500).transition().attr('opacity', 1).duration(500)
            }
        });
    }
}


function fillingDefBuckets(methodCall) {
    var xOrigin = 1380
    var yOrigin = 700
    var x = 0;
    var y = 0;
    var z = 0
    var curr_tran0 = null;
    var curr_tran1 = null;
    var curr_tran2 = null;
    var curr_tran3 = null;
    var curr_tran4 = null;
    var curr_tran5 = null;
    var curr_tran6 = null;
    var curr_tran7 = null;


    for (z = 0; z < demArr20.length; z++) {
        $('.balance').each(function (i, obj) {

            if (demArr20[z][2] == '#' +obj.id) {
                x = obj.getBoundingClientRect().x
                y = obj.getBoundingClientRect().y
                str = '#' + obj.id;
                curr_tran0 = d3.selectAll(str).transition().attr('transform', 'translate('+ -350 + ',' + (600 - y) +')').duration(500);
                curr_tran0.transition().attr('fill', methodCall).duration(500)
            }
        });
    }
}

function updateGraph(methodCall) {
    var svg = d3.select('#federal-balance').transition();

    svg.selectAll('.balance').attr('fill', methodCall).duration(500);
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
    xAxisGroup.append('text').attr("transform", "translate(" + (width/2) + " ," + 35 + ")").style("text-anchor", "middle").text("Left to Right Leaning").attr('stroke', '#807d85');
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
    } else {
        console.log("bug")
    }
}