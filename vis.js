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

/**
 * Set up the visualization
 */
function visSetup() {
    // SVG parameters
    config.svg.height = 1000;
    config.svg.width = 900;

    config.svg.margin.top = 50;
    config.svg.margin.right = 50;
    config.svg.margin.bottom = 50;
    config.svg.margin.left = 50;

    // Sub-graph parameters (per sub)
    config.sub.count = 10;                              // The number of plots
    config.sub.columns =  2;                            // The number of plots horizontally
    config.sub.rows = config.sub.count / config.sub.columns;      // The number of plots vertically

    config.sub.margin.between = 20;                     // Margin between plots (vertical and horizontal)
    config.sub.padding.top = 10;
    config.sub.padding.right = 10;
    config.sub.padding.bottom = 10;
    config.sub.padding.left = 10;

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

   create_test_recs();  // Draw some pretty rectangles so we know there are plots being dramwn

   // Load the data then draw the visualization
    csv =  d3.csv("mrc_table2.csv", rowConverter)
        .then(visDraw);

}

/**
 * Draw the visualization once the data is loaded
 */
function visDraw(csv) {
    console.log('csv', csv);

    let data_by_tier = [];
    for (let i = 0; i < 15; i++) {
        data_by_tier.push([]);
    }
    // console.log(data_by_tier);
    for (let thing of csv) {
        // console.log('thing', thing);
        // console.log(thing.tier, typeof thing.tier);
        let tier_index = parseInt(thing.tier) - 1;
        // console.log('tier_index', tier_index);
        // console.log('data_by_tier[tier_index]', data_by_tier[tier_index]);
        data_by_tier[tier_index].push(thing);

    }
    console.log('data_by_tier', data_by_tier);

    // console.log('pizza?')
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
 * @param plot_index the index of the plot - determines where it will be drawn
 * @param data the data to use
 */
function drawSubplot(plot_index, data) {

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


// Helper functions

/**
 * Sophie's helpful helper method to make translating easier. Thank you, Sophie!
 */
function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

visSetup();