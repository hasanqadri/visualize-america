var state_fullD =null;
var x = 0;
var y = 0;
var str = ''
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
            .attr('initialTransform', function(d) { return 'transition(0,0)';})
            .attr('fill', determineStateColor)
            .style("stroke", "#fff")
            .style("stroke-width", "1");
        /**
        var route = svg.append('path')
            .datum({type: "LineString", coordinates: [origin, destination]})
            .attr("class", "route")
            .attr("d", path);
        **/
        // d3.select('#AL').transition().attr('transform', 'translate(0,' + -50 +')').duration(3000);
        initialPlacement()
    }

    createScale(width);
    }


function getLeadsX() {
    for (var y = 0; y < numSenStates; y++) {
        if (d.properties.STATE_ABBR === rcpsD[y].state) {
            var candidates = getCandidatesAndLead(rcpsD[y]);
        }
    }
}

/**
 * Array array of default positions for each state
 * {'AZ':{x:0, y:0}},
 */

function initialPlacement() {
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

    var x = 0;
    var y = 0;
    var row = 1;
    var map = null
    var svg = d3.select('#federal-balance').transition();
    svg.selectAll('.balance').duration(500).attr('fill', methodCall);
    $('.balance').each(function(i, obj) {
        x = obj.getBoundingClientRect().x;
        y = obj.getBoundingClientRect().y;
        map = assistUpdate(obj.id)
        if (map == undefined || map == null) {
            str = '#' + obj.id;
            if (y > 0) {
                var curr_tran =d3.selectAll(str).transition().attr('transform', 'translate(0, -500)').duration(500)
                curr_tran.transition().attr('fill', methodCall).duration(500)
            } else {
                var curr_tran = d3.selectAll(str).transition().attr('transform', 'translate(0, 500)').duration(500);
                curr_tran.transition().attr('fill', methodCall).duration(500)
            }
        } else {
            var moveX = 0;
            var moveY = 0;
            str = '#' + obj.id;
            moveXY = calcXY(x, y, map, obj);
            var curr_tran = d3.selectAll(str).transition().attr('transform', 'translate(' + moveXY[0] + ',' + moveXY[1] + ')').duration(3000);
            curr_tran.transition().attr('fill', methodCall).duration(500);
        }
        map = null
    });

}

function calcXY(x, y, map, obj) {
    var xOrigin= 1764
    var yOrigin = 715

    if (currentMapChecked) {

        if (map['party'] =='R') {
            if (obj.id == 'TX') {
                console.log('here')
                return [xOrigin - x + 160, yOrigin - y]
            }
            return [xOrigin - x + 100, yOrigin - y]
        } else {
            return [xOrigin - x - 100, yOrigin - y]
        }
    } else {
        if (map['party'] =='R') {
            return [xOrigin - x + 160, yOrigin - y]
        } else {
            return [xOrigin - x - 160, yOrigin - y]
        }
    }
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