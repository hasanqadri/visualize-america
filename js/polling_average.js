var svg = null
function drawPollingAverage(dataset) {
    if (svg !== null) {
        svg = d3.select('.polling-average').transition(2000)
    }
    console.log(dataset)
    var pie = d3.layout.pie()
        .value(function (d) {
            return d.percent
        })
        .sort(null)
        .padAngle(.03);

    var w = 200, h = 200;

    var outerRadius = w / 2;
    var innerRadius = 80;

    var color = d3.scale.ordinal()
        .range(["#c5111e", "#1110a6"]);

    var arc = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    svg = d3.select(".polling-average")
        .attr({
            width: w,
            height: h,
            class: 'shadow'
        }).append('g')
        .attr({
            transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
        });

    var path = svg.selectAll('path')
        .data(pie(dataset['niceTry']))
        .enter()
        .append('path')
        .attr({
            d: arc,
            fill: function (d, i) {
                return color(d.data.name);
            }
        });

    var text = svg.selectAll('text')
        .data(pie(dataset['niceTry']))
        .enter()
        .append("text")
        .transition()
        .duration(200)
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".4em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.data.percent;
        })
        .style({
            fill: '#f7fcff',
            'font-size': '10px'
        });

}