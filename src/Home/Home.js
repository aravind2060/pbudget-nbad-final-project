import axios from 'axios';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { default as React, useEffect, useRef, useState } from 'react';
import Menu from '../Menu/Menu';

const Home = ({ user, onSignOut }) => {
  const chartRef = useRef(null);
  const lineChartRef = useRef(null);
 
  const [expensesData, setExpensesData] = useState([]);
  let data_p = {
    data: [],
    backgroundColor: [
      '#ffcd56',
      '#ff6384',
      '#36a2eb',
      '#fd6b19',
      '#000080',
      '#800080',
      '#808080',
      '#a52a2a',
    ],
    labels: [],
  };

  useEffect(() => {
    function Chart_create(data) {
      if (chartRef.current) {
        d3.select(chartRef.current).select('svg').remove();
      }
      var width = 400;
      var height = 400;
      var radius = Math.min(width, height) / 2;

      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var color = d3.scaleOrdinal()
        .range(data_p.backgroundColor);

      var pie = d3.pie()
        .value(function (d) { return d.amount; });

      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d) { return color(d.data.description); });

      arcs.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.description; });

    }

    function createLineGraph(data) {
      const labels = data.map(expense => expense.description);
      const amounts = data.map(expense => expense.amount);
  
      const ctx = lineChartRef.current.getContext('2d');
  
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Amount',
              data: amounts,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    function getBudget() {
      axios.get('http://localhost:3001/expenses', {
        headers: {
          'X-User-ID': user._id,
        },
      })
        .then((res) => {
          //console.log(res);
          //testData = res.data;
          Chart_create(res.data);

          setExpensesData(res.data);
          createLineGraph(res.data);
          //console.log(testData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    getBudget();
  }, [user._id]);

  return (
    <div>
      <Menu />
      <h2>Welcome!!</h2>
      <button onClick={onSignOut}>Sign Out</button>
      <h2> Pie Chart generated through D3JS </h2>
      <div id="chart" ref={chartRef}></div><br></br>
      {expensesData && (<>

        <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expensesData.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      </>)}
      <div id="line-chart">
        <canvas ref={lineChartRef}></canvas>
      </div><br></br>
     
    </div>
  );
};

export default Home;
