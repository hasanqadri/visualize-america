var width = 960,
    height = 500;

var projection = d3.geo.albersUsa()
    .scale(2000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('.senate')
    .attr('width', width)
    .attr('height', height);

d3.json('./Data/us2.json', function(error, us) {
    svg.selectAll('.states')
        .data(topojson.feature(us, us.objects.usStates).features)
        .enter()
        .append('path')
        .attr('class', 'states')
        .attr('d', path)
        .on('mouseover', function(d){
            var name = d.properties.STATE_ABBR;
            return document.getElementById('name').innerHTML=name;
        });
});