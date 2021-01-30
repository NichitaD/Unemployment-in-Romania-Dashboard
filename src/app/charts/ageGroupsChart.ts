import * as d3 from "d3";

const ageJudet = "judet ",
  ageTotal = "TOTAL",
  firstAge = "Sub 25 ani",
  secondAge = "25 - 29 ani",
  thirdAge = "30 - 39 ani",
  fourthAge = "40 - 49 ani",
  fifthAge = "50 - 55 ani",
  sixthAge = "peste 55 ani";

export class AgeGroupsChart {
  private data: Array<any>;
  private element: HTMLElement | null;
  private width: number;
  private height: number;
  private margin: any;
  private plot: any;
  private xScale: any;
  private yScale: any;
  private selectedArea: string;

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

    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;

    this.margin = {
      top: 15,
      right: 35,
      bottom: 30,
      left: 70,
    };

    this.width = 650 - this.margin.left - this.margin.right;
    this.height = 190 - this.margin.top - this.margin.bottom;

    // Set up parent element and SVG
    var svg = d3.select(this.element).append("svg");
    svg
      .attr(
        "viewBox",
        "0 0 " +
          (this.width + this.margin.left + this.margin.right) +
          " " +
          this.height
      )
      .attr("preserveAspectRatio", "xMinYMin");

    this.plot = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    let dataset = this.formatData();

    this.createScales(dataset);
    this.addAxes(this.plot);
    this.addBars(this.plot, dataset);
  }

  private createScales(dataset: any) {
    this.xScale = d3
      .scaleLinear()
      .range([0, this.width])
      .domain([0, parseInt(this.getMaxValue(dataset) || "0")]);

    this.yScale = d3
      .scaleBand()
      .rangeRound([this.height, 0])
      .domain(
        dataset.map(function (d: any) {
          return d.name;
        })
      );
  }

  private addAxes(svg: any) {
    //make y axis to show bar names
    let yAxis = d3.axisLeft(this.yScale).scale(this.yScale).ticks(0);

    let gy = svg.append("g").attr("class", "y-axis").call(yAxis);
  }

  private addBars(svg: any, dataset: any) {
    let bars = svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("g")
      .attr("class", "g-container");

    // Append rects
    bars
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d: any) => {
        return this.yScale(d.name);
      })
      .attr("height", this.yScale.bandwidth() - 3)
      .attr("x", 0)
      .attr("width", (d: any) => {
        return this.xScale(d.value);
      });

    //add a value label to the right of each bar
    bars
      .append("text")
      .attr("class", "label")
      //y position of the label is halfway down the bar
      .attr("y", (d: any) => {
        return this.yScale(d.name) + this.yScale.bandwidth() / 2 + 3;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", (d: any) => {
        return this.xScale(d.value) - 40;
      })
      .text(function (d: any) {
        return d.value;
      });
  }

  private formatData() {
    let selectdeAreaData = this.data.find((set) => {
      if (this.selectedArea == "Romania") {
        return set[ageJudet].trim() == ageTotal;
      }
      return set[ageJudet].trim() == this.selectedArea.toUpperCase();
    });

    //Format data
    return [
      {
        name: "< 25 ",
        value: parseInt(selectdeAreaData[firstAge].replace(",", "").trim()),
      },
      {
        name: "25-29 ",
        value: parseInt(selectdeAreaData[secondAge].replace(",", "").trim()),
      },
      {
        name: "30-39 ",
        value: parseInt(selectdeAreaData[thirdAge].replace(",", "").trim()),
      },
      {
        name: "40-49 ",
        value: parseInt(selectdeAreaData[fourthAge].replace(",", "").trim()),
      },
      {
        name: "50-59 ",
        value: parseInt(selectdeAreaData[fifthAge].replace(",", "").trim()),
      },
      {
        name: "55 < ",
        value: parseInt(selectdeAreaData[sixthAge].replace(",", "").trim()),
      },
    ];
  }

  private getMaxValue(dataset: any) {
    return d3.max(dataset, function (d: any) {
      return d.value;
    });
  }

  public updateData(newData: any, selectedArea: string) {
    this.data = newData;
    this.selectedArea = selectedArea;

    let dataset = this.formatData();

    this.xScale = d3
      .scaleLinear()
      .range([0, this.width])
      .domain([0, parseInt(this.getMaxValue(dataset) || "0")]);

    this.yScale = d3
      .scaleBand()
      .rangeRound([this.height, 0])
      .domain(
        dataset.map(function (d: any) {
          return d.name;
        })
      );

    //make y axis to show bar names
    let yAxis = d3.axisLeft(this.yScale).scale(this.yScale).ticks(0);

    let gy = this.plot.select(".y-axis").call(yAxis);

    let bars = this.plot.selectAll(".g-container").data(dataset);

    bars.select(".label").attr("visibility", "hidden");

    // Append rects
    bars
      .select(".bar")
      .attr("y", (d: any) => {
        return this.yScale(d.name);
      })
      .attr("height", this.yScale.bandwidth() - 3)
      .attr("x", 0)
      .attr("width", (d: any) => {
        return this.xScale(d.value);
      });

    //add a value label to the right of each bar
    bars
      .select(".label")
      //y position of the label is halfway down the bar
      .attr("y", (d: any) => {
        return this.yScale(d.name) + this.yScale.bandwidth() / 2 + 3;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", (d: any) => {
        return this.xScale(d.value) - (d.value / 1000 > 1 ? 40 : 32);
      })
      .attr("opacity", "0")
      .text(function (d: any) {
        return d.value;
      });

    window.setTimeout(
      () =>
        bars
          .select(".label")
          .attr("visibility", "visible")
          .attr("opacity", "1"),
      700
    );
  }
}
