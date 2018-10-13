


function createLegend() {
    //Create a legend
    // Define linear scale for output
    var color = d3.scale.linear()
        .range([strongDem, weakDem, leanDem, indep, leanRep, weakRep, strongRep, "#737373", "#bdbdbd"]);
    color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8]); // setting the range of the input data

    var legendText = ["Strongly Democrat", "Likely Democrat", "Lean Democrat", "Independent",  "Lean Republican", "Likely Republican", "Strong Republican", "No Election", "No Data",];

    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    legend = d3.select(".innerContainer").append("svg")
        .attr("class", "legend")
        .attr("width", 140)
        .attr("height", 200)
        .selectAll("g")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        })
        .style('visibility', 'hidden');

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .data(legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
            return d;
        });
}


function checkLegend() {
    if (selectedOption =='Default') {
        legend.remove();
        // Define linear scale for output
        var color = d3.scale.linear()
            .range([strongDem, weakDem, leanDem,  indep, leanRep, weakRep, strongRep, "#737373", "#bdbdbd"]);
        color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8]); // setting the range of the input data

        var legendText = ["Strongly Democrat", "Likely Democrat", "Lean Democrat", "Independent",  "Lean Republican", "Likely Republican", "Strong Republican", "No Election", "No Data",];

        // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
        legend = d3.select("body").append("svg")
            .attr("class", "legend")
            .attr("width", 140)
            .attr("height", 200)
            .selectAll("g")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .style('visibility', 'hidden');
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .data(legendText)
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return d; });
    } else {
        if (currentMapChecked) {
            legend.remove();
            // Define linear scale for output
            if (getView() == 'United States Governor') {
                var color = d3.scale.linear()
                    .range([indep,strongRep,strongDem ]);
                color.domain([1,2,3]); // setting the range of the input data

            } else {
                var color = d3.scale.linear()
                    .range([mixed, indep, strongRep, strongDem]);
                color.domain([0, 1, 2, 3]); // setting the range of the input data
            }
            var legendText = ["Mixed", "Independent", "Republican", "Democrat"];

            // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
            legend = d3.select("body").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .selectAll("g")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .data(legendText)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function(d) { return d; });
        } else {

            legend.remove();
            // Define linear scale for output
            var color = d3.scale.linear()
                .range([strongDem, weakDem, leanDem, indep, leanRep, weakRep, strongRep, "#737373", "#bdbdbd"]);
            color.domain([0, 1, 2, 3, 4, 5, 6, 7, 8]); // setting the range of the input data

            var legendText = ["Strongly Democrat", "Likely Democrat", "Lean Democrat", "Independent",  "Lean Republican", "Likely Republican", "Strong Republican", "No Election", "No Data",];

            // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
            legend = d3.select("body").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .selectAll("g")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .data(legendText)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d;
                });
        }
    }
}

/**
 * Create tooltip
 */
function createTooltip() {
//Create a tooltip
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

function checkIncumbent(svg) {
    if (checked == true) {
        if (section === "United States Senator") {
            svg.selectAll('circle').duration(2000).attr('fill', senateCircle);
            svg.selectAll('circle').duration(2000).style('stroke', senateCircleBorders);
        } else if (section === "United States Governor") {
            svg.selectAll('circle').duration(2000).attr('fill', governorCircle);
            svg.selectAll('circle').duration(2000).style('stroke', governorCircleBorders);
        } else {
            svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
            svg.selectAll('circle').duration(2000).style('stroke', determineStateColor);
        }
    } else {
        svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
        svg.selectAll('circle').duration(2000).style('stroke', determineStateColor);
    }
}


/**
 * Iterates over every state and changes the transparency to .5 to everything except the selected (hovered over)
 */
function glazeStates(state) {
    if (state == null) {
        //TODO Make all states unglazed

    } else {
        //TODO glaze all states except the selected
    }
}