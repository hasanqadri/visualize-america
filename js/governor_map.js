governor_map();
house_map();
senate_map();
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
            return '#cb181d'
        }
    }
}

function senate_map() {
    var width = 1500,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.senate')
        .attr('width', width)
        .attr('height', height);

    var usD = null;
    var senateD = null;
    var rcpD = null;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-senate.json")
        .defer(d3.json, "./Data/rcp-senate-abbr.json")
        .await(ready);

    function ready(error, us, senate, rcp) {
        usD = us;
        senateD = senate;
        rcpD = rcp;
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", initialState)
            .attr("stroke", '#fff')

        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("r", 4)
            .attr("fill", initialStateCircle)
            .style('stroke', 'black')
            .style('stroke-width', 1);

    }
    function initialState(d) {
        /**var dualStates = ['NV', 'CO',  'MT', 'ND', 'WI', 'MO', 'IN', 'OH', 'WV', 'PA', 'ME', 'AL', 'FL'];
        for (var z = 0; z < dualStates.length; z++) {
            if (d.properties.STATE_ABBR === dualStates[z]) {
                return '#9c1ecb'
            }
        }
        **/
        console.log(rcpD[0].state)
        for (var x = 0; x < 20; x++) {
            if (d.properties.STATE_ABBR === rcpD[x].state) {
                if (senateD.results[0].members[x].party === "D") {
                    return '#084594'
                } else {
                    return '#cb181d'
                }
            }
        }
        return '#807d85'
    }

    function initialStateCircle(d) {
        for (var x = 0; x < senateD.results[0].members.length; x++) {
            if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
                if (senateD.results[0].members[x].party === "D") {
                    return '#084594'
                } else {
                    return '#cb181d'

                }
            }
        }
        return '#807d85'
    }
}
