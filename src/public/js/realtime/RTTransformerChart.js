function RTTransformerChart(chartWidthSeconds, diagramDescription){
  //TODO: vidi šta je višak i izbaci ga
  this.service = 'http://localhost:3000/measurement/';
  this.diagramDescription = diagramDescription;
  this.chartWidthSeconds = chartWidthSeconds;

  this.container = $('<div/>');
  this.chartSettings = this._chartSettingsDefault();
  this.series = this.chartSettings.series;
  this.seriesInitialized = false;
  this.chart;
}

RTTransformerChart.prototype.drawEmptyChart = function(){
  $(this.container).highcharts('StockChart', this.chartSettings);
};


/**
 * Definiše objekat koji se koristi za inicijalizaciju Highchart grafika.
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
          },  {
              type: 'minute',
              count: 5,
              text: '5M'
          },  {
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
 * Generiše seriju 2D tačaka koje se koriste za inicijalizaciju grafika.
 * Ovo neophodno zato što Highchart biblioteka ne omogućava dinamičko
 * dodavanje tačaka na prazan grafik.
 * @param  {int} widthInSeconds definiše veličinu x ose.
 * @param  {Date} initTime vrednost poslednje tačke na x osi.
 * @return {[[x,y],[x,y],[x,y]...]} seriju tačaka gede je y=0.
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

/**
 * Uništava kompletan grafik.
 */
RTTransformerChart.prototype.destroy = function(){
  this.container.highcharts().destroy();
};

RTTransformerChart.prototype.setTitle = function(title){
  this.chartSettings.title = {text:title};
};

RTTransformerChart.prototype.setSubtitle = function(title){
  this.chartSettings.subtitle = {text:title};
};

RTTransformerChart.prototype.setYAxisTitle = function(yAxisTitle){
  this.chartSettings.yAxis = {title:{text:yAxisTitle}};
};

RTTransformerChart.prototype.appendTo = function(element){
  this.container.appendTo(element);
};

RTTransformerChart.prototype.prependTo = function(element){
  this.container.prependTo(element);
};

/**
 * Metod apdejtuje dijagram dodavanjem po jedne nove vrednosti
 * svakoj liniji na dijagramu.
 * @param  {object} row sadrži vrednosti poslednjeg merenja.
 */
RTTransformerChart.prototype.updateSerie = function(row){
  //initialize series
  if(!this.seriesInitialized){
    for(var i=0; i<this.diagramDescription.labels.length; i++)
    {
      this.addEmptySerie(this.diagramDescription.labels[i], Date.parse(row.READ_TIME));
    }

    this.seriesInitialized = true;
  }

  //add a point to series
  var x = Date.parse(row.READ_TIME);
  var y;
  var measures = this.diagramDescription.value.split(",");
  for(var i=0; i<measures.length; i++){
    y = row[measures[i]];
    this.series[i].addPoint([x,y], true, true);
  }
};
