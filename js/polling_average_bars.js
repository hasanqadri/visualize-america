var svg = null;
var data = null;
function drawPollingAverageBars(dataset, fake) {
    if (fake) {
        if (svg !== null) {
            d3.select('#do').remove()
        }
        return;
    }
    if (svg !== null) {
        d3.select('#do').remove()
    }
    //sort bars based on value
    data = dataset['niceTry'].sort(function (a, b) {
        return d3.ascending(a.percent, b.percent);
    })

    //set up svg using margin conventions - we'll need plenty of room on the left for labels
    var margin = {
        top: 15,
        right: 25,
        bottom: 15,
        left: 80
    };

    var width = 400 - margin.right,
        height = 100 - margin.top - margin.bottom;

    svg = d3.select(".polling-average-bars").append("svg")
        .attr('id', 'do')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("display", 'block')
        .style('margin', 'auto')
        .style('preserveAspectRatio', 'xMidYMid')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")



    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.percent;
        })]);

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function (d) {
            return d.name;
        }));

    //make y axis to show bar names
    var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    //append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.percent);
        })
        .attr('fill', function (d) {
            if (d.party == "I") {
                return indep;
            }
            return d.party == 'R' ? strongRep : strongDem
        });

    //add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.percent) + 5;
        })
        .text(function (d) {
            return d.percent +'%';
        });
}

