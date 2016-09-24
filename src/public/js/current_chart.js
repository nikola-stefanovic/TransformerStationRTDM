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

          rangeSelector: {
              buttons: [{
                  type: 'hour',
                  count: 1,
                  text: '1h'
              }, {
                  type: 'day',
                  count: 1,
                  text: '1D'
              }, {
                  type: 'all',
                  count: 1,
                  text: 'All'
              }],
              selected: 1,
              inputEnabled: false
          },
            legend:{enabled:true},
            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
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
        alert(JSON.stringify(data));
        var serie = getSerieByName('IPAL',data);
        alert(JSON.stringify(serie));

        seriesOptions[0] = {
            name: 'IPAL',
            data: serie
        };
        createChart();
      },
      contentType: "application/json",
      dataType: 'json'
    });



    function getSerieByName(columnName, data){
      var serie = [];
      var x,y;
      for(var i=0; i<data.length; i++){
        x = Date.parse(data[i]['READ_TIME']);
        y = data[i][columnName];
        serie.push([x, y]);
      }
      return serie;
    }
    /*$.each(names, function (i, name) {



        $.getJSON('https://localhost:3000/' + location_id + '/' + read_before + '/' + read_after,    function (data) {

            seriesOptions[i] = {
                name: name,
                data: data
            };

            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === names.length) {
                createChart();
            }
        });
    });*/


});
