var state_fullD =null;

function federal_balance() {
    document.getElementById("federalBalance").innerHTML = 'State Balance';

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
        .defer(d3.json, "./Data/us-states.json")
        .defer(d3.json, "./Data/state-abbr2.json")
        .await(readyData);


    function readyData(error, json, state_full) {
        if (error) throw error;

        state_fullD = state_full;
        //Bind the party lean value to each state
        for (var x = 0; x <json.features.length; x++) {

        }

        svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('id', function(d) { return state_fullD[d.properties['name']]})
            .attr("d", path)
            .attr('initialTransform', 'translate(0,0)')
            .attr('fill', determineStateColor)
            .style("stroke", "#fff")
            .style("stroke-width", "1");
        d3.select('#AL').transition().attr('transform', 'translate(0,' + 50 +')').duration(3000);
    }
    //Create the Scale we will use for the Axis
    var xLine = d3.select('#x-axis')
        .attr('width', width)
        .attr('height', 45)
        .style("display", 'block')
        .style('margin', 'auto')
        .style('preserveAspectRatio', 'xMidYMid');

    var axisScale = d3.scale.linear().domain([-20, 20]).range([0, width]);
    //Create the Axis
    var xAxis = d3.svg.axis().scale(axisScale).orient('bottom');

    //Create an SVG group Element for the Axis elements and call the xAxis function
    var xAxisGroup = xLine.append("g").attr('class', 'axisGray').call(xAxis);
    xAxisGroup.append('text').attr("transform", "translate(" + (width/2) + " ," + 35 + ")").style("text-anchor", "middle").text("Left to Right Leaning").attr('stroke', '#807d85');
    }


function getLeadsX() {
    for (var y = 0; y < numSenStates; y++) {
        if (d.properties.STATE_ABBR === rcpsD[y].state) {
            var candidates = getCandidatesAndLead(rcpsD[y]);
        }
    }
}