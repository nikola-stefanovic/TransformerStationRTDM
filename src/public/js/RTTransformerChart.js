function RTTransformerChart(container_id, chartWidthSeconds){
  this.service = 'http://localhost:3000/measurement/';
  this.container_id = container_id;
  this.chartSettings = this._chartSettingsDefault();
  this.series = this.chartSettings.series;
  this.chartWidthSeconds = chartWidthSeconds;
}


RTTransformerChart.prototype.drawEmptyChart = function(){
    $(this.container_id).highcharts('StockChart', this.chartSettings);
};


/**
 * Default settings for Highstock chart.
 * @return {Chart} object that is used to configute chart.
 */
RTTransformerChart.prototype._chartSettingsDefault = function(){
  var config = {
      chart: {
        events:{
          load:function(){alert("radi");
        }}
      },

      title: {
          text: 'AAPL stock price by minute'
      },

      xAxis: {
          gapGridLineWidth: 0
      },

      yAxis: {
        title:{
          text:"Current (mA)"
        }
      },

      credits: {
        enabled: false
      },

      rangeSelector: {
          buttons: [{
              type: 'second',
              count: 30 ,
              text: '30S'
          }, {
              type: 'minute',
              count: 2,
              text: '2M'
          }, {
              type: 'minute',
              count: 10,
              text: '10M'
          },  {
              type: 'minute',
              count: 60,
              text: 'H'
          }
         ],
          selected: 1,
          inputEnabled: false
      },

      legend: {
        enabled:true
      },

      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
          valueSuffix: ' mA',
          shared:true,
          valueDecimals: 2
      },

      series:[]
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
RTTransformerChart.prototype._extractSerieByName = function(columnName, data){
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
 * @param  {String-Date}   read_after  lower bound of interval.
 * @param  {String-Date}   read_before upper bound of interval.
 * @param  {String[]}   columnsName which values should server return.
 * @param  {Function} cb  callback function.

 */
RTTransformerChart.prototype._getData = function(location_id, read_after, read_before, columnsName, cb){
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

/**
 * Generate serie with y values set to 0.
 * @param  {int} widthInSeconds is x axis width in seconds.
 * @return {[[x,y],[x,y],[x,y]...]} array of two points.
 */
RTTransformerChart.prototype._initSerieData = function(widthInSeconds){
  var data = [],
      time = (new Date()).getTime(),
      i;

  //x is an element of [currentTime - widthInSeconds, currentTime], while y=0
  for (i = -widthInSeconds; i <= 0; i += 1) {
      data.push([
          time + i * 1000,
          0
      ]);
  }
  return data;
};

RTTransformerChart.prototype.addEmptySerie = function(serieName){
  var seriesData = this._initSerieData(this.chartWidthSeconds);
  this.chartSettings.series.push({name:serieName, data:seriesData});
};

RTTransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

RTTransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

RTTransformerChart.prototype.setYAxis = function(yAxis){
  this.chartSettings.yAxis = {title:{text:yAxis}};
};

/**
 * Return array of series.
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
RTTransformerChart.prototype.onLoad = function(cb){
  var self = this;
  this.chartSettings.chart = {
    events:{
      load:function(){
        cb(this.series);
      }
    }
  };
}
