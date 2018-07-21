
function toggleView() {
    var e = document.getElementById("raceDropdown");
    var selectedOption = e.options[e.selectedIndex].value;

    if (selectedOption === "Default") {
        document.getElementById('head-title').innerHTML = 'United States of America';
        d3.select(".house").selectAll("*").remove();
        d3.select(".senate").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
        document.getElementById("incumbent").disabled = true;
        document.getElementById("incumbent").checked = false;
        document.getElementById("current-map").disabled = true;
        document.getElementsByClassName('text-color')[0].style.color = 'grey';
        document.getElementsByClassName('text-color')[1].style.color = 'grey';

        default_map();
    }
    else if (selectedOption === "United States Senator") {
        document.getElementById('head-title').innerHTML = 'United States Senate';
        d3.select('head-title').transition().style('color', 'red');
        document.getElementById("incumbent").disabled = false;
        document.getElementById("current-map").disabled = false;
        document.getElementsByClassName('text-color')[0].style.color = 'black';
        document.getElementsByClassName('text-color')[1].style.color = 'black';
        d3.select(".house").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
        senate_map();

    } else if (selectedOption === "United States House of Representative") {
        document.getElementById('head-title').innerHTML = 'United States House of Representatives';
        document.getElementById("incumbent").disabled = false;
        document.getElementById("current-map").disabled = false;
        document.getElementsByClassName('text-color')[0].style.color = 'black';
        document.getElementsByClassName('text-color')[1].style.color = 'black';
        d3.select(".senate").selectAll("*").remove();
        d3.select(".governor").selectAll("*").remove();
        house_map();

    } else if (selectedOption === "United States Governor") {
        document.getElementById('head-title').innerHTML = 'United States Governors';
        document.getElementById("incumbent").disabled = false;
        document.getElementById("current-map").disabled = false;
        document.getElementsByClassName('text-color')[0].style.color = 'black';
        document.getElementsByClassName('text-color')[1].style.color = 'black';
        d3.select(".senate").selectAll("*").remove();
        d3.select(".house").selectAll("*").remove();
        governor_map();

    }
}