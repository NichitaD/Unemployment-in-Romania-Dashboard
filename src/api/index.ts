import * as d3 from 'd3';

let ianuariePath = "./files/someriIanuarie.csv";
let februariePath = "./files/someriFebruarie.csv";
let martiePath = "./files/someriMartie.csv";
let apriliePath = "./files/someriAprilie.csv";
let grupuriIanuariePath = "./files/grupeVarstaIanuarie.csv";
let grupuriFebruariePath = "./files/grupeVarstaFebruarie.csv";
let grupuriMartiePath = "./files/grupeVarstaMartie.csv";
let grupuriApriliePath = "./files/grupeVarstaAprilie.csv";
let romaniaGeoPath = "./files/romania.json";

export enum Months {
    January = "Ianuarie",
    February = "Februarie",
    March = "Martie",
    April  = "Aprilie"
}

/**
 * A class that exposes functions to retrieve relevant data
 */
export class API {
    private someriIanuarie: any;
    private someriFebruarie: any;
    private someriMartie: any;
    private someriAprilie: any;
    private grupuriIanuarie: any;
    private grupuriFebruarie: any;
    private grupuriAprilie: any;
    private grupuriMartie: any;


    constructor(){}

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
    public getDataByMonth(month: string): Promise<d3.DSVRowArray<string>> | undefined{
        switch (month) {
            case Months.January: {
                return this.someriIanuarie ? this.someriIanuarie : d3.csv(ianuariePath, (data) => this.someriIanuarie = data);
            }

            case Months.February: {
                return this.someriFebruarie ? this.someriFebruarie : d3.csv(februariePath, (data) => this.someriFebruarie = data);
            }

            case Months.March: {
                return this.someriMartie ? this.someriMartie : d3.csv(martiePath, (data) => this.someriMartie = data);
            }

            case Months.April: {
                return this.someriAprilie ? this.someriAprilie : d3.csv(apriliePath, (data) => this.someriAprilie = data);
            }
        }
    }

    public getAgeGroupsDataByMonth(month: string): Promise<d3.DSVRowArray<string>> | undefined{
        switch (month) {
            case Months.January: {
                return this.grupuriIanuarie ? this.grupuriIanuarie : d3.csv(grupuriIanuariePath, (data) => this.grupuriIanuarie = data);
            }

            case Months.February: {
                return this.grupuriFebruarie ? this.grupuriFebruarie : d3.csv(grupuriFebruariePath, (data) => this.grupuriFebruarie = data);
            }

            case Months.March: {
                return this.grupuriMartie ? this.grupuriMartie : d3.csv(grupuriMartiePath, (data) => this.grupuriMartie = data);
            }

            case Months.April: {
                return this.grupuriAprilie ? this.grupuriAprilie : d3.csv(grupuriApriliePath, (data) => this.grupuriAprilie = data);
            }
        }
    }
}