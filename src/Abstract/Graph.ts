import Chart from "chart.js/auto";
import "date-fns";
import { format, addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';
import "chartjs-adapter-date-fns";
import { Component} from "./Component";

export class Graph extends Component{
    graphik: Chart<"bar", { x:Date, y: number}[], Date>;

    constructor(parrent: HTMLElement){
        super(parrent, "div", ['chart']);
        const canvas = new Component(this.root, "canvas", ["graph"]);
        this.graphik = new Chart(canvas.root as HTMLCanvasElement, {
            type: "bar",
            data: {
                labels: [new Date()],
                datasets: [
                    {
                        label: "График",
                        data: [
                            {
                                x: new Date(),
                                y: 0
                            }
                        ],
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }
                ]
            },
            options: {
                plugins:{
                    title:{
                        display: false
                    },
                    legend: {
                        display: false
                    }
                },
                scales:{
                    x:{
                        type: "time",
                        time: {
                            unit: "day",
                            displayFormats:{
                                day: "dd.MM.yy",
                            }
                        },
                        ticks:{
                            source: "auto",
                            color: 'black'
                        },
                        adapters: {
                            date: {
                                locale: ru,
                            }
                        }
                    },
                    y:{
                        title: {
                            text: "рубли",
                            display: true,
                            color: 'black'
                        },
                        beginAtZero: true,
                        ticks: {
                            color: 'black'
                        }
                    }
                }
            }
        });
    }
}