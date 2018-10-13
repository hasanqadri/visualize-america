
function getCurrentGovernors(d) {
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (governorD[x].party === "democrat") {
                return strongDem
            } else if (governorD[x].party === "republican") {
                return strongRep
            } else {
                return indep
            }
        }
    }
    return '#737373';
}

function governorCircle(d) {
    notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE'];
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (!(notInState.includes(governorD[x].state_code))) {
                if (governorD[x].party === "democrat") {
                    return strongDem
                } else if (governorD[x].party === "republican") {
                    return strongRep
                } else {
                    return indep
                }
            }
        }
    }
    return '#737373'
}

function governorCircleBorders(d) {
    notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE'];
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (!(notInState.includes(governorD[x].state_code))) {
                return 'black'
            }
        }
    }
    return '#737373'
}
