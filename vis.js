// Global Variables
let scales = {};
let config = {
    'svg' : {
        'margin' : {}
    },
    'sub' : {
        'margin': {},
        'padding': {}
    },
};
let axes = {};
let csv;

let parent_quint_names = ['0', '1', '2', '3', '4'];
let tier_names = [
    'Ivy Plus',
    'Other Elite Schools (Public and Private)',
    'Highly Selective Public',
    'Highly Selective Private',
    'Selective Public',
    'Selective Private',
    'Nonselective 4-year Public',
    'Nonselective 4-year Private Not-for-Profit',
    'Two-year (Public and Private Not-for-Profit)',
    'Four-year for-profit',
    'Two-year for-profit',
    'Less than two year schools of any type ',
    'Attending college with insufficient data',
    'Not in college between the ages of 19-22'];

/**
 * Set up the visualization
 */
function visSetup() {
    // SVG parameters
    config.svg.height = 1000;
    config.svg.width = 900;

    config.svg.margin.top = 30;
    config.svg.margin.right = 20;
    config.svg.margin.bottom = 170;
    config.svg.margin.left = 20;

    // Sub-graph parameters (per sub)
    config.sub.count = 8;                              // The number of plots
    config.sub.columns =  2;                            // The number of plots horizontally
    config.sub.rows = config.sub.count / config.sub.columns;      // The number of plots vertically

    config.sub.margin.between = 20;                     // Margin between plots (vertical and horizontal)

    config.sub.padding.top = 40;
    config.sub.padding.right = 10;
    config.sub.padding.bottom = 25;
    config.sub.padding.left = 50;

    config.sub.height_each = (config.svg.height
        - config.svg.margin.top
        - config.svg.margin.bottom
        - (config.sub.margin.between
            * (config.sub.rows - 1)))
        / config.sub.rows;

    config.sub.width_each = (config.svg.width
        - config.svg.margin.right
        - config.svg.margin.left
        - (config.sub.margin.between
            * (config.sub.columns - 1)))
        / config.sub.columns;

    config.sub.x = function(plot_index) {
        let column = plot_index % 2;
        return config.svg.margin.left + column * (config.sub.margin.between + config.sub.width_each);
    };
    config.sub.y = function(plot_index) {
        let row = Math.floor(plot_index /2);
        return config.svg.margin.top + row * (config.sub.margin.between + config.sub.height_each);
    };

    // Set up the svg
    svg = d3.select('#vis_svg')
        .attr('width', config.svg.width)
        .attr('height', config.svg.height);

    // Set up the scales
    scales.y = d3.scaleLinear()
        .domain([0,1])
        .range([config.sub.height_each - config.sub.padding.bottom, config.sub.padding.top]);
        // .ticks(5);

    scales.x = d3.scalePoint()
        .range([config.sub.padding.left, config.sub.width_each - config.sub.padding.right])
        .domain(parent_quint_names)      // Hardcode the parent quintile indices as strings
        .padding(0);

    scales.color = d3.scaleSequential(d3.interpolateViridis)
        .domain([0,4]);

    // Set up the axes
    axes.x = d3.axisBottom(scales.x)
        .ticks(5)
        .tickFormat(function (x) {
            return parseInt(x) + 1;
        })
        .tickSize(0);
    axes.y = d3.axisLeft(scales.y)
        .ticks(4)
        .tickFormat( function (x) {
            return (parseFloat(x) * 100) + '%'
        });

   // Load the data then draw the visualization
    csv =  d3.csv("mrc_table2.csv", rowConverter)
        .then(visDraw);
}

/**
 * Draw the visualization once the data is loaded
 */
function visDraw(csv) {
    console.log('csv', csv);

    // create_test_recs();  // Draw some pretty rectangles so we know there are plots being dramwn

    let data_by_tier = [];
    for (let i = 0; i < config.sub.count; i++) {
        data_by_tier.push([]);
    }
    // Do some more processing
    for (let row of csv) {
        if(parseInt(row.tier) > config.sub.count) {
            continue;
        }

        let tier_index = parseInt(row.tier) - 1;
        for (let pq in row.parQuints) {
            data_by_tier[tier_index].push({
                'college_name' : row.college_name,
                'tier' : row.tier,
                'parent_quint' : pq,
                'values': row.parQuints[pq]
            })
        }
    }

    console.log('data_by_tier', data_by_tier);

    // Draw a visualization (subplot) and the axes for each tier
    for (let [index, tierData] of data_by_tier.entries()) {
        drawSubplot(index, tierData);
        drawAxes(index);
        drawText(index);
    }

    // Draw the legends
    drawLegend();
}

/**
 * Convert one row during data loading
 * @param row the raw input row to convert
 */
function rowConverter(row) {
    // if(row.name === "Academy Of Art University") {
    //     console.log(row);
    // }

    let to_return = {};
    // to_return.data = [];
    to_return.college_name = row.name;
    to_return.tier = row.tier;
    to_return.parQuints = {
        '1' : [],
        '2' : [],
        '3' : [],
        '4' : [],
        '5' : []        // each index is the p value for kids becoming a given quintile
    };

    // Add the data for kids becoming quintile 1
    to_return.parQuints['1'].push(row['kq1_cond_parq1']);
    to_return.parQuints['2'].push(row['kq1_cond_parq2']);
    to_return.parQuints['3'].push(row['kq1_cond_parq3']);
    to_return.parQuints['4'].push(row['kq1_cond_parq4']);
    to_return.parQuints['5'].push(row['kq1_cond_parq5']);

    // Add the data for kids becoming quintile 2
    to_return.parQuints['1'].push(row['kq2_cond_parq1']);
    to_return.parQuints['2'].push(row['kq2_cond_parq2']);
    to_return.parQuints['3'].push(row['kq2_cond_parq3']);
    to_return.parQuints['4'].push(row['kq2_cond_parq4']);
    to_return.parQuints['5'].push(row['kq2_cond_parq5']);

    // Add the data for kids becoming quintile 3
    to_return.parQuints['1'].push(row['kq3_cond_parq1']);
    to_return.parQuints['2'].push(row['kq3_cond_parq2']);
    to_return.parQuints['3'].push(row['kq3_cond_parq3']);
    to_return.parQuints['4'].push(row['kq3_cond_parq4']);
    to_return.parQuints['5'].push(row['kq3_cond_parq5']);

    // Add the data for kids becoming quintile 4
    to_return.parQuints['1'].push(row['kq4_cond_parq1']);
    to_return.parQuints['2'].push(row['kq4_cond_parq2']);
    to_return.parQuints['3'].push(row['kq4_cond_parq3']);
    to_return.parQuints['4'].push(row['kq4_cond_parq4']);
    to_return.parQuints['5'].push(row['kq4_cond_parq5']);

    // Add the data for kids becoming quintile 5
    to_return.parQuints['1'].push(row['kq5_cond_parq1']);
    to_return.parQuints['2'].push(row['kq5_cond_parq2']);
    to_return.parQuints['3'].push(row['kq5_cond_parq3']);
    to_return.parQuints['4'].push(row['kq5_cond_parq4']);
    to_return.parQuints['5'].push(row['kq5_cond_parq5']);

    // Also do it a basic way so i can confirm accuracy
    // to_return["kq1_cond_parq1"] = row["kq1_cond_parq1"];
    // to_return["kq1_cond_parq2"] = row["kq1_cond_parq2"];
    // to_return["kq1_cond_parq3"] = row["kq1_cond_parq3"];
    // to_return["kq1_cond_parq4"] = row["kq1_cond_parq4"];
    // to_return["kq1_cond_parq5"] = row["kq1_cond_parq5"];
    //
    // to_return["kq2_cond_parq1"] = row["kq2_cond_parq1"];
    // to_return["kq2_cond_parq2"] = row["kq2_cond_parq2"];
    // to_return["kq2_cond_parq3"] = row["kq2_cond_parq3"];
    // to_return["kq2_cond_parq4"] = row["kq2_cond_parq4"];
    // to_return["kq2_cond_parq5"] = row["kq2_cond_parq5"];
    //
    // to_return["kq3_cond_parq1"] = row["kq3_cond_parq1"];
    // to_return["kq3_cond_parq2"] = row["kq3_cond_parq2"];
    // to_return["kq3_cond_parq3"] = row["kq3_cond_parq3"];
    // to_return["kq3_cond_parq4"] = row["kq3_cond_parq4"];
    // to_return["kq3_cond_parq5"] = row["kq3_cond_parq5"];
    //
    // to_return["kq4_cond_parq1"] = row["kq4_cond_parq1"];
    // to_return["kq4_cond_parq2"] = row["kq4_cond_parq2"];
    // to_return["kq4_cond_parq3"] = row["kq4_cond_parq3"];
    // to_return["kq4_cond_parq4"] = row["kq4_cond_parq4"];
    // to_return["kq4_cond_parq5"] = row["kq4_cond_parq5"];
    //
    // to_return["kq5_cond_parq1"] = row["kq5_cond_parq1"];
    // to_return["kq5_cond_parq2"] = row["kq5_cond_parq2"];
    // to_return["kq5_cond_parq3"] = row["kq5_cond_parq3"];
    // to_return["kq5_cond_parq4"] = row["kq5_cond_parq4"];
    // to_return["kq5_cond_parq5"] = row["kq5_cond_parq5"];

    return to_return;
}

/**
 * Draw one of the sub plots
 * @param subPlot_index the index of the plot - determines where it will be drawn
 * @param data the data to use
 */
function drawSubplot(subPlot_index, data) {
    console.log("data for subplot", subPlot_index, data);

    let drawingG = d3.select('g#drawing')
        .append('g')
        .attr('class', 'subPlotDrawingG')
        .attr('id', subPlot_index)
        .attr('transform', translate(config.sub.x(subPlot_index), config.sub.y(subPlot_index)))
        .attr('width', config.sub.width_each)
        .attr('height', config.sub.height_each);

    drawingG.selectAll('line')
        .data(data)
        .enter()
        .append('path')
        .attr('d', function (dRow) {
            // return d3.line()
            //     .line(dRow.values)
            //     .x((d, index) => scales.x(index))
            //     .y((d, index) => scales.y(dRow.values[index]));
            return d3.line()(parent_quint_names.map(function(p) { return [scales.x(p), scales.y(dRow["values"][parseInt(p)])]; }))
        })
        // .style("stroke", "#44BBCC")
        .style('stroke', (p) => scales.color(p.parent_quint))
        .style('fill', 'none')
        .style('width', 2)
        .style('opacity', 0.3);


    // drawingG.append('path')
    //     .attr('d', d3.line()(
    //         ['0','1','2','3','4'].map(function (p) {
    //             return [scales.x(p), scales.y(.5)];
    //         })))
    //     .style("stroke", "black")
    //     .style('fill', 'none')
    //     .style('width', 4)
    //     .style('opacity', 0.5);

}

/**
 * Draw some test rectangles to show the plots
 */
function create_test_recs() {
    // Create some test rectangles
    let test_rectsG = svg.select('g#test-rectangles');
    // .attr('id', 'test_rectangles');
    for (let i = 0; i < config.sub.count; i++) {
        test_rectsG.append('rect')
            .attr('width', config.sub.width_each)
            .attr('height', config.sub.height_each)
            .attr('x', config.sub.x(i))
            .attr('y', config.sub.y(i))
            // .attr('transform', translate(config.sub.x(i), config.sub.y(i)))
            .style('fill', '#ffedf7');
    }
}

/**
 * Text is annoyingly hard
 */
function drawText(subPlot_index) {
    let titlesG = d3.select('g#titles');

    let middlex = midpoint(scales.x.range());
    let middle_y = midpoint(scales.y.range());

    // Tier title
    let title = titlesG.append('text')
        .text(tier_names[subPlot_index] + ' :')
        .attr('class','tier_title')
        .attr('id', subPlot_index)
        .attr('x', config.sub.x(subPlot_index) + 20)
        .attr('y', config.sub.y(subPlot_index) + 25);

    // Y axes label
    let y_group = titlesG.append('g')
        .attr('transform', translate(config.sub.x(subPlot_index), config.sub.y(subPlot_index)));
    let y_label = y_group.append('text')
        .text('% of kids in income quintile')
        .attr('class', 'y_label')
        .attr('id', subPlot_index)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270)')
        .attr('y', 15)
        .attr('x', -middle_y);
}

/**
 * Somehow I need a legend?
 */
function drawLegend() {
    let legendsG = d3.select('#legends');

    // Color Legend
    let colorLeg = legendsG.append('g')
        .attr('class', 'legend')
        .attr('id', 'color-leg')
        .attr('transform', translate(config.svg.margin.right,config.svg.height - config.svg.margin.bottom));

    let betweenEntries = 20;
    // let sqSize = 12;
    let legTitleHeight = 25;
    for (let [index, thing] of parent_quint_names.entries()) {
        // Make a group for this entry in the legend
        let entryG = colorLeg.append('g')
            .attr('class', 'colorLegEntry')
            .attr('id', index)
            .attr('transform', translate(10, 20 + index * (betweenEntries) + legTitleHeight));

        let rect = entryG.append('rect')
            .attr('fill', scales.color(thing));

        let extra = [' (least wealthy)', '', '', '', ' (most wealthy)'];
        let text = entryG.append('text')
            .attr('class', 'color-leg-label')
            .text("Kids of parents in quintile " + (index + 1) + extra[index])
            .attr('x', betweenEntries)
            .attr('dy', 10)
            .attr('fill', '#666666');
    }
    colorLeg.append('text')
        .text('Line Colors :')
        .attr('class', 'tier_title' )
        .attr('x', 10)
        .attr('y', 35);
}

/**
 * Draw all the axes on one subplot
 * @param subPlot_index the index of the subplot to draw
 */
function drawAxes(subPlot_index) {

    console.log('call to drawAxes with subPlot_index = ', subPlot_index);
    let allAxesG = d3.select('g#axes');

    // Make a group for this subplot's axes
    let subAxesG = allAxesG.append('g')
        .attr('class','subPlotAxesG')
        .attr('id', subPlot_index)
        .attr('transform', translate(config.sub.x(subPlot_index), config.sub.y(subPlot_index)))
        // .attr('width', config.sub.width_each)
        // .attr('height', config.sub.height_each);
    // console.log('hello?');

    // X axis
    let xAxisG = subAxesG.append('g')
        .attr('class', 'xAxis')
        .attr('id', subPlot_index)
        .attr('transform', translate(-5, config.sub.height_each - 20));
        // .attr('width', config.sub.width_each - 50);
    xAxisG.call(axes.x);

    // Y axes
    for (let pq of parent_quint_names) {
        let axisG = subAxesG.append('g')
            .attr('class', 'yAxis')
            .attr('id', subPlot_index + "_" + pq)
            .attr('transform', translate(scales.x(pq), 0));
        axisG.call(axes.y);

        // // Shift the ticks
        // axisG.selectAll('.tick')
        //     // .style('text-anchor', 'start')
        //     .attr('x', 6)
        //     .attr('y', -6);
    }
}

// Helper functions

/**
 * Sophie's helpful helper method to make translating easier. Thank you, Sophie!
 */
function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

/**
 * Calculates the midpoint of a range given as a 2 element array
 * @source Sophie! Thank you.
 */
function midpoint(range) {
    return range[0] + (range[1] - range[0]) / 2.0;
}


visSetup();

// Inspiration: https://www.d3-graph-gallery.com/graph/parallel_basic.html