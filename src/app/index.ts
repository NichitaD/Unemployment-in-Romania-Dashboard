import $ from 'jquery'
import { API, Months } from '../api/index';
import { LineChart } from './lineChart/index';
import { MapChart } from './mapChart/index';
import { AgeGroupsChart } from './ageGroupsChart/index';
import { GenderBarChart } from './genderBarChart/index';
import { PayBarChart } from './payBarChart/index';
import { RankingChart } from './rankingChart/index';
const css = require('./index.css').toString();
const LIGHT = "light";
const DARK = "dark";

export const NR_TOTAL_SOMERI = " Numar total someri ";

let api = new API();
let januaryData;
let februaryData;
let marchData;
let aprilData;
let groupsJanuaryData;
let groupsFebruaryData;
let groupsMarchData;
let groupsAprilData;
let mapJson;
let selectedArea = "Romania";
let selectedMonth = "Ianuarie";
let theme = LIGHT;

let lineChartDataSet;

async function init() {
    januaryData = await api.getDataByMonth(Months.January);
    februaryData = await api.getDataByMonth(Months.February);
    marchData = await api.getDataByMonth(Months.March);
    aprilData = await api.getDataByMonth(Months.April);
    groupsJanuaryData = await api.getAgeGroupsDataByMonth(Months.January);
    groupsFebruaryData = await api.getAgeGroupsDataByMonth(Months.February);
    groupsMarchData = await api.getAgeGroupsDataByMonth(Months.March);
    groupsAprilData = await api.getAgeGroupsDataByMonth(Months.April);

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
        }
    ]


    let lineChart = new LineChart(lineChartDataSet, document.querySelector('.lineChart'))
    let mapChart = new MapChart(mapJson, januaryData, document.querySelector('.map'));
    let ageGroupsChart = new AgeGroupsChart(groupsJanuaryData, document.querySelector('.ageGroupsChart'));
    let genderBarChart = new GenderBarChart(januaryData, document.querySelector('.genderBarChart'));
    let payBarChart = new PayBarChart(januaryData, document.querySelector('.payBarChart'));
    let rankingChart = new RankingChart(januaryData,  document.querySelector('.rankingChart'))

    setTitles();
    setThemeToggleListener();
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

init();

