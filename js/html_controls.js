

function toggleView() {
    var e = document.getElementById("raceDropdown");
    var selectedOption = e.options[e.selectedIndex].value;
    if (selectedOption === "Default") {
        document.getElementById('head-title').innerHTML = 'Select View';
        d3.select(".house").selectAll("*").remove();
        d3.select(".senate").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
    }
    else if (selectedOption === "United States Senator") {
        document.getElementById('head-title').innerHTML = 'United States Senate';

        d3.select(".house").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
        senate_map();
    } else if (selectedOption === "United States House of Representative") {
        document.getElementById('head-title').innerHTML = 'United States House of Representatives';
        d3.select(".senate").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
        house_map();
    } else if (selectedOption === "United States Governor") {
        document.getElementById('head-title').innerHTML = 'United States Governors';
        d3.select(".senate").selectAll("*").remove();
        d3.select(".house").selectAll("*").remove();
        governor_map();

    }
}