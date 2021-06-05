// names
// metadata
// samples
function buildMetaData(sample) {
    // Use D3 fetch to read the JSON file
    d3.json("samples.json").then((data) => {
        var metaData = data.metaData;
        var resultsArray = metaData.filter(sampleObject => sampleObject.id == sample);
        var result = resultsArray[0]
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append('h6').text(`${key}: ${value}`);
        });
    });
};
buildMetaData();
// console.log("hello")
function buildCharts(sample) {
    d3.json("static/js/samples.json").then((data) => {
    // d3.json("static/js/samples.json").then((data) => {
        console.log(data)
        var samples = data.samples;
        var resultsArray = samples.filter(sampleObject2 => sampleObject2.id == sample);
        var result = resultsArray[0]

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        var bubbleLayout = {
            margin: {t: 0},
            xaxis: {title: 'IDs'},
            hovermode: 'closest',
        };

        var bubbleData = [{
            x: ids,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: values
            }
        }];
        
        Plotly.plot('bubble', bubbleLayout, bubbleData);

        var barLayout = {
            title: 'Top 10 Bacteria',
            margin: {t: 20, l: 150}
        };

        var barData = [{
            x: values.slice(0, 10).reverse(),
            y: ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
            text: labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        Plotly.newPlot('bar', barLayout, barData);
    });

};
buildCharts();

function dashboard() {
    // dropdown select element
    var selector = d3.select("#selectData");
    
    // create select options using names from sample
    d3.json("static/js/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // following code used from help of classmate Will Walles
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}
    
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample)
}
    
// Initialize the dashboard
dashboard();