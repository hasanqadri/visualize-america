/**
 * Determines color of state
 * @param d Dataset
 * @returns {*}
 */
function determineStateColor(d) {
    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;
    if (selectedOption === "Default") {
        document.getElementById('head-title').innerHTML = 'United States of America';
        document.getElementById("incumbent").disabled = true;
        document.getElementById("incumbent").checked = false;
        document.getElementById("current-map").disabled = true;
        document.getElementsByName('inputState')[0].disabled = true;
        document.getElementsByName('inputState')[0].value = '';

        document.getElementsByClassName('text-color')[0].style.color = 'grey';
        document.getElementsByClassName('text-color')[1].style.color = 'grey';
        return '#737373'
    } else if (selectedOption === "United States Senator") {
        document.getElementById('head-title').innerHTML = 'United States Senate';
        document.getElementsByName('inputState')[0].disabled = false;
        document.getElementsByName('inputState')[0].value = '';

        htmlControls();
        rcpD = rcpsD;
        return colorMapByLead(d, numSenStates);
    } else if (selectedOption === "United States Governor") {
        document.getElementById('head-title').innerHTML = 'United States Governors';
        document.getElementsByName('inputState')[0].disabled = false;
        document.getElementsByName('inputState')[0].value = '';

        htmlControls();
        rcpD = rcpgD;
        return colorMapByLead(d, numGovStates);
    }
}

/**
 * Colors map by who's leading into 9 potential colors
 * @param d
 * @param numStates
 * @returns {*}
 */
function colorMapByLead(d, numStates) {

    for (var x = 0; x < numStates; x++) {
        if (d.properties.STATE_ABBR === rcpD[x].state) {
            output =  getCandidateInfo(rcpD[x]);
            candidate = output[0];
            lead = output[1];
            party = output[2];
            if (party === 'D') {
                if (lead > 10)
                    return strongDem;
                else if (lead > 5)
                    return weakDem;
                else
                    return leanDem
            } else if (party === 'R') {
                if (lead > 10)
                    return strongRep;
                else if (lead > 5)
                    return weakRep;
                else
                    return leanRep
            } else if (party === 'I') {
                return indep
            }
        }
    }
    if (getView() == "United States Senator") {
        for (var x = 0; x < senateD.results[0].members.length; x++) {
            if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
                if (senateD.results[0].members[x].next_election == '2018') {
                    return '#bdbdbd'
                }
            }
        }
    } else if (getView() == "United States Governor") {
        notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE'];
        for (var x = 0; x < governorD.length; x++) {
            if (d.properties.STATE_ABBR === governorD[x].state_code) {
                if (!(notInState.includes(governorD[x].state_code)))
                    return '#bdbdbd'
            }
        }
    }
    return '#737373'
}

/**
 *
 * @param state
 * @returns
 */
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

/**
 * Select dropdown
 */
function getDropdownOption() {
    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;
}

/**
 *
 */
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
            for (var y = 0; y < numSenStates; y++) {
                if (d.properties.STATE_ABBR === rcpsD[y].state) {
                    var candidates = getCandidatesAndLead(rcpsD[y]);
                    if (d.properties.STATE_ABBR === "ME") {
                        document.getElementById('head-to-head').innerHTML = candidates["(I)"][0] + " (D) v. " + candidates["(R)"][0] + " (R)";
                    } else {
                        document.getElementById('head-to-head').innerHTML = candidates["(D)"][0] + " (D) v. " + candidates["(R)"][0] + " (R)";
                    }
                    document.getElementById('seat').innerHTML = stateD[rcpsD[y].state] + " " + "Senate Seat";
                    document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                    document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                    drawPollingAverageBars(candidates, 0);
                    drawPastOccupancies(candidates, past_senD[rcpsD[y].state]);
                    d3.select('.lean').transition().attr('fill', function(d) {
                        return higherParty(candidates);
                    }).duration(500)
                }
            }
            //For loop over gray states, if matched, then update side panel with everything but bars
            for (var v = 0; v < pastOccupantsSen.length; v++) {
                if (d.properties.STATE_ABBR === pastOccupantsSen[v]) {
                    document.getElementById('head-to-head').innerHTML = 'Data currently not available';
                    document.getElementById('polling-average-title').innerHTML = '';

                    document.getElementById('seat').innerHTML = stateD[pastOccupantsSen[v]] + " " + "Senate Seat";
                    document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                    drawPollingAverageBars(candidates, 1);
                    drawPastOccupancies(null, past_senD[pastOccupantsSen[v]]);
                    d3.select('.lean').transition().attr('fill', '#bdbdbd').duration(500)
                }
            }
        } else if (selectedOption === "United States Governor") {
            for (var x = 0; x < governorD.length; x++) {
                if (d.properties.STATE_ABBR === governorD[x].state_code) {
                    for (var y = 0; y < numGovStates; y++) {
                        if (d.properties.STATE_ABBR === rcpgD[y].state) {
                            var candidates = getCandidatesAndLead(rcpgD[y]);
                            document.getElementById('head-to-head').innerHTML =  candidates["(D)"][0] + " (D) v. " + candidates["(R)"][0] + " (R)";
                            document.getElementById('seat').innerHTML = stateD[rcpgD[y].state] + " " + "Governor Seat";
                            document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                            document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                            drawPollingAverageBars(candidates, 0);
                            drawPastOccupancies(candidates, past_govD[rcpgD[y].state]);
                            d3.select('.lean').transition().attr('fill', function(d) {
                                return higherParty(candidates);
                            }).duration(500)
                        }
                    }
                }
            }
            //For loop over gray states, if matched, then update side panel with everything but bars
            for (var n = 0; n < pastOccupantsGov.length; n++) {
                if (d.properties.STATE_ABBR === pastOccupantsGov[n]) {
                    document.getElementById('head-to-head').innerHTML = 'Data currently not available';
                    document.getElementById('polling-average-title').innerHTML = '';
                    document.getElementById('seat').innerHTML = stateD[pastOccupantsGov[n]] + " " + "Governor Seat";
                    document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                    drawPollingAverageBars(candidates, 1);
                    drawPastOccupancies(null, past_govD[pastOccupantsGov[n]]);
                    d3.select('.lean').transition().attr('fill', '#bdbdbd').duration(500)
                }
            }
        } else {
            console.log("bug")
        }
    }
}


function isValidState(state) {
    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;
    if (selectedOption === "Default") {
        return false;
    } else if (selectedOption === 'United States Senator') {
        for (var y = 0; y < numSenStates; y++) {
            if (state === rcpsD[y].state) {
                var candidates = getCandidatesAndLead(rcpsD[y]);
                document.getElementById('head-to-head').innerHTML =  candidates["(D)"][0] + " (D) v. " + candidates["(R)"][0] + " (R)";
                document.getElementById('seat').innerHTML = stateD[rcpsD[y].state] + " " + "Senate Seat";
                document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                drawPollingAverageBars(candidates);
                drawPastOccupancies(candidates, past_senD[rcpsD[y].state]);
                d3.select('.lean').transition().attr('fill', function(d) {
                    return higherParty(candidates);
                }).duration(500)
                return true;
            }
        }
        //For loop over gray states, if matched, then update side panel with everything but bars
        for (var v = 0; v < pastOccupantsSen.length; v++) {
            if (state === pastOccupantsSen[v]) {
                document.getElementById('head-to-head').innerHTML = 'Data currently not available';
                document.getElementById('polling-average-title').innerHTML = '';

                document.getElementById('seat').innerHTML = stateD[pastOccupantsSen[v]] + " " + "Senate Seat";
                document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                drawPollingAverageBars(candidates, 1);
                drawPastOccupancies(null, past_senD[pastOccupantsSen[v]]);
                d3.select('.lean').transition().attr('fill', '#bdbdbd').duration(500)
                return true
            }
        }
    } else if (selectedOption === 'United States Governor') {
        for (var y = 0; y < numGovStates; y++) {
            if (state === rcpgD[y].state) {
                var candidates = getCandidatesAndLead(rcpgD[y]);
                document.getElementById('head-to-head').innerHTML =  candidates["(D)"][0] + " (D) v. " + candidates["(R)"][0] + " (R)";
                document.getElementById('seat').innerHTML = stateD[rcpgD[y].state] + " " + "Governor Seat";
                document.getElementById('polling-average-title').innerHTML = 'Polling Average';
                document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                drawPollingAverageBars(candidates);
                drawPastOccupancies(candidates, past_govD[rcpgD[y].state]);
                d3.select('.lean').transition().attr('fill', function(d) {
                    return higherParty(candidates);
                }).duration(500)
                return true;
            }
        }
        //For loop over gray states, if matched, then update side panel with everything but bars
        for (var n = 0; n < pastOccupantsGov.length; n++) {
            if (state === pastOccupantsGov[n]) {
                document.getElementById('head-to-head').innerHTML = 'Data currently not available';
                document.getElementById('polling-average-title').innerHTML = '';
                document.getElementById('seat').innerHTML = stateD[pastOccupantsGov[n]] + " " + "Governor Seat";
                document.getElementById('past-occupancies-title').innerHTML = "Past Occupancies";
                drawPollingAverageBars(candidates, 1);
                drawPastOccupancies(null, past_govD[pastOccupantsGov[n]]);
                d3.select('.lean').transition().attr('fill', '#bdbdbd').duration(500)
                return true;
            }
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
                name['party'] = candidateName.split(" ")[1].charAt(1);
                name['percent'] = candidateScore;

                candidates['niceTry'].push(name);
            }
        }
        break;
    }
    return candidates;
}

function getPartyAndLead(state) {
    var candidates = []
    var candidateName = null
    var candidateScore = null;
    var canNames = {}
    var name = {}
    for (var key in state.polls) {
        for (var names in state.polls[key]) {
            if (names.includes("Spread")) {
                candidateName = state.polls[key]['Spread'].split(' ')[0]
                candidateScore = parseInt(state.polls[key]['Spread'].split(' ')[1].split('+')[1]);
                name['name'] = candidateName;
                name['lead'] = candidateScore;
            } else {
                canNames[names.split(' ')[0]] = names.split(' ')[1].charAt(1)
            }
        }
        name['party'] = canNames[name['name']];

        break;
    }
    return name;
}

function checkSenAndGov(state) {
    e = document.getElementById("raceDropdown");
    selectedOption = e.options[e.selectedIndex].value;

    if (selectedOption === "Default") {
        return false;
    } else if (selectedOption === 'United States Senator') {
        for (var y = 0; y < numSenStates; y++) {
            if (state === rcpsD[y].state) {
                return true;
            }
        }
        for (var v = 0; v < pastOccupantsSen.length; v++) {
            if (state === pastOccupantsSen[v]) {
                return true;
            }
        }
    } else if (selectedOption === 'United States Governor') {
        for (var y = 0; y < numGovStates; y++) {
            if (state === rcpgD[y].state) {
                return true;
            }
        }
        for (var n = 0; n < pastOccupantsGov.length; n++) {
            if (state === pastOccupantsGov[n]) {
                return true;
            }
        }
    }
}

function higherParty(candidates) {
    var data = candidates['niceTry'];
    var currHigh = 0;
    var party = null
    for (var key in data) {
        if (data[key].percent > currHigh) {
            currHigh = data[key].percent;
            party = data[key].party;
        }
    }
    var lead = Math.abs(data[0].percent - data[1].percent)
    if (party === 'D') {
        if (lead > 10)
            return strongDem;
        else if (lead > 5)
            return weakDem;
        else
            return leanDem
    } else if (party === 'R') {
        if (lead > 10)
            return strongRep;
        else if (lead > 5)
            return weakRep;
        else
            return leanRep
    } else if (party === 'I') {
        return indep
    }
}