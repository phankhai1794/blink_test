import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

class BarExample extends Component {
  render() {
    return (
      <div className="flex flex-col items-center w-full max-w-md">
        <h2>Bar Example (custom size)</h2>
        <Bar data={data} width={100} height={50} options={{}} />
      </div>
    );
  }
}

export default BarExample;
