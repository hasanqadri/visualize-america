function drawPastOccupancies(data, past_senators) {
    if (svg !== null) {
        d3.selectAll('#occupancyText').remove()
        d3.selectAll('#occupancyRect').remove()
    }
    var dataArr = Object.values(past_senators)
    var dataArrKeys = Object.keys(past_senators)
    console.log(dataArr)
    var width = 525,
        height = 75


    var spacer= 60
    var current = 0
//console.log(d3.sum(data));

    var chart = d3.select("#chartz")
        .attr("width", width)
        .attr("height", height)
        .style("display",'block')
        .style('margin','auto')
        .style('preserveAspectRatio', 'xMidYMid')

    chart.selectAll('rect').data(dataArr)
        .attr('id', 'occupancyRect')
        .enter()
        .append("rect")
        .attr("x", function(d){return current += spacer})
        .attr("y", 25)
        .attr("width", 60)
        .attr("height", 50)
        .attr('fill', function(d){ return d == 'R' ? "#c5111e" : "#1110a6"})
        .style("stroke", "#f7fcff")
        .style("stroke-width", 2)

    spacer = 60
    current = 15
    chart.selectAll('text').data(dataArrKeys)
        .attr('id', 'occupancyText')
        .enter()
        .append("text")
        .attr("x", function(d){return current += spacer})
        .attr("y", 52)
        .attr('fill', function(d){ return "#f7fcff"})
        .text(function(d) { return d;})

}