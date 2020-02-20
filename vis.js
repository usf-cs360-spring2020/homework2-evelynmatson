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

    // Create some test rectangles
    let test_rectsG = svg.append('g')
        .attr('id', 'test_rectangles');

    for (let i = 0; i < config.sub.count; i++) {
        test_rectsG.append('rect')
            .attr('width', config.sub.width_each)
            .attr('height', config.sub.height_each)
            .attr('x', config.sub.x(i))
            .attr('y', config.sub.y(i))
            // .attr('transform', translate(config.sub.x(i), config.sub.y(i)))
            .style('fill', 'pink');
    }
    console.log(config)
}

/**
 * Draw the visualization once the data is loaded
 */
function visDraw() {

}


// Helper functions

/**
 * Sophie's helpful helper method to make translating easier. Thank you, Sophie!
 */
function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

visSetup()