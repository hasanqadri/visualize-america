
function getCurrentGovernors(d) {
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (governorD[x].party === "democrat") {
                return '#084594'
            } else if (governorD[x].party === "republican") {
                return '#99000d'
            } else {
                return '#005a32'
            }
        }
    }
    return '#bbb';
}



function governorCircle(d) {
    notInState = ['WA', 'ND', 'MT', 'UT', 'MO', 'IN', 'KY', 'MS', 'LA', 'NC', 'VA', 'WV', 'NJ', 'DE'];
    for (var x = 0; x < governorD.length; x++) {
        if (d.properties.STATE_ABBR === governorD[x].state_code) {
            if (!(notInState.includes(governorD[x].state_code))) {
                if (governorD[x].party === "democrat") {
                    return '#084594'
                } else if (governorD[x].party === "republican") {
                    return '#99000d'
                } else {
                    return '#005a32'
                }
            }
        }
    }
    return '#807d85'
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
    return '#807d85'
}
