import * as d3 from 'd3';
import { NR_TOTAL_SOMERI } from '../index'
import { JUDET } from '../mapChart/mapChart';
import { ROMANIA_CODE } from '../mapChart/mapChart';
/**
 * A class that builds a line chart based on the received parameters
 */
export class LineChart {

    private data: Array<any>;
    private element: HTMLElement | null;
    private width: number;
    private height: number;
    private margin: any;
    private plot: any;
    private minDate: Date;
    private maxDate: Date;
    private xScale: any;
    private yScale: any;
    private leftPadding: string;
    private selectedArea: string;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    constructor(data: any, element: HTMLElement | null, selectedArea: string) {
        this.data = data;
        this.element = element;
        this.height = 0;
        this.width = 0;
        this.selectedArea = selectedArea;
        this.minDate = new Date('2020-01-01T00:00:00Z'); // January 2020
        this.maxDate = new Date('2020-04-01T00:00:00Z'); // April 2020
        this.leftPadding = "12";

        this.draw();
    }

    /** Initiates all the values and scales, and calls on other functions to build the chart */
    private draw() {
        if (this.element === null) {
            return;
        }

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;

        this.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 80
        };

        // Set up parent element and SVG
        var svg = d3.select(this.element).append('svg');
        svg.attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + this.height )
                                .attr("preserveAspectRatio", "xMinYMin");

        this.plot = svg.append('g')
                        .attr('transform','translate('+this.margin.left+','+this.margin.top+')');

        this.tooltip = d3.select(".lineChart").append("div").attr("class", "tooltip").style("opacity", 0);

        // Create the other stuff
        this.createScales();
        this.addAxes();
        this.addLine();
    }

    private createScales() {

        let yExtent = [250000, d3.max(this.data, (d) => {
            return this.formatValue(d.data[42][NR_TOTAL_SOMERI]) + 2000
        }) || 250000];

        this.xScale = d3.scaleUtc().domain([this.minDate, this.maxDate])
                                    .range([0, this.width - this.margin.right]);

        this.yScale = d3.scaleLinear().domain(yExtent)
                                    .range([this.height-(this.margin.top+this.margin.bottom), 0]);
    }

    private addAxes() {
        var xAxis = d3.axisBottom(this.xScale).scale(this.xScale).ticks(4);
        (xAxis as any).tickFormat(d3.timeFormat("%B"))
        var yAxis = d3.axisLeft(this.yScale).ticks(5);

        this.plot.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(${this.leftPadding},${(this.height-(this.margin.top + this.margin.bottom))})`)
                .attr("margin-left", "12px")
                .call(xAxis);

        this.plot.append("g")
                .attr("class", "y-axis")
                .call(yAxis)
    }

    private formatValue(value: string): number {
        return parseInt(value.replace(",","").trim())
    }

    private addLine() {
        let line = d3.line()
                    .x((d: any) => this.xScale(this.getDate(d.month)))
                    .y((d: any) => this.yScale(this.formatValue(d.data[42][NR_TOTAL_SOMERI])))

        this.plot.append('path')
                .datum(this.data)
                .classed('line-path',true)
                .attr('d',line)
                .attr("transform", `translate(${this.leftPadding}, 0)`)
                .attr("fill", 'none')
                .attr('stroke-width', '4px');


        let areaCode = this.selectedArea.toUpperCase();
        if(this.selectedArea == "Romania") {
            areaCode = ROMANIA_CODE;
        }

        this.plot.selectAll(".dot")
                .data(this.data)
                .enter()
                .append("circle") // Uses the enter().append() method
                .attr("class", "line-chart-dots") // Assign a class for styling
                .attr("cx", (d: any) => this.xScale(this.getDate(d.month)))
                .attr("cy", (d: any) => this.yScale(this.formatValue(d.data[42][NR_TOTAL_SOMERI])))
                .attr("r", 6)
                .attr("transform", `translate(${this.leftPadding}, 0)`)
                .on("mouseover", (d: any) => {
                    let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                    this.tooltip.transition().duration(500).style("opacity", .85);
                    this.tooltip.html("<strong>"+ selectedState[NR_TOTAL_SOMERI].replace(",","").trim() + "</strong>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY -28) + "px")
                })
                .on("mouseout", (d: any) => {
                    this.tooltip.transition().duration(300)
                            .style("opacity", 0);
                })

    }

    private getDate (month: string) {
        switch(month) {
            case "Ianuarie":
              return new Date(2020, 0, 1, 5);
            case "Februarie":
                return new Date(2020, 1, 1);
            case "Martie":
                return new Date(2020, 2, 1);
            case "Aprilie":
                return new Date(2020, 3, 1);
          }
    }

    public updateData(newData: any, selectedArea: string) {
        this.selectedArea = selectedArea.toUpperCase();

        let areaCode = this.selectedArea == "ROMANIA" ? ROMANIA_CODE : this.selectedArea;

        let yExtent = [d3.min(this.data, (d, i) => {
                            let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                            return this.formatValue(selectedState[NR_TOTAL_SOMERI]) - 2000
                        }) || 0,
                        d3.max(this.data, (d) => {
                            let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                            return this.formatValue(selectedState[NR_TOTAL_SOMERI]) + 2000
                        }) || 0];

        this.xScale = d3.scaleUtc().domain([this.minDate, this.maxDate])
                                    .range([0, this.width - this.margin.right]);

        this.yScale = d3.scaleLinear().domain(yExtent)
                                    .range([this.height-(this.margin.top+this.margin.bottom), 0]);

        let xAxis = d3.axisBottom(this.xScale).scale(this.xScale).ticks(4);
        (xAxis as any).tickFormat(d3.timeFormat("%B"))

        let yAxis = d3.axisLeft(this.yScale).ticks(5);

        let line = d3.line()
                    .x((d: any) => this.xScale(this.getDate(d.month)))
                    .y((d: any) => {
                        let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                        return this.yScale(this.formatValue(selectedState[NR_TOTAL_SOMERI]))
                    });

        this.plot.selectAll('.line-path')
                .datum(this.data)
                .attr('d',line)
                .attr("transform", `translate(${this.leftPadding}, 0)`)
                .attr("fill", 'none')
                .attr('stroke-width', '4px');

        this.plot.selectAll(".line-chart-dots")
                .attr("cx", (d: any) => this.xScale(this.getDate(d.month)))
                .attr("cy", (d: any) => {
                    let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                    return this.yScale(this.formatValue(selectedState[NR_TOTAL_SOMERI]))
                })
                .attr("r", 6)
                .attr("transform", `translate(${this.leftPadding}, 0)`)
                .on("mouseover", (d: any) => {
                    let selectedState = d.data.find((set: any) => set[JUDET].trim() == areaCode);
                    this.tooltip.transition().duration(500).style("opacity", .85);
                    this.tooltip.html("<strong>"+ selectedState[NR_TOTAL_SOMERI].replace(",","").trim() + "</strong>")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY -28) + "px")
                })
                .on("mouseout", (d: any) => {
                    this.tooltip.transition().duration(300)
                            .style("opacity", 0);
                });
    }


}