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
    var rcpD = null;

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-governor.json")
        .defer(d3.json, "./Data/rcp-governor-abbr.json")
        .await(ready);

    function ready(error, us, governor, rcp) {
        if (error) throw error;
        usD = us;
        governorD = governor;
        rcpD = rcp;
        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", initialState)

        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter().append("circle")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("r", 4)
            .attr("fill", initialStateCircle)
            .style('stroke', circleBorders)
            .style('stroke-width', 1);

    }

    function initialState(d) {
        for (var x = 0; x < 11; x++) {
            if (d.properties.STATE_ABBR === rcpD[x].state) {
                output = calculateWinnnerNamePartyLead(rcpD[x]);
                candidate = output[0];
                lead = output[1];
                party = output[2];
                if (party === 'D') {
                    if (lead > 10)
                        return '#002d6b'
                    else if (lead > 5)
                        return '#084eb3'
                    else
                        return '#1d90ff'
                } else if (party === 'R') {
                    if (lead > 10)
                        return '#531010'
                    else if (lead > 5)
                        return '#ac1600'
                    else
                        return '#ff4941'
                } else if (party === 'I') {
                    return '#3cff49'
                }
            }
        }
        return '#807d85'
    }


    function calculateWinnnerNamePartyLead(state) {
        if ('RCP Average' in state.polls) {
            candidateLead = state.polls['RCP Average'].Spread.split(' ');
            candidate = candidateLead[0];
            lead = candidateLead[1];
            lead = parseFloat(lead.split('+')[1])
            party = null
            for (var key in state.polls['RCP Average']) {
                if (state.polls['RCP Average'].hasOwnProperty(key)) {
                    if (key.includes(candidate)) {
                        if (key.includes('(D)')) {
                            party = 'D'
                            break;
                        } else if (key.includes('(R)')) {
                            party = 'R'
                            break;
                        } else {
                            party = 'I'
                            break;
                        }
                    }
                }
            }
            return [candidate, lead, party];
        }
        candidates = {}
        savedKey = null
        for (var key in state.polls) {
            candidateLead = state.polls[key].Spread.split(' ');
            thisLead = parseFloat(candidateLead[1].split('+')[1])
            if (!(candidateLead[0] in candidates)) {
                candidates[candidateLead[0]] = thisLead;
            } else {
                candidates[candidateLead] += thisLead;
            }
            savedKey = key
        }
        bestCandidate = null
        bestLead = 0
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
                    party = 'D'
                    break;
                } else if (key.includes('(R)')) {
                    party = 'R'
                    break;
                } else {
                    party = 'I'
                    break;
                }
            }
        }
        return [bestCandidate, bestLead, party]
    }

    function circleBorders(d) {
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

    function initialStateCircle(d) {
        notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE']
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
}


