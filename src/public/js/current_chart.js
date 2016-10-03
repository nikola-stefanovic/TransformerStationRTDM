$(function () {

    var seriesOptions = [],
        seriesCounter = 0,
        names = ['IPAL'];

    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
    function createChart() {

        $(container).highcharts('StockChart', {

          title: {
              text: 'AAPL stock price by minute'
          },

          subtitle: {
              text: 'Using ordinal X axis'
          },

          xAxis: {
              gapGridLineWidth: 0
          },

          yAxis: {
            title:{
              text:"Current (mA)"
            }
          },

          rangeSelector: {
              buttons: [{
                  type: 'second',
                  count: 10 ,
                  text: '10S'
              }, {
                  type: 'second',
                  count: 30,
                  text: '30S'
              }, {
                  type: 'minute',
                  count: 1,
                  text: 'M'
              },  {
                  type: 'minute',
                  count: 60,
                  text: 'H'
              }, {
                  type: 'all',
                  count: 1,
                  text: 'All'
              }],
              selected: 1,
              inputEnabled: false
          },

          legend: {
            enabled:true
          },

          tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
              valueSuffix: ' mA',
              shared:true,
              valueDecimals: 2
          },

            series: seriesOptions
        });
    }

    var columnsName = ['IPAL','IPAA','IPAH'];
    var send_data = {location_id:41,read_after:"2005-04-27T18:44:13.000Z",read_before:"2025-04-27T18:44:16.000Z",columns:columnsName };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/measurement/',
      data: JSON.stringify(send_data),
      success: function(data) {
        //alert(JSON.stringify(data));
        //alert(JSON.stringify(serie));
        $.each(columnsName, function(i, colName){
          //alert(i + " " + colName);
          var serie = extractSerieByName(colName,data);
          seriesOptions[i] = {
              name: colName,
              data: serie
          };
        });
        createChart();
      },
      contentType: "application/json",
      dataType: 'json'
    });

    function extractSerieByName(columnName, data){
      var serie = [];
      var x,y;
      for(var i=0; i<data.length; i++){
        x = Date.parse(data[i]['READ_TIME']);
        y = data[i][columnName];
        serie.push([x, y]);
      }
      return serie;
    }

});
