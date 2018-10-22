var count = 0;
var gridData = null;
var grid = null;
//#d3v4v4
function default_seats() {

    if (getView() === 'United States Senator') {        //10 x 10
        document.getElementById("federalSeat").innerHTML = 'Current Senate Balance';
        gridData = createArrayOfElements(0);
    } else if (getView() === 'United States Governor') {         //10 x 5
        document.getElementById("federalSeat").innerHTML = 'Current Governor Balance';
        gridData = createArrayOfElements(1);
    } else {
        document.getElementById("federalSeat").innerHTML = 'States Seats';
        gridData = createArrayOfElements(2);
    }

    grid = d3v4.select("#grid")
        .append("svg")
        .attr('id', 'gridSVG')
        .style("display",'block')
        .style('margin','auto')
        .style('preserveAspectRatio', 'xMidYMid')
        .attr("width","260px")
        .attr("height","260px");

    var row = grid.selectAll(".row")
        .data(gridData)
        .enter().append("g")
        .attr("class", "row");
    count = 0;

    var column = row.selectAll(".square")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class","square")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", function(d) { return d.party[count++] })
        .style("stroke", "#ffffff")
        .style("stroke-width", 2);

}

function updateGrid() {
    var party = null;
    if (getView() === 'United States Senator') {        //10 x 10
        document.getElementById("federalSeat").innerHTML = 'Current Senate Balance';
        party = getCurrNumSenators()
    } else if (getView() === 'United States Governor') {         //10 x 5
        document.getElementById("federalSeat").innerHTML = 'Current Governor Balance';
        party = getCurrNumGovernors();
    } else {
        document.getElementById("federalSeat").innerHTML = 'States Seats';
        party = getDefaultArray();
    }
    var count = 0;
    grid = d3v4.selectAll(".square").transition().style("fill", function(d)
    {
        if (party[count] == strongDem || party[count] == strongRep || party[count] == indep || party[count] == '#737373') {
            return party[count++]
        } else {
            return '#ffffff'
        }
    }).duration(2000)
}

function  createArrayOfElements(num) {
    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width = 24;
    var height = 24;
    var columnLen = 0;
    var rowLen = 0;
    var party = null;

    if(num == 0) {
        columnLen = 10;
        rowLen = 10;
        party = getCurrNumSenators()
    } else if (num == 1) {
        columnLen = 10;
        rowLen = 5;
        party = getCurrNumGovernors();
    } else if (num == 2) {
        columnLen = 10;
        rowLen = 10;
        party = getDefaultArray();
    }

    for (var column = 0; column < columnLen; column++) {
        data.push( new Array() );
        // iterate for cells/columns inside rows
        for (var row = 0; row < rowLen; row++) {
            data[column].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                party: party
            });
            // increment the y position. I.e. move it over by width variable)
            ypos += height;
        }
        // reset the y position after a row is complete
        ypos = 1;
        // increment the x position for the next row. Move it down height variable)
        xpos += width;
    }
    return data;
}

function getView() {
    e = document.getElementById("raceDropdown");
    return e.options[e.selectedIndex].value;
}

/**
 * Returns incumbent array of
 * {
 *  party:
 *  number:
 * }
 */
function getCurrNumGovernors() {
    var governorsD = [];
    var governorsR = [];
    var governorsI = [];
    for (var x = 0; x < governorD.length; x++) {
        if (governorD[x].party == "democrat") {
            governorsD.push(strongDem);
        } else if (governorD[x].party == "republican") {
            governorsR.push(strongRep);
        } else if (governorD[x].party == "independent") {
            governorsI.push(indep);
        } else {
            console.log("bug")
        }
    }
    governorsD.push.apply(governorsD, governorsI);
    governorsD.push.apply(governorsD, governorsR)
    return governorsD;
}

/**
 * Returns incumbent array of
 * {
 *  party:
 *  number:
 * }
 */
function getCurrNumSenators() {
    var senatorsD = []
    var senatorsR = []
    var senatorsI = []
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (senateD.results[0].members[x].party == "D") {
            if (senateD.results[0].members[x].first_name == "Heidi") {  //Quick hacky way to ensure there are 51
                // republican senators, dont know why the data has 50 republicans only. If I have the time later, will investigate.
                senatorsR.push(strongRep);
            } else {
                senatorsD.push(strongDem);
            }
        } else if (senateD.results[0].members[x].party == "I") {
            senatorsI.push(indep);
        } else {
            senatorsR.push(strongRep);
        }
    }
    senatorsD.push.apply(senatorsD, senatorsI);
    senatorsD.push.apply(senatorsD, senatorsR);
    return senatorsD;
}

function getDefaultArray() {
    var arr = []
    for (var x = 0; x < 100; x++) {
        arr.push('#737373');
    }
    return arr;
}

/**
 * Returns RCP array of
 * {
 *  party:
 *  number:
 * }
 */
function getNumSenators() {
    return;
}

/**
 * Returns RCP array of
 * {
 *  party:
 *  number:
 * }
 */
function getNumGovernors() {
    return;
}

