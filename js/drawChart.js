import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
export function drawChart(sortingOption) {

    const svg = d3.select("#chart-group");
    svg.selectAll("*").remove();
    // Get viewport dimensions
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );

    // Set Margins
    const chartMargin = {
        left: vw > 900 ? `75` : vw > 600 ? `60` : `50`,
        right: vw > 600 ? `20` : `10`,
        top: vw > 900 ? `75` : vw > 600 ? `60` : `35`,
        bottom: vw > 900 ? `40` : vw > 600 ? `30` : `10`,
    };

    // Set dynamic height & width according to container
    const height =
        document.querySelector("#chart-svg").getBoundingClientRect().height -
        chartMargin.bottom;
    const width =
        document.querySelector("#chart-svg").getBoundingClientRect().width -
        chartMargin.right;

    // Load Data
    d3.csv('../data/grouped.csv').then(function(data) {

        const maxValue = Math.max(...data.map(d => +d['FA Cup Final Appearances']))

        const sortedData = sortingOption == "League Position 23/24" ? d3.sort(data, d => -d["league_position"]) : d3.sort(data, d => +d['FA Cup Final Appearances'])

        // Set Scales
        const xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([chartMargin.left, width - chartMargin.right]);

        const color = d3.scaleLinear([0, maxValue], ["#FFA5A5", "#E42121"]);

        const yScale = d3
            .scaleBand()
            .domain(sortedData.map(d => d['short_name']))
            .range([height, chartMargin.bottom]);

        // Add Empty Tooltip
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", 'tooltip')
            .style("fill", "#fff")
            .style("display", "none");


        // Add Bar Dividers
        svg
            .append("g")
            .attr("class", 'chart-axis')
            .attr("transform", "translate(0," + height + ")")
            .attr('stroke-width', 1)
            .attr('stroke-color', '#fff')
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(maxValue)
                    .tickSize(-(height - (chartMargin.bottom)))
                    .tickFormat(""),
            );
        // Draw Y Axis
        svg
            .append("g")
            .attr("class", 'chart-axis y-axis')
            .attr("transform", "translate(" + chartMargin.left + ",0)")
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(0)
                    .tickPadding(10)
                    .tickFormat(d => d),
            );

        // Draw Bars
        svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr('stroke-width', 10)
            .attr('stroke', 'white')
            .attr("x", chartMargin.left)
            .attr("y", d => yScale(d['short_name']))
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d['FA Cup Final Appearances']) - chartMargin.left)
            .style("fill", d => color(d['FA Cup Final Appearances']))
            .on("mouseover", () => {
                tooltip.style("display", "flex");
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            })
            .on("touchmove mousemove", (event, d) => {
                tooltip
                    .html(
                        `
                        <div class="tooltip-content-container">     
                            <div class="tooltip-header-container">
                                <img class="tooltip-club-logo" src="../assets/img/${d['short_name']}.png" alt="${d['short_name']}" />
                                <p class="tooltip-text tooltip-club-text">${d['club']}</p>
                            </div>
                            <p class="tooltip-text tooltip-coach-text">${d['Head Coach']}</p>
                            <p class="tooltip-text"><strong>${parseInt(d['FA Cup Final Appearances'])}</strong> FA Cup Final Appearances</p>
                        </div>
                        `

                    )
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 28 + "px");
            });

        // Add Bar Dividers
        svg
            .append("g")
            .attr("class", 'chart-axis x-axis-grid')
            .attr("transform", "translate(0," + height + ")")
            .attr('stroke-width', 4)
            .attr('stroke-color', '#fff')
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(maxValue)
                    .tickSize(-(height - (chartMargin.bottom)))
                    .tickFormat(""),
            );

        // Draw X Axis
        svg
            .append("g")
            .attr("class", 'chart-axis')
            .attr("transform", `translate(0,${chartMargin.top - 30})`)
            .call(
                d3
                    .axisTop(xScale)
                    .ticks(20)
                    .tickPadding(10),
            );

        // Add Images to Y Axis
        svg.select(".y-axis").selectAll(".tick")
            .data(sortedData)
            .append("png:image")
            .attr("xlink:href", function (d) { return  '../assets/img/' + d['short_name'] + '.png'; })
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", -60)
            .attr("y", -7);
    });

}


drawChart();