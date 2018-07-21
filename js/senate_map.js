
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
