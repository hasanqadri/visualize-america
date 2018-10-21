/**
 *
 * @Author Hasan Qadri
 */
//Global Variables

//Dropdown selection
var e = document.getElementById("raceDropdown");
var selectedOption = e.options[e.selectedIndex].value;
var section = null;

//Colors
var strongDem = '#2166ac'     //strongDem
var weakDem = '#4393c3'       // weakDem
var leanDem = '#92c5de'      //leanDem
var indep = '#1a9850'        // indep
var leanRep = '#f4a582'      // leanRep
var weakRep = '#d6604d'      // weakRep
var strongRep = '#b2182b'     // strongRep
var mixed = '#762a83'

/**
 var strongDem = '#2166ac'     //strongDem
 var weakDem = '#67a9cf'       // weakDem
 var leanDem = '#d1e5f0'      //leanDem
 var indep = '#1a9850'        // indep
 var leanRep = '#fddbc7'      // leanRep
 var weakRep = '#ef8a62'      // weakRep
 var strongRep = '#b2182b'     // strongRep
 */

var pastOccupantsSen = ['WA', 'WY', 'NE', 'MS', 'VT', 'MN', 'HI', 'CA'];   //Update list when new states get added (remove them from here)
var pastOccupantsGov = ['ID', 'WY', 'SD', 'NE', 'AR', 'MS', 'NY', 'VT', 'ME', 'AL'];

//Data
var usD = null;
var governorD = null;
var rcpD = null;
var rcpsD = null;
var rcpgD = null;
var senateD = null;
var stateD = null;
var past_senD = null;
var past_govD = null;
var state_abbr2D = null;

//Boolean checks
var checked = false;
var currentMapChecked = false;

//Number of states with polling data
var numSenStates = 25;
var numGovStates = 26;

var legend = null;
var selectedOption = null;
var tooltip = null;
/**
 * United States of America map
 * Transitions default usa map with different colors
 */
function default_map() {
    //Size of map
    var width = 1100,
        height = 700;

    var projection = d3.geo.albersUsa()
        .scale(1500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('.default')
        .attr('width', width)
        .attr('height', height);

    tooltip = createTooltip();

    createLegend();

    selectedOption = getDropdownOption();

    queue()
        .defer(d3.json, "./Data/us2.json")
        .defer(d3.json, "./Data/us-governor.json")
        .defer(d3.json, "./Data/rcp-governor-abbr.json")
        .defer(d3.json, "./Data/us-senate.json")
        .defer(d3.json, "./Data/rcp-senate-abbr.json")
        .defer(d3.json, "./Data/state-abbr.json")
        .defer(d3.json, "./Data/past-senators.json")
        .defer(d3.json, "./Data/past-governors.json")
        .defer(d3.json, "./Data/state-abbr2.json")
        .await(ready);

    function ready(error, us, governor, rcpg, senate, rcps, state_abbr, past_sen, past_gov, state_abbr2) {
        if (error) throw error;

        //Assign data as global
        usD = us;
        governorD = governor;
        rcpgD = rcpg;
        senateD = senate;
        rcpsD = rcps;
        stateD = state_abbr;
        past_senD = past_sen;
        past_govD = past_gov;
        state_abbr2D = state_abbr2;

        svg.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr("fill", '#737373')
            .on('mouseover', function (d) {
                var stateName = d.properties.STATE_ABBR;
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .75);
                tooltip.html(function () {
                    return state_abbr[stateName];
                })
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                //glazeStates(stateName);

            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                glazeStates(null);
            })
            .on('click', function (d) {
                if (getView() != 'Default') {
                    if (checkSenAndGov(d.properties.STATE_ABBR) && !currentMapChecked) {
                        document.getElementById("right-alt").style.visibility = 'hidden';
                        document.getElementById("right-alt").style.display = 'none';

                        document.getElementById("right").style.visibility = 'visible';
                        document.getElementById("right").style.display = 'block';

                        updateSidePane(d);
                    }
                }
            });

        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter().append("circle")
            .attr("transform", function (d) {
                return "translate(" + path.centroid(d) + ")";
            })
            .attr("r", 7)
            .attr("fill", function(d) {
                if (isNaN(path.centroid(d)[0])) {
                    return '#f7fcff';
                } else {
                    return '#737373';
                }
            })
            .style('stroke', '#737373')
            .style('stroke-width', function(d) {
                if (isNaN(path.centroid(d)[0])) {
                    return 0;
                } else {
                    return 1;
                }
            });
        d3.select('#raceDropdown')
            .on('change', function () {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                document.getElementById('current-map').checked = false;
                currentMapChecked = false;
                document.getElementById("right").style.visibility = 'hidden';
                document.getElementById("right").style.display = 'none';

                document.getElementById("right-alt").style.visibility = 'visible';
                document.getElementById("right-alt").style.display = 'block';
                var svg = d3.select('.default').transition();
                svg.selectAll('.states').duration(2000).attr('fill', determineStateColor);

                checkIncumbent(svg);
                if (selectedOption == 'Default') {
                    checked = false;
                }
                checkLegend();
                updateGrid()
                pollingPlacement(determineStateColor)
            });

        d3.select('#incumbent')
            .on('change', function () {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                if (section !== 'Default') {
                    checked = !checked
                }

                var svg = d3.select('.default').transition();
                if (!currentMapChecked) {
                    checkIncumbent(svg);
                }
            });

        d3.select('#current-map')
            .on('change', function () {
                var sect = document.getElementById("raceDropdown");
                section = sect.options[sect.selectedIndex].value;
                currentMapChecked = !currentMapChecked;
                var svg = d3.select('.default').transition();
                if (currentMapChecked != true) {
                    svg.selectAll('.states').duration(2000).attr('fill', determineStateColor)
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
                document.getElementsByName('inputState')[0].disabled = false;
                checkLegend();
                if (currentMapChecked) {
                    document.getElementById("right").style.visibility = 'hidden';
                    document.getElementById("right").style.display = 'none';

                    document.getElementById("right-alt").style.visibility = 'visible';
                    document.getElementById("right-alt").style.display = 'block';

                    document.getElementsByName('inputState')[0].disabled = true;
                    document.getElementsByName('inputState')[0].value = '';
                }
            });

        d3.select("#inputState").on('keyup', function () {

            if (document.getElementsByName('inputState')[0].value != null) {
                var stateTyped = document.getElementsByName('inputState')[0].value.toLowerCase();
                var inputArr = stateTyped.split(' ');
                if (stateTyped.includes(" ")) {
                    inputArr = stateTyped.split(' ');
                    var stateTyped1 = inputArr[0].charAt(0).toUpperCase() + inputArr[0].slice(1)
                    var stateTyped2 = inputArr[1].charAt(0).toUpperCase() + inputArr[1].slice(1)
                    stateTyped = stateTyped1 + " " + stateTyped2
                } else {
                    stateTyped = stateTyped.charAt(0).toUpperCase() + stateTyped.slice(1);
                }
                //If text is a valid state that appears in this list of senators or governors
                if (isValidState(state_abbr2[stateTyped])) {
                    document.getElementById("right").style.visibility = 'visible';
                    document.getElementById("right").style.display = 'block';

                    document.getElementById("right-alt").style.visibility = 'hidden';
                    document.getElementById("right-alt").style.display = 'none';

                } else {
                    document.getElementById("right").style.visibility = 'hidden';
                    document.getElementById("right").style.display = 'none';

                    document.getElementById("right-alt").style.visibility = 'visible';
                    document.getElementById("right-alt").style.display = 'block';
                }
            }
        });
    }
}





