// Core JS File contains execution code
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { drawChart } from "../js/drawChart.js";

// Execute drawChart function
drawChart();

const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownMenu.addEventListener("change", function() {
    console.log('running')
    drawChart(this.value);
})
