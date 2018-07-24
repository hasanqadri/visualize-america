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
    var row = 1;
    //0,0 is top left. 0,height is bot left. width,0 is top right.
    $('.balance').each(function(i, obj) {

        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        str = '#' + obj.id;
        d3.selectAll(str).transition().attr('transform', 'translate('+ (xOrigin - x) + ',' + (yOrigin - y) +')').duration(500);
        xOrigin = xOrigin + 76
        if (row % 7 == 0) {
            row = 1
            yOrigin = yOrigin + 15
            xOrigin = 1380
        }
        row++;

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
        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        map = null
        map = assistUpdate(obj.id)
        str = '#' + obj.id;
        console.log(obj.getBoundingClientRect().x)
        if (map == undefined || map == null) {
            var curr_tran = d3.selectAll(str).transition().attr('transform', 'translate(0, -500)').duration(500)
            curr_tran.transition().attr('fill', "#fff").duration(500)
        } else {
            map['obj'] = obj
            console.log(map)
            if (map['party'] === 'R') {
                if (map['lead'] > 20) {
                    repArr20.push([x,y, str])
                } else if (map['lead'] > 10) {
                    repArr10.push([x,y, str]);
                } else if (map['lead'] > 5) {
                    repArr5.push(map[x,y, str]);
                } else {
                    repArr.push([x,y, str]);
                }
            } else if (map['party'] === 'D') {
                if (map['lead'] > 20) {
                    demArr20.push([x,y, str])
                } else if (map['lead'] > 10) {
                    demArr10.push([x,y, str]);
                } else if (map['lead'] > 5) {
                    demArr5.push([x,y, str]);
                } else {
                    demArr.push([x,y, str]);
                }
            } else {
                indArr.push([x,y, str]);
            }
        }
    });
    console.log(demArr20)
    console.log(demArr10)
    console.log(demArr5)
    console.log(demArr)


    fillingBuckets(methodCall);

}

function fillingBuckets(methodCall) {
    var xOrigin = 1300
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

    console.log(demArr20)
    for (z = 0; z < demArr20.length; z++) {

        x = demArr20[z][0]
        y = demArr20[z][1]
        curr_tran0 = d3.selectAll(demArr20[z][2]).transition().attr('transform', 'translate('+ (xOrigin - x) + ',' + (yOrigin - y) +')').duration(500);
        curr_tran0.transition().attr('fill', methodCall).duration(500)
    }


    xOrigin = 1480
    yOrigin = 640
    x = 0;
    y = 0;
    for (z = 0; z < demArr10.length; z++) {
        x = demArr10[z][0]
        y = demArr10[z][1]
        curr_tran1 = d3.selectAll(demArr10[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran1.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160    }

    xOrigin = 1480
    yOrigin = 640
    x = 0;
    y = 0;
    for (z = 0; z < demArr5.length; z++) {

        x = demArr5[z][0]
        y = demArr5[z][1]
        curr_tran2 = d3.selectAll(demArr5[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran2.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
    }

     xOrigin = 1480
     yOrigin = 640
     x = 0;
     y = 0;
    for (z = 0; z < demArr.length; z++) {

        x = demArr[z][0]
        y = demArr[z][1]
        curr_tran3 = d3.selectAll(demArr[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran3.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
    }


     xOrigin = 1780
     yOrigin = 740
     x = 0;
     y = 0;
    for (z = 0; z < repArr.length; z++) {

        x = repArr[z][0]
        y = repArr[z][1]
        curr_tran4 = d3.selectAll(repArr[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran4.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
    }

    xOrigin = 1780
    yOrigin = 740
    x = 0;
    y = 0;
    for (z = 0; z < repArr5.length; z++) {
        x = repArr[z][0]
        y = repArr[z][1]
        curr_tran5 = d3.selectAll(repArr5[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran5.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
    }

    xOrigin = 1780
    yOrigin = 740
    x = 0;
    y = 0;
    for (z = 0; z < repArr.length; z++) {
        x = repArr[z][0]
        y = repArr[z][1]
        curr_tran6 = d3.selectAll(repArr10[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran6.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
    }

    xOrigin = 1780
    yOrigin = 740
    x = 0;
    y = 0;
    for (z = 0; z < repArr20.length; z++) {
        console.log(repArr20[z][0])
        console.log(repArr20[z][1])
        console.log(repArr20[z][2])

        x = repArr20[z][0]
        y = repArr20[z][1]
        curr_tran7 = d3.selectAll(repArr20[z][2]).transition().attr('transform', 'translate(' + (xOrigin - x) + ',' + (yOrigin - y) + ')').duration(500);
        curr_tran7.transition().attr('fill', methodCall).duration(500)
        yOrigin = yOrigin - 60
        xOrigin = xOrigin - 160
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