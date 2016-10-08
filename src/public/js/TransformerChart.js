/**
 * Klasa služi za iscrtavanje grafika pomoću Highchart biblioteke.
 */
function TransformerChart(){
  this.service = 'http://localhost:3000/measurement/';
  this.seriesOptions = [];
  this.container = $('<div/>');
  this.chartSettings = this._chartSettingsDefault();
}

/**
 * Draw empty graphic.
 */
TransformerChart.prototype.drawEmptyChart = function(){
    $(this.container).highcharts('StockChart', this.chartSettings);
};

/**
 * Get data from server and draw a chart.
 */
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
    this.chartSettings.series = this.seriesOptions;
    //console.log(JSON.stringify(this.chartSettings.series));
    $(this.container).highcharts('StockChart', this.chartSettings);

  });
};

/**
 * Default settings for a Highstock chart.
 * @return {object} object that is used to configute chart.
 */
TransformerChart.prototype._chartSettingsDefault = function(seriesOptions){
  var config = {
      chart: {
        events:{
          load:function(chart){chart.target.reflow();}
        }
      },
      title: {
          text: 'Izaberi dijagram za prikaz'
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
 * Extract values from a data array and create
 * an array in format that can be used by Highchart.
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
 * Get measured values from a server for specific transformer.
 * @param  {int}   location_id is transformer id.
 * @param  {String-Date}   read_after  lower bound of interval.
 * @param  {String-Date}   read_before upper bound of interval.
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

TransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

TransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

TransformerChart.prototype.setYAxis = function(yAxis){
  this.chartSettings.yAxis = {title:{text:yAxis}};
};

TransformerChart.prototype.destroy = function(){
  this.container.highcharts().destroy();
};

TransformerChart.prototype.appendTo = function(element){
  this.container.appendTo(element);
};

TransformerChart.prototype.prependTo = function(element){
  this.container.prependTo(element);
};
