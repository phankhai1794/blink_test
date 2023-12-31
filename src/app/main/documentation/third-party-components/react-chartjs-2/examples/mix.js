import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  datasets: [
    {
      label: 'Sales',
      type: 'line',
      data: [51, 65, 40, 49, 60, 37, 40],
      fill: false,
      borderColor: '#EC932F',
      backgroundColor: '#EC932F',
      pointBorderColor: '#EC932F',
      pointBackgroundColor: '#EC932F',
      pointHoverBackgroundColor: '#EC932F',
      pointHoverBorderColor: '#EC932F',
      yAxisID: 'y-axis-2'
    },
    {
      label: 'Visitor',
      type: 'bar',
      data: [200, 185, 590, 621, 250, 400, 95],
      fill: false,
      backgroundColor: '#71B37C',
      borderColor: '#71B37C',
      hoverBackgroundColor: '#71B37C',
      hoverBorderColor: '#71B37C',
      yAxisID: 'y-axis-1'
    }
  ]
};

const options = {
  responsive: true,
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        },

        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};

const plugins = [
  {
    afterDraw: (chartInstance, easing) => {
      const ctx = chartInstance.chart.ctx;
      ctx.fillText('This text drawn by a plugin', 100, 100);
    }
  }
];

class MixExample extends Component {
  render() {
    return (
      <div className="flex flex-col items-center w-full max-w-md">
        <h2>Mixed data Example</h2>
        <Bar data={data} options={options} plugins={plugins} />
      </div>
    );
  }
}

export default MixExample;
