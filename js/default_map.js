var e = document.getElementById("raceDropdown");
var selectedOption = e.options[e.selectedIndex].value;
var section = null;
var usD = null;
var governorD = null;
var rcpD = null;
var rcpsD = null;
var rcpgD = null;
var senateD = null;
var checked = false;
var currentMapChecked = false;
var legend = null;
var numSenStates = 17;
var numGovStates = 11;
var stateD = null;
function default_map() {
    var width = 1000,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.default')
        .attr('width', width)
        .attr('height', height);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Define linear scale for output
    var color = d3.scale.linear()
        .range(["#003296","#084eb3","#1d90ff","#760d0f", "#bf1700", "#ff4941" ]);
    color.domain([0,1,2,3,4,5,6]); // setting the range of the input data

    var legendText = ["Strongly Democrat", "Likely Democrat", "Lean Democrat", "No Data", "Lean Republican", "Likely Republican", "Strong Republican"];

    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    legend = d3.select(".innerContainer").append("svg")
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

    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-governor.json")
        .defer(d3.json, "./Data/rcp-governor-abbr.json")
        .defer(d3.json, "./Data/us-senate.json")
        .defer(d3.json, "./Data/rcp-senate-abbr.json")
        .defer(d3.json, "./Data/state-abbr.json")
        .await(ready);

    function ready(error, us, governor, rcpg, senate, rcps, state_abbr) {
        if (error) throw error;
        usD = us;
        governorD = governor;
        rcpgD = rcpg;
        senateD = senate;
        rcpsD = rcps;
        stateD = state_abbr;
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", '#807d85')
            .on('mouseover', function(d){
                var stateName = d.properties.STATE_ABBR;
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .75);
                tooltip.html( function() {
                    return stateName
                })
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on('click', function(d) {
                updateSidePane(d);

            })

        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter().append("circle")
            .attr("transform", function (d) {
                return "translate(" + path.centroid(d) + ")";
            })
            .attr("r", 5)
            .attr("fill", '#807d85')
            .style('stroke', '#807d85')
            .style('stroke-width', 2);


        d3.select('#raceDropdown')
            .on('change', function() {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                document.getElementById('current-map').checked = false;
                currentMapChecked = false;

                var svg = d3.select('.default').transition();
                svg.selectAll('.states').duration(2000).attr('fill', determineStateColor);
                checkIncumbent(svg);

                checkLegend();

            });

        d3.select('#incumbent')
            .on('change', function() {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                if (section !== 'Default') {checked = !checked};
                var svg = d3.select('.default').transition();
                if (!currentMapChecked) {
                    checkIncumbent(svg);
                }
            });

        d3.select('#current-map')
            .on('change', function() {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                currentMapChecked = !currentMapChecked;
                var svg = d3.select('.default').transition();

                if (currentMapChecked != true) {
                    svg.selectAll('.states').duration(2000).attr('fill', determineStateColor);
                    checkIncumbent(svg)
                } else {
                    if (section === "United States Senator") {
                        svg.selectAll('.states').duration(2000).attr('fill', getCurrentSenators);
                        svg.selectAll('circle').duration(2000).attr('fill', getCurrentSenators);
                        svg.selectAll('circle').duration(2000).style('stroke', getCurrentSenators);
                    } else if (section === "United States Governor") {
                        svg.selectAll('.states').duration(2000).attr('fill', getCurrentGovernors);
                        svg.selectAll('circle').duration(2000).attr('fill', getCurrentGovernors);
                        svg.selectAll('circle').duration(2000).style('stroke', getCurrentGovernors);
                    } else {
                        console.log('error');
                    }
                }

                checkLegend();
            });
    }
}
function determineStateColor(d) {
    selectedOption = section;
    if (selectedOption === "Default") {
        document.getElementById('head-title').innerHTML = 'United States of America';
        document.getElementById("incumbent").disabled = true;
        document.getElementById("incumbent").checked = false;
        document.getElementById("current-map").disabled = true;
        document.getElementsByClassName('text-color')[0].style.color = 'grey';
        document.getElementsByClassName('text-color')[1].style.color = 'grey';
        return '#807d85'
    } else if (selectedOption === "United States Senator") {
        document.getElementById('head-title').innerHTML = 'United States Senate';
        htmlControls();
        rcpD = rcpsD;
        return colorMapByLead(d, numSenStates);
    } else if (selectedOption === "United States Governor") {
        document.getElementById('head-title').innerHTML = 'United States Governors';
        htmlControls();
        rcpD = rcpgD;
        return colorMapByLead(d, numGovStates);
    }
}

function colorMapByLead(d, numStates) {

    for (var x = 0; x < numStates; x++) {
        if (d.properties.STATE_ABBR === rcpD[x].state) {
            output =  getCandidateInfo(rcpD[x]);
            candidate = output[0];
            lead = output[1];
            party = output[2];
            if (party === 'D') {
                if (lead > 10)
                    return '#003296';
                else if (lead > 5)
                    return '#084eb3';
                else
                    return '#1d90ff'
            } else if (party === 'R') {
                if (lead > 10)
                    return '#760d0f';
                else if (lead > 5)
                    return '#bf1700';
                else
                    return '#ff4941'
            } else if (party === 'I') {
                return '#3cff49'
            }
        }
    }
    return '#807d85'
}

function getCandidateInfo(state) {
    if ('RCP Average' in state.polls) {
        candidateLead = state.polls['RCP Average'].Spread.split(' ');
        candidate = candidateLead[0];
        lead = candidateLead[1];
        lead = parseFloat(lead.split('+')[1]);
        party = null;
        for (var key in state.polls['RCP Average']) {
            if (state.polls['RCP Average'].hasOwnProperty(key)) {
                if (key.includes(candidate)) {
                    if (key.includes('(D)')) {
                        party = 'D';
                        break;
                    } else if (key.includes('(R)')) {
                        party = 'R';
                        break;
                    } else {
                        party = 'I';
                        break;
                    }
                }
            }
        }
        return [candidate, lead, party];
    }
    candidates = {};
    savedKey = null;
    for (var key in state.polls) {
        candidateLead = state.polls[key].Spread.split(' ');
        thisLead = parseFloat(candidateLead[1].split('+')[1]);
        if (!(candidateLead[0] in candidates)) {
            candidates[candidateLead[0]] = thisLead;
        } else {
            candidates[candidateLead] += thisLead;
        }
        savedKey = key
    }
    bestCandidate = null;
    bestLead = 0;
    party = null
    for (var key in candidates) {
        if (candidates[key] > bestLead) {
            bestCandidate = key;
            bestLead = candidates[key]
        }
    }
    for (var key in state.polls[savedKey]) {
        if (key.includes(bestCandidate)){
            if (key.includes('(D)')) {
                party = 'D';
                break;
            } else if (key.includes('(R)')) {
                party = 'R';
                break;
            } else {
                party = 'I';
                break;
            }
        }
    }
    return [bestCandidate, bestLead, party]
}

function checkLegend() {
    if (currentMapChecked) {
        legend.remove();
        // Define linear scale for output
        var color = d3.scale.linear()
            .range(["#9c1ecb","#22cb30","#cb181d","#084594" ]);
        color.domain([0,1,2,3]); // setting the range of the input data

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
            .range(["#003296","#084eb3","#1d90ff","#760d0f", "#bf1700", "#ff4941" ]);
        color.domain([0,1,2,3,4,5,6]); // setting the range of the input data

        var legendText = ["Strongly Democrat", "Likely Democrat", "Lean Democrat", "No Data", "Lean Republican", "Likely Republican", "Strong Republican"];

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

    }
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
            console.log('bug');
            svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
            svg.selectAll('circle').duration(2000).style('stroke', determineStateColor);
        }
    } else {
        svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
        svg.selectAll('circle').duration(2000).style('stroke', determineStateColor);
    }
}

function htmlControls() {
    document.getElementById("incumbent").disabled = false;
    document.getElementById("current-map").disabled = false;
    document.getElementsByClassName('text-color')[0].style.color = 'black';
    document.getElementsByClassName('text-color')[1].style.color = 'black';
}


function updateSidePane(d) {
    if (!currentMapChecked) {
        var sect = document.getElementById("raceDropdown");
        selectedOption = sect.options[sect.selectedIndex].value;
        if (selectedOption === "United States Senator") {
            for (var x = 0; x < senateD.results[0].members.length; x++) {
                if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
                    for (var y = 0; y < numSenStates; y++) {
                        if (d.properties.STATE_ABBR === rcpsD[y].state) {
                            var candidates = getCandidatesAndLead(rcpsD[y]);
                            document.getElementById('head-to-head').innerHTML =  candidates["(D)"][0] + "(D) v. " + candidates["(R)"][0] + "(R)";
                            document.getElementById('seat').innerHTML = stateD[rcpsD[y].state] + " " + "Senate Seat";
                            document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                            document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                            drawPollingAverage(candidates);
                            drawPastOccupancies(d, rcpsD[y]);
                        }
                    }
                }
            }
        } else if (selectedOption === "United States Governor") {
            for (var x = 0; x < governorD.length; x++) {
                if (d.properties.STATE_ABBR === governorD[x].state_code) {
                    for (var y = 0; y < numGovStates; y++) {
                        if (d.properties.STATE_ABBR === rcpgD[y].state) {
                            var candidates = getCandidatesAndLead(rcpgD[y]);
                            document.getElementById('head-to-head').innerHTML =  candidates["(D)"][0] + "(D) v. " + candidates["(R)"][0] + "(R)";
                            document.getElementById('seat').innerHTML = stateD[rcpsD[y].state] + " " + "Governor Seat";
                            document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                            document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                            drawPollingAverage(candidates);
                            drawPastOccupancies(d, rcpgD[y], governorD[x]);
                        }
                    }
                }
            }
        } else {
            console.log("bug")
        }
    }
}

function getCandidatesAndLead(state) {
    candidates = {};
    candidates["score"] = [];
    candidates["names"] = [];
    candidates['niceTry'] = []
    candidates['csvCompatible'] = {}
    for (var key in state.polls) {
        for (var names in state.polls[key]) {
            if (!names.includes("Spread")) {
                candidateName = names;
                candidateScore = parseInt(state.polls[key][names]);
                candidates[names.split(" ")[1]] = [names.split(" ")[0], state.polls[key][names]];
                candidates["score"].push(state.polls[key][names]);
                candidates["names"].push(names.split(" ")[0]);
                candidates['csvCompatible'][names.split(" ")[0]] = parseInt(state.polls[key][names]);
                var name = {}
                name['name'] = candidateName;
                name['percent'] = candidateScore;
                candidates['niceTry'].push(name);
            }
        }
        break;
    }
    return candidates;
}


