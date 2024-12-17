import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

interface PlaytimeData {
  date: string;
  playtime: number;
}

const createPlaytimeGraph = async (data: PlaytimeData[]) => {
    const width = 800; // Width of the image
    const height = 600; // Height of the image
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    // Prepare the data for the chart
    const labels = data.map(item => item.date);
    const playtimeData = data.map(item => item.playtime);

    // Chart configuration
    const configuration: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
            labels, // Days as the x-axis labels
            datasets: [{
                label: 'Playtime (minutes)', // Label for the dataset
                data: playtimeData, // The playtime data points
                borderColor: 'rgba(78, 214, 214, 0.84)', // Brighter line color
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(225, 227, 233, 0.78)' // Lighter text color for x-axis
                    }
                },
                y: {
                    ticks: {
                        color: 'rgba(225, 227, 233, 0.77)'// Lighter text color for y-axis
                }
            }
        },
            // plugins: {
            //     legend: {
            //         labels: {
            //             color: 'rgba(225, 227, 233, 0.6)' // Lighter text color
            //         }
            //     }
            // }
        }
    };

    // Generate the chart as a buffer
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
};

export default createPlaytimeGraph;