function federal_balance() {
    document.getElementById("federalBalance").innerHTML = 'State Balance';

    //Width and height of map
    var width = 350;
    var height = 300;

    // D3 Projection
    var projection = d3.geo.albersUsa()
        .translate([width/2, height/2])    // translate to center of screen
        .scale([400]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
        .projection(projection);  // tell path generator to use albersUsa projection

    //SVG width and height
    var svg = d3.select('#federal-balance')
        .attr('width', width)
        .attr('height', height)

    d3.json("./Data/us-states.json", function(json) {
        console.log(json)
        //Bind the party lean value to each state
        for (var x = 0; x <json.features.length; x++) {

    }
    var countX = 0;
    var countY = 0;


    svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('id', function(d) { return state_fullD[d.properties['name']]})
        .attr("d", path)
        .attr('initialTransform', 'translate(0,0)')
        .style("stroke", "#fff")
        .style("stroke-width", "1");
    d3.select('#AL').transition().attr('transform', 'translate(0,' + 50 +')').duration(3000);
    });
    //Create the Scale we will use for the Axis
    var axisScale = d3.scale.linear().domain([0, 100]).range([0, 400]);
    //Create the Axis
    var xAxis = d3.svg.axis().scale(axisScale).orient('bottom');

    //Create an SVG group Element for the Axis elements and call the xAxis function
    //var xAxisGroup = svg.append("g").attr("transform", "translate(0," + (height - 20) + ")").call(xAxis);
}


function getLeadsX() {
    for (var y = 0; y < numSenStates; y++) {
        if (d.properties.STATE_ABBR === rcpsD[y].state) {
            var candidates = getCandidatesAndLead(rcpsD[y]);
        }
    }
}