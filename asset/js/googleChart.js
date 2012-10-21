// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawChart);
google.setOnLoadCallback(drawChart2);

// draws it.
function drawChart() {

    // Create the data table.
var data = new google.visualization.DataTable();
data.addColumn('string', 'Topping');
data.addColumn('number', 'Age');
data.addRows([
  ['10-20', 3],
  ['21-30', 10],
  ['31-40', 1],
  ['41-50', 1],
  ['51 up', 2]
]);

// Set chart options
var options = {'title':'平均打卡年齡',
           'width':400,
           'height':300};

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  function drawChart2() {
    var data = google.visualization.arrayToDataTable([
      ['Day', 'Count'],
	  ['10/17',  2],
	  ['10/18',  3],
	  ['10/19',  1],
	  ['10/20',  10],
	  ['10/21',  20],
	]);

var options = {
  title: '每日打卡數',
  vAxis: {title: 'Count',  titleTextStyle: {color: 'red'}},
  seriesType: "bars",

};

var chart = new google.visualization.ComboChart(document.getElementById('chart2_div'));
    chart.draw(data, options);
  }
