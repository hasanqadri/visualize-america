var init = 0;
var chart = null
function drawPastOccupancies(data, past_senators) {

    var dataArr = Object.values(past_senators)
    var dataArrKeys = Object.keys(past_senators)
    if (init == 1) {
        updateOccupancies(dataArr);
    } else {
        init = 1;

        var width = 500,
            height = 75


        var spacer = 60
        var current = 0

        chart = d3.select("#chartz")
            .attr("width", width)
            .attr("height", height)
            .style("display", 'block')
            .style('margin', 'auto')
            .style('preserveAspectRatio', 'xMidYMid')

        chart.selectAll('rect').data(dataArr)
            .attr('id', 'occupancyRect')
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return current += spacer
            })
            .attr("y", 25)
            .attr("width", 60)
            .attr("height", 50)
            .attr('fill', function (d) {
                if (d == 'R') {
                    return "#99000d"
                } else if (d == 'D') {
                    return "#084594"
                } else {
                    return "#238b45"
                }
            })
            .style("stroke", "#f7fcff")
            .style("stroke-width", 2)

        spacer = 60
        current = 15
        chart.selectAll('text').data(dataArrKeys)
            .attr('id', 'occupancyText')
            .enter()
            .append("text")
            .attr("x", function (d) {
                console.log(dataArrKeys);
                return current += spacer
            })
            .attr("y", 52)
            .attr('fill', function (d) {
                return "#f7fcff"
            })
            .text(function (d) {
                return d;
            })
    }
}

function updateOccupancies(dataArr) {
    count = 0;
    chart.selectAll("rect").data(dataArr).transition().style('fill', function (d) {
        if (d == 'R') {
            return "#99000d"
        } else if (d == 'D') {
            return "#084594"
        } else {
            return "#238b45"
        }
    }).duration(1000)

}