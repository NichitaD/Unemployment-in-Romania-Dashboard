import * as d3 from 'd3';
import { JUDET, ROMANIA_CODE } from '../mapChart/mapChart';

const indemnizati = " Numar  someri indemnizati  ";
const neindemnizati = " Numar someri neindemnizati ";

export class PayBarChart {

    // Private members
    private data: Array<any>;
    private element: HTMLElement | null;
    private width: number;
    private height: number;
    private margin: any;
    private plot: any;
    private xScale: d3.ScaleBand<string>;
    private yScale: d3.ScaleLinear<number, number>;
    private selectedArea: string;
    private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private labelIndemnizati = "Indemnizati";
    private labelNeindemnizati = "Neindemnizati;"

    constructor(data: any, element: HTMLElement | null, selectedArea: string) {
        this.data = data;
        this.element = element;
        this.height = 0;
        this.width = 0;
        this.selectedArea = selectedArea;

        this.draw();
    }

    /** Initiates all the values and scales, and calls on other functions to build the chart */
    private draw() {
        if (this.element === null) {
            return;
        }


        this.margin = {
            top: 10,
            right: 10,
            bottom: 50,
            left: 90
        };

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight + 60;

        let screensize = document.documentElement.clientWidth;
        if (screensize  < 1100) {
            this.height = this.element.offsetWidth;
            this.labelIndemnizati = "Indemn.";
            this.labelNeindemnizati = "Neindemn.";
        }

        // Set up parent element and SVG
        this.element.innerHTML = '';
        let svg = d3.select(this.element).append('svg');

        svg.attr("viewBox", "0 0 " + (this.width + this.margin.left + this.margin.right) + " " + (this.height + this.margin.bottom))
            .attr("preserveAspectRatio", "xMinYMin");

        this.plot = svg.append('g')
                        .attr('transform','translate('+ this.margin.left +','+ this.margin.top +')');

        this.tooltip = d3.select(".payBarChart").append("div")
                        .attr("class", "tooltip")
                        .style("visibility", "hidden");

        let dataset = this.formatData();

        this.createScales(dataset);
        this.addAxes(this.plot);
        this.addBars(this.plot, dataset);
    }

    private createScales(dataset: any) {
        this.xScale = d3.scaleBand()
                        .domain(dataset.map(function(d: any) { return d['text']; }))
                        .rangeRound([0, this.width]);

        this.yScale = d3.scaleLinear()
                        .domain([0, parseInt(this.getMaxValue(dataset) || "0") ])
                        .range([this.height, 0]);
    }

    private addAxes(svg: any) {
        var xAxis = d3.axisBottom(this.xScale)
                    .scale(this.xScale);

        var yAxis = d3.axisLeft(this.yScale)
                    .scale(this.yScale)
                    .ticks(8);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (this.height) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate("+ -10 + ",0)")
            .call(yAxis);
    }

    private addBars(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, dataset: any) {
        let bars = svg.selectAll("rect")
                        .data(dataset)
                        .enter()
                        .append("rect")
                        .attr("x", (d: any): number => this.xScale(d["text"]) || 0)
                        .attr("y", (d: any) => { return this.yScale(d['value']); })
                        .attr("width", this.xScale.bandwidth() - 6)
                        .attr("height", (d: any) => { return this.height - this.yScale(d['value']); })
                        .attr("fill", (d: any) => this.colorPicker(d["text"]));


        // Tooltips
        bars.on("mouseover", (d: any) => {
            this.tooltip.transition().duration(500).style("opacity", .85);
            this.tooltip.html(d['value'])
                .style("visibility", "visible");
        })
        .on("mousemove", (d) => {
            this.tooltip.style("top", d3.event.pageY - 28 + "px")
                .style("left", d3.event.pageX + "px");
        })
        .on("mouseout", (d) => {
            this.tooltip.transition().duration(300)
                        .style("opacity", 0);
        });
    }

    private getMaxValue(dataset: any) {
        return d3.max(dataset, function(d: any) { return d['value']; });
    }

    private formatData() {
        let selectedAreaData = this.data.find(set => {
            if (this.selectedArea == "Romania") {
                return set[JUDET].trim() == ROMANIA_CODE;
            }
            return set[JUDET].trim() == this.selectedArea.toUpperCase()
        });

        return [
            {text: this.labelIndemnizati, value: parseInt(selectedAreaData[indemnizati].replace(",","").trim())},
            {text: this.labelNeindemnizati, value: parseInt(selectedAreaData[neindemnizati].replace(",","").trim())}
        ];
    }

    private colorPicker(type: any) {
        return type == this.labelIndemnizati ? "	#ffad60": "#6fcb9f";
    }

    public updateData(newData: any, selectedArea: string) {
        this.data= newData;
        this.selectedArea = selectedArea;

        let dataset = this.formatData();

        this.xScale = d3.scaleBand()
                        .domain(dataset.map(function(d: any) { return d['text']; }))
                        .rangeRound([0, this.width]);

        this.yScale = d3.scaleLinear()
                        .domain([0, parseInt(this.getMaxValue(dataset) || "0") ])
                        .range([this.height, 0]);

        let xAxis = d3.axisBottom(this.xScale)
                    .scale(this.xScale);

        let yAxis = d3.axisLeft(this.yScale)
                    .scale(this.yScale)
                    .ticks(8);

        this.plot.select(".x-axis").call(xAxis);
        this.plot.select(".y-axis").call(yAxis);

        let bars = this.plot.selectAll("rect")
                            .data(dataset)
                            .attr("x", (d: any): number => this.xScale(d["text"]) || 0)
                            .attr("y", (d: any) => { return this.yScale(d['value']); })
                            .attr("width", this.xScale.bandwidth() - 6)
                            .attr("height", (d: any) => { return this.height - this.yScale(d['value']); })
                            .attr("fill", (d: any) => this.colorPicker(d["text"]));

        // Tooltips
        bars.on("mouseover", (d: any) => {
            this.tooltip.transition().duration(500).style("opacity", .85);
            this.tooltip.html(d['value'])
                .style("visibility", "visible");
        })
        .on("mousemove", (d: any) => {
            this.tooltip.style("top", d3.event.pageY - 28 + "px")
                .style("left", d3.event.pageX + "px");
        })
        .on("mouseout", (d: any) => {
            this.tooltip.transition().duration(300)
                        .style("opacity", 0);
        });
    }





}