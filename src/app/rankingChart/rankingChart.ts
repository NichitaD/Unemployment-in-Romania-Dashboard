import * as d3 from 'd3';

// Constants
const NR_TOTAL_SOMERI = " Numar total someri "
const JUDET = "JUDET";

export class RankingChart {
    private data: Array<any>;
    private element: HTMLElement | null;
    private width: number;
    private height: number;
    private margin: any;
    private plot: any;
    private xScale: any;
    private yScale: any;
    private selectedArea: string;
    private colorDomain: any;

    constructor(data: any, element: HTMLElement | null, selectedArea: string) {
        this.data = data;
        this.element = element;
        this.height = 0;
        this.width = 0;
        this.selectedArea = selectedArea;

        this.colorDomain = d3.scaleLinear<string>().range(['#fef0d9','#b30000']);

        this.colorDomain.domain([
            0, d3.max(data, function(d: any) {
                if(d.JUDET === "Total "){
                    return 0;
                }

                return parseInt(d[NR_TOTAL_SOMERI].replace(",",""))
            })
        ]);

        this.draw();
    }

    /** Initiates all the values and scales, and calls on other functions to build the chart */
    private draw() {
        if (this.element === null) {
            return;
        }

        this.width = this.element.offsetWidth - 150;
        this.height = this.element.offsetHeight - 20;

        this.margin = {
            top: 20,
            right: 40,
            bottom: 0,
            left: 120
        };

        // Set up parent element and SVG
        var svg = d3.select(this.element).append('svg');
        svg.attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + this.height )
                                .attr("preserveAspectRatio", "xMinYMin");

        this.plot = svg.append('g')
                        .attr('transform','translate('+this.margin.left+','+this.margin.top+')');

        let dataset = this.formatData();

        this.createScales(dataset);
        this.addAxes(this.plot);
        this.addBars(this.plot, dataset);
    }

    private createScales(dataset: any) {
        this.xScale = d3.scaleLinear()
            .range([0, this.width])
            .domain([0, parseInt(this.getMaxValue(dataset) || "0") ]);

        this.yScale = d3.scaleBand()
                .rangeRound([this.height, 0])
                .domain(dataset.map(function (d: any) {
                    return d.name;
                }));
    }

    private addAxes(svg: any) {
        //make y axis to show bar names
        let yAxis =  d3.axisLeft(this.yScale).scale(this.yScale).ticks(0);

        let gy = svg.append("g")
                .attr("class", "y-axis")
                .call(yAxis)

    }

    private addBars(svg: any, dataset: any) {
        let bars = svg.selectAll(".bar")
                        .data(dataset)
                        .enter()
                        .append("g")
                        .attr("class", "g-container")

        // Append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y",  (d: any) => {
                return this.yScale(d.name);
            })
            .attr("height", this.yScale.bandwidth() - 3)
            .attr("x", 0)
            .attr("width",  (d: any) => {
                return this.xScale(d.value);
            })
            .attr("fill", (d: any) => this.colorDomain(d.value))

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y",  (d: any) => {
                return this.yScale(d.name) + this.yScale.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", (d:any) => {
                return this.xScale(d.value) + 3;
            })
            .text(function (d: any) {
                return d.value;
            });
    }

    private formatData() {

        let dataset:Array<any> = [];

        this.data.forEach(set => {
            dataset.push({
                name: set[JUDET].charAt(0) + set[JUDET].slice(1).toLowerCase(),
                value: parseInt(set[NR_TOTAL_SOMERI].replace(",","").trim())
            });
        });

        dataset.sort((a, b) => {
            return a.value - b.value;
        });

        // Remove the total column
        dataset.pop();

        return dataset;
    }

    private getMaxValue(dataset: any) {
        return d3.max(dataset, function (d: any) {
            return d.value;
        })
    }

    public updateData(newData: any, selectedArea: string) {

        this.data = newData;
        let dataset = this.formatData();

        this.xScale = d3.scaleLinear()
            .range([0, this.width])
            .domain([0, parseInt(this.getMaxValue(dataset) || "0") ]);

        this.yScale = d3.scaleBand()
                .rangeRound([this.height, 0])
                .domain(dataset.map(function (d: any) {
                    return d.name;
                }));

        //make y axis to show bar names
        let yAxis =  d3.axisLeft(this.yScale).scale(this.yScale).ticks(0);

        let gy = this.plot.select(".y-axis").call(yAxis);

        let bars = this.plot.selectAll(".g-container").data(dataset);

        // Append rects
        bars.select(".bar")
            .attr("y",  (d: any) => {
                return this.yScale(d.name);
            })
            .attr("height", this.yScale.bandwidth() - 3)
            .attr("x", 0)
            .attr("width",  (d: any) => {
                return this.xScale(d.value);
            });

         //add a value label to the right of each bar
         bars.select(".label")
            //y position of the label is halfway down the bar
            .attr("y",  (d: any) => {
                return this.yScale(d.name) + this.yScale.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", (d:any) => {
                return this.xScale(d.value) + 3;
            })
            .text(function (d: any) {
                return d.value;
            });
    }
}