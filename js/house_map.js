

function house_map()
{

    var width = 1500,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(".house")
        .attr("width", width)
        .attr("height", height);

    queue()
        .defer(d3.json, "./Data/us.json")
        .defer(d3.json, "./Data/us-congress-113.json")
        .defer(d3.json, "./Data/us-house.json")
        .await(ready);

    function ready(error, us, congress) {
        if (error) throw error;

        svg.append("defs").append("path")
            .attr("id", "land")
            .datum(topojson.feature(us, us.objects.land))
            .attr("d", path);

        svg.append("clipPath")
            .attr("id", "clip-land")
            .append("use")
            .attr("xlink:href", "#land");

        svg.append("g")
            .attr("class", "districts")
            .attr("clip-path", "url(#clip-land)")
            .selectAll("path")
            .data(topojson.feature(congress, congress.objects.districts).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", initialState)
            .append("title")
            .text(function(d) { return d.id; });

        svg.append("path")
            .attr("class", "district-boundaries")
            .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
            .attr("d", path);

        svg.append("path")
            .attr("class", "state-boundaries")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path);
    }

    d3.select(self.frameElement).style("height", height + "px");

    function initialState(data){
        if(Math.random() > .5) {
            return '#084594'
        } else {
            return '#99000d'
        }
    }
}