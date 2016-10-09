function RTTransformerChart(chartWidthSeconds,seriesArray){
  this.service = 'http://localhost:3000/measurement/';
  this.container = $('<div/>');
  this.chartSettings = this._chartSettingsDefault();
  this.series = this.chartSettings.series;
  this.measuresArray = seriesArray;
  this.chartWidthSeconds = chartWidthSeconds;
  this.listeningLocationId = -1;
  this.updateCounter = 0;
  this.updateSerie.series = this.series;
  this.chart;
}

RTTransformerChart.prototype.drawEmptyChart = function(){
  $(this.container).highcharts('StockChart', this.chartSettings);
};


/**
 * Default settings for Highstock chart.
 * @return {Chart} object that is used to configute chart.
 */
RTTransformerChart.prototype._chartSettingsDefault = function(){
  var self = this;
  var config = {
      chart: {
        events:{
          load:function(){ self.series = this.series;  self.chart = this;}
        }
      },
      title: {
          text: 'Izaberite podatke za prikaz'
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
 * Generate serie with y values set to 0.
 * @param  {int} widthInSeconds is x axis width.
 * @return {[[x,y],[x,y],[x,y]...]} a serie.
 */
RTTransformerChart.prototype._initSerieData = function(widthInSeconds, initTime){
  var data = [],
      //time = (new Date()).getTime(),
      time,
      i;

      if(!initTime)
        time = (new Date()).getTime();
      else
        time = initTime;

      //time = time - 2*365*24*60*60*1000;
  //x is an element of [currentTime - widthInSeconds, currentTime], while y=0
  for (i = -widthInSeconds; i <= 0; i += 1) {
      data.push([
          time + i * 1000,
          0
      ]);
  }
  return data;
};

RTTransformerChart.prototype.addEmptySerie = function(serieName, initTime){
  var seriesData = this._initSerieData(this.chartWidthSeconds, initTime);
  if(!this.chart)
    this.series.push({name:serieName, data:seriesData});
  else
    this.chart.addSeries({name:serieName, data:seriesData},true);
};

RTTransformerChart.prototype.destroy = function(){
  this.container.highcharts().destroy();
};

RTTransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

RTTransformerChart.prototype.setYAxis = function(yAxis){
  this.chartSettings.yAxis = {title:{text:yAxis}};
};

RTTransformerChart.prototype.appendTo = function(element){
  this.container.appendTo(element);
};

RTTransformerChart.prototype.prependTo = function(element){
  this.container.prependTo(element);
};

RTTransformerChart.prototype.updateSerie = function(row){
  //alert("Stigao red" + JSON.stringify(row));
  if(this.updateCounter == 0)
    this.addEmptySerie("A", Date.parse(row.READ_TIME));

  this.updateCounter++;

  //var x = (new Date()).getTime(); // current time
      //var y = Math.round(Math.random() * 100);
  //if(this.series[0].data.length ==0)alert("velicina je 0");
  var x = Date.parse(row.READ_TIME);
  var y = row.EPTC % 100;
  console.log("x=" + x +" y=" + y);
  //this.series[0].addPoint([x, y], true, true);
 this.series[0].addPoint([x, y], true, true); //true / false to redraw
  //alert("Dodato");
};

/**
 * Return array of series. Series are needed for live update.
 */
RTTransformerChart.prototype.onLoad = function(cb){
  var self = this;
  this.chartSettings.chart = {
    events:{
      load:function(){
        self.chart = this;
        self.series = this.series;

        cb(this.series);
      }
    }
  };
}
