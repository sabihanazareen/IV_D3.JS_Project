// Read the CSV data
d3.csv("data.csv").then(function(data) {
    // Convert PurchaseAmount and FamilySize to numeric values
    data.forEach(function(d) {
        d.PurchaseAmount = +d.PurchaseAmount;
        d.FamilySize = +d.FamilySize;
    });

    // Visualization 1: Bar chart for average purchase by gender
    var avgPurchaseByGender = d3.group(data, d => d.Gender);

    var barSvg = d3.select("#barChart")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    var x = d3.scaleBand()
        .domain(Array.from(avgPurchaseByGender.keys()))
        .range([80, 480])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.PurchaseAmount; })])
        .range([300, 20]);

    var bars = barSvg.selectAll("rect")
        .data(Array.from(avgPurchaseByGender.entries()))
        .enter().append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d3.mean(d[1], function(v) { return v.PurchaseAmount; })); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return 300 - y(d3.mean(d[1], function(v) { return v.PurchaseAmount; })); })
        .attr("fill", function(d, i) { return i === 0 ? "steelblue" : "orange"; })
        .on("mouseover", function(event, d) {
            var selectedGender = d[0];
            var avgPurchase = d3.mean(d[1], function(v) { return v.PurchaseAmount; }).toFixed(2);
            showTooltip(event.pageX, event.pageY, "<div class='tooltip-card'><span class='tooltip-header'>Gender: " + selectedGender + "</span><br/>Average Purchase: " + avgPurchase + "</div>");
        })
        .on("mouseout", function() {
            hideTooltip();
        })
        .on("click", function(event, d) {
            var selectedGender = d[0];
            var filteredData = data.filter(function(d) { return d.Gender === selectedGender; });

            updateLineChart(filteredData);
            updatePieChart(filteredData);
        });

    bars.append("title")
        .text(function(d) { 
            var selectedGender = d[0];
            var avgPurchase = d3.mean(d[1], function(v) { return v.PurchaseAmount; }).toFixed(2);
            return "Gender: " + selectedGender + ", Avg Purchase: " + avgPurchase; 
        });

    barSvg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(d3.axisBottom(x));

    barSvg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(80, 0)")
        .call(d3.axisLeft(y));

    barSvg.append("text")
        .attr("x", 300)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("Average Purchase by Gender")
        .style("font-size", "18px");

    barSvg.append("text")
        .attr("x", 300)
        .attr("y", 350)
        .attr("text-anchor", "middle")
        .text("Gender")
        .style("font-size", "14px");

    barSvg.append("text")
        .attr("x", -200)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("Purchase Amount")
        .style("font-size", "14px")
        .attr("transform", "rotate(-90)");

    // Legend for Bar chart
    var legendBar = barSvg.selectAll(".legend")
        .data(["Male", "Female"])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(-30," + (i * 20 + 10) + ")"; });

    legendBar.append("circle")
        .attr("cx", 550)
        .attr("cy", 5)
        .attr("r", 5)
        .style("fill", function(d, i) { return i === 0 ? "steelblue" : "orange"; });

    legendBar.append("text")
        .attr("x", 560)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    // Visualization 2: Multi-line chart for average purchase by gender and family size
    var lineSvg = d3.select("#lineChart")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    var yLine = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.PurchaseAmount; })])
        .range([300, 20]);

    var yLineAxis = d3.axisLeft(yLine);

    lineSvg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(80, 0)")
        .call(yLineAxis);

    lineSvg.append("line")
        .attr("x1", 80)
        .attr("y1", 20)
        .attr("x2", 80)
        .attr("y2", 300)
        .attr("stroke", "black");

    var xLine = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.FamilySize; }), d3.max(data, function(d) { return d.FamilySize; })])
        .range([80, 480]);

    var xLineAxis = d3.axisBottom(xLine);

    lineSvg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(xLineAxis);

    lineSvg.append("text")
        .attr("x", 300)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("Average Purchase by Family Size and Gender")
        .style("font-size", "18px");

    lineSvg.append("text")
        .attr("x", 300)
        .attr("y", 350)
        .attr("text-anchor", "middle")
        .text("Family Size")
        .style("font-size", "14px");

    lineSvg.append("text")
        .attr("x", -200)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .text("Purchase Amount")
        .style("font-size", "14px")
        .attr("transform", "rotate(-90)");

    // Legend for Line chart
    var legendLine = lineSvg.selectAll(".legend")
        .data(["Male", "Female"])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(-30," + (i * 20 + 10) + ")"; });

    legendLine.append("circle")
        .attr("cx", 550)
        .attr("cy", 5)
        .attr("r", 5)
        .style("fill", function(d, i) { return i === 0 ? "steelblue" : "orange"; });

    legendLine.append("text")
        .attr("x", 560)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    // Visualization 3: Pie chart for payment methods
    var pieSvg = d3.select("#pieChart")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400)
        .append("g")
        .attr("transform", "translate(300,200)");

    var paymentData = d3.group(data, d => d.PaymentMethod);

    var pie = d3.pie()
        .value(function(d) { return d[1].length; });

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(150);

    var arcs = pieSvg.selectAll("arc")
        .data(pie(paymentData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) { return d3.schemeCategory10[i]; })
        .on("mouseover", function(event, d) {
            var paymentMethod = d.data[0];
            var percentage = d3.format(".1%")(d.data[1].length / data.length);
            showTooltip(event.pageX, event.pageY, "<div class='tooltip-card'><span class='tooltip-header'>Payment Method: " + paymentMethod + "</span><br/>Percentage: " + percentage + "</div>");
        })
        .on("mouseout", function() {
            hideTooltip();
        });

    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .text(function(d) { return d3.format(".1%")(d.data[1].length / data.length); })
        .style("text-anchor", "middle")
        .style("font-size", "12px");

    pieSvg.append("text")
        .attr("x", 0)
        .attr("y", -170)
        .attr("text-anchor", "middle")
        .text("Payment Methods Distribution")
        .style("font-size", "18px");

    // Legend for Pie chart
    var legendPie = pieSvg.selectAll(".legend")
        .data(paymentData.keys())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (i * 100 - 250) + ", 170)"; });

    legendPie.append("circle")
        .attr("cx", 10)
        .attr("cy", 5)
        .attr("r", 5)
        .style("fill", function(d, i) { return d3.schemeCategory10[i]; });

    legendPie.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    // Tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");

    function showTooltip(x, y, content) {
        tooltip.html(content)
            .style("left", (x + 10) + "px")
            .style("top", (y - 10) + "px")
            .style("opacity", 1);
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }

    function updateLineChart(filteredData) {
        var avgPurchaseByGenderAndFamilySize = d3.group(filteredData, d => d.Gender, d => d.FamilySize);

        lineSvg.selectAll(".dot").remove();
        lineSvg.selectAll("path").remove();

        var familySizes = Array.from(new Set(filteredData.map(d => d.FamilySize)));
        var xLine = d3.scaleLinear()
            .domain([d3.min(familySizes), d3.max(familySizes)])
            .range([80, 480]);

        var xLineAxis = d3.axisBottom(xLine);

        lineSvg.select(".x-axis")
            .attr("transform", "translate(0," + 300 + ")")
            .call(xLineAxis);

        for (let [gender, group] of avgPurchaseByGenderAndFamilySize) {
            var line = d3.line()
                .x(function(d) { return xLine(d[0]); })
                .y(function(d) { return yLine(d3.mean(d[1], function(v) { return v.PurchaseAmount; })); });

            lineSvg.append("path")
                .datum(group)
                .attr("fill", "none")
                .attr("stroke", gender === "Female" ? "steelblue" : "orange")
                .attr("stroke-width", 2)
                .attr("d", line);

            lineSvg.selectAll(".dot")
                .data(group)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function(d) { return xLine(d[0]); })
                .attr("cy", function(d) { return yLine(d3.mean(d[1], function(v) { return v.PurchaseAmount; })); })
                .attr("r", 4)
                .style("fill", gender === "Female" ? "steelblue" : "orange")
                .on("mouseover", function(event, d) {
                    var familySize = d[0];
                    var avgPurchase = d3.mean(d[1], function(v) { return v.PurchaseAmount; }).toFixed(2);
                    showTooltip(event.pageX, event.pageY, "<div class='tooltip-card'><span class='tooltip-header'>Average Purchase: " + avgPurchase + "</span></div>");
                })
                .on("mouseout", function() {
                    hideTooltip();
                });
        }
    }

    function updatePieChart(filteredData) {
        var paymentDataFiltered = d3.group(filteredData, d => d.PaymentMethod);

        pieSvg.selectAll(".arc").remove();

        var arcs = pieSvg.selectAll("arc")
            .data(pie(paymentDataFiltered))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) { return d3.schemeCategory10[i]; })
            .on("mouseover", function(event, d) {
                var paymentMethod = d.data[0];
                var percentage = d3.format(".1%")(d.data[1].length / filteredData.length);
                showTooltip(event.pageX, event.pageY, "<div class='tooltip-card'><span class='tooltip-header'>Payment Method: " + paymentMethod + "</span><br/>Percentage: " + percentage + "</div>");
            })
            .on("mouseout", function() {
                hideTooltip();
            });

        arcs.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .text(function(d) { return d3.format(".1%")(d.data[1].length / filteredData.length); })
            .style("text-anchor", "middle")
            .style("font-size", "12px");
    }

    // Initial line chart and pie chart
    updateLineChart(data);
    updatePieChart(data);

});
