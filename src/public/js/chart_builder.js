function TransformerChart(container_id){
  this.service = 'http://localhost:3000/measurement/';
  this.seriesOptions = [];
  this.container_id = container_id;
}

TransformerChart.prototype.drawEmptyChart = function(){
    $(this.container_id).highcharts('StockChart', this._chartSettingsDefault({name:[],data:[]}));
};

TransformerChart.prototype.drawChart = function(location_id, read_after, read_before, columnsName){
  this._getData(location_id, read_after, read_before, columnsName, function(err, data){
    //check for errors
    if(err) return alert("Greska: " + err);

    //extract all series
    var self = this;
    $.each(columnsName, function(i, colName){
      var serie = self._extractSerieByName(colName,data);
      self.seriesOptions[i] = {
          name: colName,
          data: serie
      };
    });

    //create chart
    $(this.container_id).highcharts('StockChart', this._chartSettingsDefault(this.seriesOptions));

  });
};

/**
 * Default settings for Highstock chart.
 * @return {Chart} object that is used to configute chart.
 */
TransformerChart.prototype._chartSettingsDefault = function(seriesOptions){
  var config = {
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
    };
    return config;
};

/**
 * Extract values from data array and create
 * array in format that can be used by Highchart.
 * @param  {String} columnsName specify which value should be extracted.
 * @param  data is array of object where each object
 * contains time and one or more measured values.
 * @return array 2d points where
 * 2d points are presented as array of two values. First point presents
 * time while second value is specified with parameter columnsName.
 */
TransformerChart.prototype._extractSerieByName = function(columnName, data){
  var serie = [];
  var x,y;
  for(var i=0; i<data.length; i++){
    x = Date.parse(data[i]['READ_TIME']);//time of measuring
    y = data[i][columnName];//measured value
    serie.push([x, y]);
  }
  return serie;
};

/**
 * Get measured values from server for specific transformer.
 * @param  {int}   location_id is transformer id.
 * @param  {Date}   read_after  lower bound of interval.
 * @param  {Date}   read_before upper bound of interval.
 * @param  {String[]}   columnsName which values should server return.
 * @param  {Function} cb  callback function.

 */
TransformerChart.prototype._getData = function(location_id, read_after, read_before, columnsName, cb){
  var send_data = {location_id:location_id, read_after:read_after, read_before:read_before, columns:columnsName };
  var self = this;
  $.ajax({
    type: 'POST',
    url: this.service,
    data: JSON.stringify(send_data),
    success: function(data) {
      cb.call(self, null, data);//set context to TransformerChart class
    },
    error: function(jqXHR, textStatus, errorThrown ) {
      cb.call(self, errorThrown);//set context to TransformerChart class
    },
    contentType: "application/json",
    dataType: 'json'
  });
};


//on document load
$(function () {
  var tc = new TransformerChart(container);//container variable sets server
  var columnsName = ['IPAL','IPAA','IPAH','VABL'];
  tc.drawChart(41, "2005-04-27T18:44:13.000Z", "2025-04-27T18:44:16.000Z", columnsName);
  //tc.drawEmptyChart();
});
