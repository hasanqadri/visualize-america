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
function default_map() {
    var width = 1500,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.default')
        .attr('width', width)
        .attr('height', height);

    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-governor.json")
        .defer(d3.json, "./Data/rcp-governor-abbr.json")
        .defer(d3.json, "./Data/us-senate.json")
        .defer(d3.json, "./Data/rcp-senate-abbr.json")
        .await(ready);

    function ready(error, us, governor, rcpg, senate, rcps) {
        if (error) throw error;
        usD = us;
        governorD = governor;
        rcpgD = rcpg;
        senateD = senate;
        rcpsD = rcps;

        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", '#807d85');

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
                console.log(svg);
                svg.selectAll('.states').duration(2000).attr('fill', determineStateColor);
                if (checked == true) {
                    if (section === "United States Senator") {
                        svg.selectAll('circle').duration(2000).attr('fill', senateCircle)
                        svg.selectAll('circle').duration(2000).style('stroke', senateCircleBorders)
                    } else if (section === "United States Governor") {
                        svg.selectAll('circle').duration(2000).attr('fill', governorCircle)
                        svg.selectAll('circle').duration(2000).style('stroke', governorCircleBorders)
                    } else {
                        console.log('bug');
                        svg.selectAll('circle').duration(2000).attr('fill', determineStateColor)
                        svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                    }
                } else {
                    svg.selectAll('circle').duration(2000).attr('fill', determineStateColor)
                    svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                }
            });

        d3.select('#incumbent')
            .on('change', function() {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                checked = !checked;
                var svg = d3.select('.default').transition();
                if (!currentMapChecked) {
                    if (checked == true) {
                        if (section === "United States Senator") {
                            svg.selectAll('circle').duration(2000).attr('fill', senateCircle)
                            svg.selectAll('circle').duration(2000).style('stroke', senateCircleBorders)
                        } else if (section === "United States Governor") {
                            svg.selectAll('circle').duration(2000).attr('fill', governorCircle)
                            svg.selectAll('circle').duration(2000).style('stroke', governorCircleBorders)
                        } else {
                            console.log('bug');
                            svg.selectAll('circle').duration(2000).attr('fill', determineStateColor)
                            svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                        }
                    } else {
                        svg.selectAll('circle').duration(2000).attr('fill', determineStateColor)
                        svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                    }
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
                    if (checked == true) {
                        if (section === "United States Senator") {
                            svg.selectAll('circle').duration(2000).attr('fill', senateCircle);
                            svg.selectAll('circle').duration(2000).style('stroke', senateCircleBorders)
                        } else if (section === "United States Governor") {
                            svg.selectAll('circle').duration(2000).attr('fill', governorCircle);
                            svg.selectAll('circle').duration(2000).style('stroke', governorCircleBorders)
                        } else {
                            console.log('bug');
                            svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
                            svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                        }
                    } else {
                        svg.selectAll('circle').duration(2000).attr('fill', determineStateColor);
                        svg.selectAll('circle').duration(2000).style('stroke', determineStateColor)
                    }
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
            });
    }
}
function determineStateColor(d) {
    selectedOption = section;
    console.log(selectedOption);
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
        document.getElementById("incumbent").disabled = false;
        document.getElementById("current-map").disabled = false;
        document.getElementsByClassName('text-color')[0].style.color = 'black';
        document.getElementsByClassName('text-color')[1].style.color = 'black';
        rcpD = rcpsD;
        return colorMapByLead(d, 17);
    } else if (selectedOption === "United States Governor") {
        document.getElementById('head-title').innerHTML = 'United States Governors';
        document.getElementById("incumbent").disabled = false;
        document.getElementById("current-map").disabled = false;
        document.getElementsByClassName('text-color')[0].style.color = 'black';
        document.getElementsByClassName('text-color')[1].style.color = 'black';
        rcpD = rcpgD;
        return colorMapByLead(d, 11);
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

function getCurrentGovernors(d) {
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

function getCurrentSenators(d) {
    var dualStates = ['NV', 'CO', 'MT', 'ND', 'WI', 'MO', 'IN', 'OH', 'WV', 'PA', 'ME', 'AL', 'FL'];
    for (var z = 0; z < dualStates.length; z++) {
        if (d.properties.STATE_ABBR === dualStates[z]) {
            return '#9c1ecb'
        }
    }
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].party === "D") {
                return '#084594'
            } else {
                return '#cb181d'
            }
        }
    }
}


function governorCircle(d) {
    notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE'];
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (!(notInState.includes(governorD[x].state_code))) {
                if (governorD[x].party === "democrat") {
                    return '#084594'
                } else if (governorD[x].party === "republican") {
                    return '#cb181d'
                } else {
                    return '#22cb30'
                }
            }
        }
    }
    return '#807d85'
}

function governorCircleBorders(d) {
    notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE']
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (!(notInState.includes(governorD[x].state_code))) {
                return 'black'
            }
        }
    }
    return '#807d85'
}


function senateCircle(d) {
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].next_election == '2018') {
                if (senateD.results[0].members[x].party === "D") {
                    return '#000394'
                } else {
                    return '#cb0007'
                }
            }
        }
    }
    return '#807d85'
}

function senateCircleBorders(d) {
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].next_election == '2018') {
                return 'black'
            }
        }
    }
    return '#807d85'
}
