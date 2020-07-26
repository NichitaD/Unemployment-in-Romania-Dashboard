import * as d3 from 'd3';
import $ from 'jquery'
import { NR_TOTAL_SOMERI } from '../index'
import { geoCentroid } from 'd3';

export const JUDET = "JUDET";
export const RATA = "Rata somajului";
export const ROMANIA_CODE = "Total";

/**
 * A class that builds a map chart based on the received parameters
 */
export class MapChart {

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
    private geoJson: any;
    private colorDomain: any;
    private selectedArea: string = "Romania";
    private selectedMonth: string;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    constructor(geoJson: any, data: any, element: HTMLElement | null, selectedMonth: string) {
        this.data = data;
        this.element = element;
        this.geoJson = geoJson;
        this.selectedMonth = selectedMonth;
        this.height = 0;
        this.width = 0;
        this.leftPadding = "12";

        let selectedNode = d3.select("#month").node();
        this.selectedMonth = (selectedNode as any).value

        this.colorDomain = d3.scaleLinear<string>().range(['#fef0d9','#b30000']);

        this.colorDomain.domain([
            0, d3.max(data, function(d: any) {
                if(d.JUDET === "Total "){
                    return 0;
                }

                return parseInt(d[NR_TOTAL_SOMERI].replace(",",""))
            })
        ]);

        this.joinData(data, geoJson);
        this.draw();
        this.buildLegend();
        this.buildBottomText(data);
    }

    /** Initiates all the values and scales, and calls on other functions to build the chart */
    private draw() {
        if (this.element === null) {
            return;
        }

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetWidth/1.5;

        this.margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        // Set up parent element and SVG
        this.element.innerHTML = '';
        this.svg = d3.select(this.element).append('svg');
        this.svg.attr("viewBox", "0 0 " + this.width + " " + this.height )
                                .attr("preserveAspectRatio", "xMinYMin");

        let center = d3.geoCentroid(this.geoJson);
        let scale = 3500;
        let offset: [number, number] =  [(this.width/2), this.height - 200];
        let projection = d3.geoMercator().center(center).translate(offset).scale(scale);

        let path = d3.geoPath().projection(projection);

        let tooltip = d3.select(".mapChart").append("div").attr("class", "tooltip").style("opacity", 0);

        this.svg.selectAll("path")
            .data(this.geoJson.features)
            .enter()
            .append("path")
            .attr("d", path as any)
            .attr("class", (d: any) => "path-" + d.properties.name)
            .attr("fill", (d: any) => {
                let value = d.properties.nrSomeri;

                if(value) {
                    return this.colorDomain((value));
                } else {
                    return "#666666";
                }
            })
            .on("mouseover", (d: any) => {
                tooltip.transition().duration(500).style("opacity", .85);
                tooltip.html("<strong>"+ d.properties.name + "\n" +d.properties.nrSomeri + "</strong>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(300)
                        .style("opacity", 0);
            })
            .on("mousemove",function(d,i){
            let xPosition = parseFloat(d3.event.pageX) ;
            let yPosition = parseFloat(d3.event.pageY);
                tooltip.style("left", (xPosition + 9) + "px")
                    .style("top", (yPosition - 60) + "px");
            })
    }

    private joinData(data: any, json: any) {
        // Join data
        for(let i = 0; i < data.length; ++i) {
            let judet = data[i][JUDET].toLowerCase().trim();

            let someri = parseInt(data[i][NR_TOTAL_SOMERI].replace(",",""))

            for(let j = 0; j < json.features.length; ++j) {

                let numeJudet = json.features[j].properties.name.toLowerCase().trim();

                if(judet == numeJudet) {
                    json.features[j].properties.nrSomeri = someri;
                    break;
                }
            }
        }
    }

    private buildLegend() {
        let legendHeight = 20, legendWidth = 500;
        let legend = d3.select("#mapLegend")
                        .attr("viewBox", "0 0 " + legendWidth + " " + legendHeight * 3)
                        .attr("preserveAspectRatio", "xMinYMin");

        let legendData: Array<number> = [];

        this.geoJson.features.forEach((prop: any) => {
                let value = prop.properties.nrSomeri;

                if (value) {
                    legendData.push(value);
                }
            });

            legendData.sort(function(a,b){ return a-b;});

            legend.selectAll("rect")
                .data(legendData)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * (legendWidth/legendData.length))
                .attr("y", 10)
                .attr("width", (d, i) =>  legendWidth/legendData.length)
                .attr("height", legendHeight)
                .attr("fill", d => this.colorDomain(d))

            legend.selectAll("text")
                .data([legendData[0], legendData[legendData.length-1]])
                .enter()
                .append("text")
                .text((d) => d)
                .attr("x", (d, i) => i === 0 ? legendWidth * i : legendWidth * i - 45)
                .attr("y", legendHeight + 30)
    }

    private buildBottomText(data: any) {

        var selectdeAreaData = data.find((set: any) => {
            if (this.selectedArea == "Romania") {
                return set[JUDET].trim() == ROMANIA_CODE;
            }
            return set[JUDET].trim() == this.selectedArea.toUpperCase()
        });

        // Build bottom text
        $('#mapText').html(`<strong>${selectdeAreaData[NR_TOTAL_SOMERI]}</strong> of the citizens of <strong>${this.selectedArea}</strong> were unemployed in <strong>${this.selectedMonth}</strong>,
                            totaling up to <strong>${selectdeAreaData[RATA].trim()}%</strong> of the population.`);
    }

    public updateData(newData: any, selectedMonth: string) {
        this.data = newData;
        this.selectedMonth = selectedMonth;

        this.joinData(this.data, this.geoJson);

        this.svg.selectAll("path")
            .attr("fill", (d: any) => {
                let value = d.properties.nrSomeri;

                if(value) {
                    // TODO: Check if this works
                    if(d.properties.name.toLowerCase() == this.selectedArea.toLowerCase()) {
                        return "#004369";
                    }
                    return this.colorDomain((value));
                } else {
                    return "#666666";
                }
            });

        // Change legend

        let legendData: Array<number> = [];

        this.geoJson.features.forEach((prop: any) => {
            var val = prop.properties.nrSomeri;

            if (val) {
                legendData.push(val);
            }
        });

        legendData.sort(function(a,b){ return a-b;});

        d3.select("#mapLegend").selectAll("text")
                    .data([legendData[0], legendData[legendData.length-1]])
                    .text((d) => d)

        this.buildBottomText(this.data);
    }

}