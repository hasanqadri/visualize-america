
function getCurrentSenators(d) {
    var dualStates = ['NV', 'CO', 'MT', 'ND', 'WI', 'MO', 'IN', 'OH', 'WV', 'PA', 'ME', 'AL', 'FL'];
    for (var z = 0; z < dualStates.length; z++) {
        if (d.properties.STATE_ABBR === dualStates[z]) {
            return mixed
        }
    }
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].party === "D") {
                return strongDem
            } else {
                return strongRep
            }
        }
    }
}

function senateCircle(d) {
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].next_election == '2018') {
                if (senateD.results[0].members[x].party === "D") {
                    return strongDem
                } else if (senateD.results[0].members[x].party == 'R') {
                    return strongRep
                } else {
                    return indep

                }
            }
        }
    }
    return '#737373'
}

function senateCircleBorders(d) {
    for (var x = 0; x < senateD.results[0].members.length; x++) {
        if (d.properties.STATE_ABBR === senateD.results[0].members[x].state) {
            if (senateD.results[0].members[x].next_election == '2018') {
                return 'black'
            }
        }
    }
    return '#737373'
}