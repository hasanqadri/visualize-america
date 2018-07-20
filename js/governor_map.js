governor_map();
governorCount = 0;
function governor_map()
{
    var width = 1500,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.governor')
        .attr('width', width)
        .attr('height', height);

    var usD = null;
    var governorD = null;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-governor.json")
        .await(ready);

    function ready(error, us, governor) {
        if (error) throw error;
        usD = us;
        governorD = governor;
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", initialState)
    }

    function initialState(d) {
        for (var x = 0; x < governorD.length; x++) {
            if (d.properties.STATE_ABBR === governorD[x].state_code) {
                if (governorD[x].party === "democrat") {
                    return '#084594'
                } else if (governorD[x].party === "republican") {
                    return '#cb181d'
                } else {
                    return '#22cb30'
                }
            }
        }
        return '#bbb';
    }
}


