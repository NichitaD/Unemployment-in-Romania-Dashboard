import * as d3 from "d3";

const ianuariePath = "files/someriIanuarie.csv";
const februariePath = "files/someriFebruarie.csv";
const martiePath = "files/someriMartie.csv";
const apriliePath = "files/someriAprilie.csv";
const maiPath = "files/someriMai.csv";
const iuniePath = "files/someriIunie.csv";
const iuliePath = "files/someriIulie.csv";
const augustPath = "files/someriAugust.csv";
const septembriePath = "files/someriSeptembrie.csv";
const octoberPath = "files/someriOctombrie.csv";
const noiembriePath = "files/someriNoiembrie.csv";
const decembriePath = "files/someriDecembrie.csv";
const grupuriIanuariePath = "files/grupeVarstaIanuarie.csv";
const grupuriFebruariePath = "files/grupeVarstaFebruarie.csv";
const grupuriMartiePath = "files/grupeVarstaMartie.csv";
const grupuriApriliePath = "files/grupeVarstaAprilie.csv";
const grupuriMaiPath = "files/grupeVarstaMai.csv";
const grupuriIuniePath = "files/grupeVarstaIunie.csv";
const grupuriIuliePath = "files/grupeVarstaIulie.csv";
const grupuriAugustPath = "files/grupeVarstaAugust.csv";
const grupuriSeptembriePath = "files/grupeVarstaSeptembrie.csv";
const grupuriOctoberPath = "files/grupeVarstaOctombrie.csv";
const grupuriNoiembriePath = "files/grupeVarstaNoiembrie.csv";
const grupuriDecembriePath = "files/grupeVarstaDecembrie.csv";
const romaniaGeoPath = "files/romania.json";

export enum Months {
  January = "Ianuarie",
  February = "Februarie",
  March = "Martie",
  April = "Aprilie",
  May = "Mai",
  June = "Iunie",
  July = "Iulie",
  August = "August",
  September = "Septembrie",
  October = "Octombrie",
  November = "Noiembrie",
  December = "Decembrie",
}

/**
 * A class that exposes functions to retrieve relevant data
 */
export class API {
  private someriIanuarie: any;
  private someriFebruarie: any;
  private someriMartie: any;
  private someriAprilie: any;
  private someriMai: any;
  private someriIunie: any;
  private someriIulie: any;
  private someriAugust: any;
  private someriSeptembrie: any;
  private someriOctombrie: any;
  private someriNoiembrie: any;
  private someriDecembrie: any;
  private grupuriIanuarie: any;
  private grupuriFebruarie: any;
  private grupuriAprilie: any;
  private grupuriMartie: any;
  private grupuriMai: any;
  private grupuriIunie: any;
  private grupuriIulie: any;
  private grupuriAugust: any;
  private grupuriSeptembrie: any;
  private grupuriOctombrie: any;
  private grupuriNoiembrie: any;
  private grupuriDecembrie: any;

  constructor() {}

  /**
   * Returns a geo json object for the map of Romania
   */
  public getGeoJson(): Promise<GeoJSON.GeoJsonObject> {
    return d3.json(romaniaGeoPath);
  }
  /**
   * Returns the unemployment data for the received month
   * @param month
   */
  public getDataByMonth(
    month: string
  ): Promise<d3.DSVRowArray<string>> | undefined {
    switch (month) {
      case Months.January: {
        return this.someriIanuarie
          ? this.someriIanuarie
          : d3.csv(ianuariePath, (data) => (this.someriIanuarie = data));
      }

      case Months.February: {
        return this.someriFebruarie
          ? this.someriFebruarie
          : d3.csv(februariePath, (data) => (this.someriFebruarie = data));
      }

      case Months.March: {
        return this.someriMartie
          ? this.someriMartie
          : d3.csv(martiePath, (data) => (this.someriMartie = data));
      }

      case Months.April: {
        return this.someriAprilie
          ? this.someriAprilie
          : d3.csv(apriliePath, (data) => (this.someriAprilie = data));
      }
      case Months.May: {
        return this.someriMai
          ? this.someriMai
          : d3.csv(maiPath, (data) => (this.someriMai = data));
      }
      case Months.June: {
        return this.someriIunie
          ? this.someriIunie
          : d3.csv(iuniePath, (data) => (this.someriIunie = data));
      }
      case Months.July: {
        return this.someriIulie
          ? this.someriIulie
          : d3.csv(iuliePath, (data) => (this.someriIulie = data));
      }
      case Months.August: {
        return this.someriAugust
          ? this.someriAugust
          : d3.csv(augustPath, (data) => (this.someriAugust = data));
      }
      case Months.September: {
        return this.someriSeptembrie
          ? this.someriSeptembrie
          : d3.csv(septembriePath, (data) => (this.someriSeptembrie = data));
      }
      case Months.October: {
        return this.someriOctombrie
          ? this.someriOctombrie
          : d3.csv(octoberPath, (data) => (this.someriOctombrie = data));
      }
      case Months.November: {
        return this.someriNoiembrie
          ? this.someriOctombrie
          : d3.csv(noiembriePath, (data) => (this.someriNoiembrie = data));
      }
      case Months.December: {
        return this.someriDecembrie
          ? this.someriOctombrie
          : d3.csv(decembriePath, (data) => (this.someriDecembrie = data));
      }
    }
  }

  /**
   * Returns the unemployment data fir the age groups chart, based on the recieved month
   * @param month
   */
  public getAgeGroupsDataByMonth(
    month: string
  ): Promise<d3.DSVRowArray<string>> | undefined {
    switch (month) {
      case Months.January: {
        return this.grupuriIanuarie
          ? this.grupuriIanuarie
          : d3.csv(
              grupuriIanuariePath,
              (data) => (this.grupuriIanuarie = data)
            );
      }

      case Months.February: {
        return this.grupuriFebruarie
          ? this.grupuriFebruarie
          : d3.csv(
              grupuriFebruariePath,
              (data) => (this.grupuriFebruarie = data)
            );
      }

      case Months.March: {
        return this.grupuriMartie
          ? this.grupuriMartie
          : d3.csv(grupuriMartiePath, (data) => (this.grupuriMartie = data));
      }

      case Months.April: {
        return this.grupuriAprilie
          ? this.grupuriAprilie
          : d3.csv(grupuriApriliePath, (data) => (this.grupuriAprilie = data));
      }
      case Months.May: {
        return this.grupuriMai
          ? this.grupuriMai
          : d3.csv(grupuriMaiPath, (data) => (this.grupuriMai = data));
      }
      case Months.June: {
        return this.grupuriIunie
          ? this.grupuriIunie
          : d3.csv(grupuriIuniePath, (data) => (this.grupuriIunie = data));
      }
      case Months.July: {
        return this.grupuriIulie
          ? this.grupuriIulie
          : d3.csv(grupuriIuliePath, (data) => (this.grupuriIulie = data));
      }
      case Months.August: {
        return this.grupuriAugust
          ? this.grupuriAugust
          : d3.csv(grupuriAugustPath, (data) => (this.grupuriAugust = data));
      }
      case Months.September: {
        return this.grupuriSeptembrie
          ? this.grupuriSeptembrie
          : d3.csv(
              grupuriSeptembriePath,
              (data) => (this.grupuriSeptembrie = data)
            );
      }
      case Months.October: {
        return this.grupuriOctombrie
          ? this.grupuriOctombrie
          : d3.csv(
              grupuriOctoberPath,
              (data) => (this.grupuriOctombrie = data)
            );
      }
      case Months.November: {
        return this.grupuriNoiembrie
          ? this.grupuriNoiembrie
          : d3.csv(
              grupuriNoiembriePath,
              (data) => (this.grupuriNoiembrie = data)
            );
      }
      case Months.December: {
        return this.grupuriDecembrie
          ? this.grupuriDecembrie
          : d3.csv(
              grupuriDecembriePath,
              (data) => (this.grupuriDecembrie = data)
            );
      }
    }
  }
}
