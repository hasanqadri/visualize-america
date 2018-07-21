function default_map()
{
    var width = 1500,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.default')
        .attr('width', width)
        .attr('height', height);

    var usD = null;
    var governorD = null;
    var rcpD = null;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .await(ready);

    function ready(error, us) {
        if (error) throw error;
        usD = us;
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", '#807d85')
    }
}