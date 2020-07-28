import $ from 'jquery'
import * as d3 from 'd3';
import { API, Months } from '../api/index';
import { LineChart } from './lineChart/lineChart';
import { MapChart } from './mapChart/mapChart';
import { AgeGroupsChart } from './ageGroupsChart/ageGourpsChart';
import { GenderBarChart } from './genderBarChart/genderBarChart';
import { PayBarChart } from './payBarChart/payBarChart';
import { RankingChart } from './rankingChart/rankingChart';
import { ILineChartData } from './types'
const css = require('./index.css').toString();
const ageGroups = "ageGroups";
const general = "general";
const LIGHT = "light";
const DARK = "dark";

export const NR_TOTAL_SOMERI = " Numar total someri ";

let api = new API();
let januaryData: any;
let februaryData: any;
let marchData: any;
let aprilData: any;
let mayData: any;
let juneData: any;
let groupsJanuaryData: any;
let groupsFebruaryData: any;
let groupsMarchData: any;
let groupsAprilData: any;
let groupsMaydata: any;
let groupsJuneData: any;
let mapJson;
let selectedArea = "Romania";
let selectedMonth = "January";
let theme = LIGHT;
let lineChart: LineChart;
let mapChart: MapChart;
let ageGroupsChart: AgeGroupsChart;
let genderBarChart: GenderBarChart;
let payBarChart: PayBarChart;
let rankingChart: RankingChart;
let lineChartDataSet: Array<ILineChartData>;

async function init() {
    // The display of the container is set to none on initiation, because of the loading gif
    $(".container").css("display","grid");

    januaryData = await api.getDataByMonth(Months.January);
    februaryData = await api.getDataByMonth(Months.February);
    marchData = await api.getDataByMonth(Months.March);
    aprilData = await api.getDataByMonth(Months.April);
    mayData = await api.getDataByMonth(Months.May);
    juneData = await api.getDataByMonth(Months.June);
    groupsJanuaryData = await api.getAgeGroupsDataByMonth(Months.January);
    groupsFebruaryData = await api.getAgeGroupsDataByMonth(Months.February);
    groupsMarchData = await api.getAgeGroupsDataByMonth(Months.March);
    groupsAprilData = await api.getAgeGroupsDataByMonth(Months.April);
    groupsMaydata = await api.getAgeGroupsDataByMonth(Months.May);
    groupsJuneData = await api.getAgeGroupsDataByMonth(Months.June);

    mapJson = await api.getGeoJson();


    lineChartDataSet = [
        {
            month: Months.January,
            data: januaryData
        },
        {
            month: Months.February,
            data: februaryData
        },
        {
            month: Months.March,
            data: marchData
        },
        {
            month: Months.April,
            data: aprilData
        },
        {
            month: Months.May,
            data: mayData
        },
        {
            month: Months.June,
            data: juneData
        }
    ]

    lineChart = new LineChart(lineChartDataSet, document.querySelector('.lineChart'), selectedArea);
    mapChart = new MapChart(mapJson, januaryData, document.querySelector('.map'), selectedMonth, selectedArea);
    ageGroupsChart = new AgeGroupsChart(groupsJanuaryData, document.querySelector('.ageGroupsChart'), selectedArea);
    genderBarChart = new GenderBarChart(januaryData, document.querySelector('.genderBarChart'), selectedArea);
    payBarChart = new PayBarChart(januaryData, document.querySelector('.payBarChart'), selectedArea);
    rankingChart = new RankingChart(januaryData,  document.querySelector('.rankingChart'), selectedArea)

    setTitles();
    setThemeToggleListener();
    setMonthChangeListener();
    setAreaChangeListener();

    window.setTimeout(() => {
        $(".loading").css("display","none");
    }, 1500);
}

function setTitles() {
    $('.lineChartTitle').text(`Total number of unemployed citizens in ${selectedArea}`);
    $('.ageChartTitle').text(`Unemployed citizens by age groups in ${selectedArea} in ${selectedMonth}`);
    $('.barGroupTitle').text(`Unemployment stats in ${selectedArea} in ${selectedMonth}`);
    $('.rankingChartTitle').text(`Counties ranked by number of unemployed citizens in  ${selectedMonth}`);
}

function setThemeToggleListener() {
    document.getElementById("switch")!.addEventListener('change', () => {
        let root = document.documentElement;
        if (theme === LIGHT) {
            root.style.setProperty('--background-color', "#003545");
            root.style.setProperty('--text-color', "white");
            root.style.setProperty('--lines-color', "#fbc687");
            root.style.setProperty('--dots-color', "#ea907a");
            root.style.setProperty('--link-color', "#f6c90e");
            root.style.setProperty('--ageChartBar', "#29c7ac");
            theme = DARK;
        } else {
            root.style.setProperty('--background-color', "white");
            root.style.setProperty('--text-color', "black");
            root.style.setProperty('--lines-color', "#a6bddb");
            root.style.setProperty('--dots-color', "#2c7fb8");
            root.style.setProperty('--link-color', "#5c2a9d");
            root.style.setProperty('--ageChartBar', "#005d7d");
            theme = LIGHT;
        }
    });
}

function setMonthChangeListener() {
    document.getElementById("month")!.addEventListener("change", () => {
        selectedMonth = $("#month :selected").val() as string;

        updateData(false);
    });
}

function setAreaChangeListener() {
    document.addEventListener("changedArea", (event: any) => {
        selectedArea = event.selectedArea;

        updateData(true);
    });
}

function updateData(areaChanged: boolean) {
    let newGeneralData = getDataByMonth(selectedMonth, general);
    let newAgeData = getDataByMonth(selectedMonth, ageGroups);

    lineChart.updateData(lineChartDataSet, selectedArea);
    mapChart.updateData(newGeneralData, selectedMonth, selectedArea, areaChanged);
    ageGroupsChart.updateData(newAgeData, selectedArea);
    genderBarChart.updateData(newGeneralData, selectedArea);
    payBarChart.updateData(newGeneralData, selectedArea);
    rankingChart.updateData(newGeneralData, selectedArea);

    setTitles();
}

function getDataByMonth(month: string, dataType: string) {
    switch (month) {
        case "January": {
            return dataType === general ? januaryData : groupsJanuaryData;
        }

        case "February": {
            return dataType === general ? februaryData : groupsFebruaryData;
        }

        case "March": {
            return dataType === general ? marchData : groupsMarchData;
        }

        case "April": {
            return dataType === general ? aprilData : groupsAprilData;
        }

        case "May": {
            return dataType === general ? mayData : groupsMaydata;
        }

        case "June": {
            return dataType === general ? juneData : groupsJuneData;
        }
    }
}

init();

