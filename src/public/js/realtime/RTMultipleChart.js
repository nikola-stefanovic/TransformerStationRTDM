/**
 * Obezbeđuje kreiranje stranice koja sadrži više dijagrama.
 */
function RTMultipleChart(container_id){
  this.dataProvider = new DataProvider();
  this.addChart(container_id);
}

RTMultipleChart.prototype.addChart = function(chart_cont, insertAfter){
  var self = this;
  var listener = null;
  //create div that wrap control panel, chart and footer
  var wrapper = $('<div/>');
  wrapper.addClass("chart-wrapper");
  if(!insertAfter)
    wrapper.appendTo($(chart_cont));
  else
    wrapper.insertAfter(chart_cont);

  //create control panel for chart
  var controlPanel = new RTCControl();
  controlPanel.appendTo(wrapper);
  //create empty chart
  var chart = new RTTransformerChart(60*60);
  chart.appendTo(wrapper);
  chart.addEmptySerie("sda");
  chart.drawEmptyChart();
  chart.setTitle("Izaberite podatke za prikaz");
  //create footer
  var footer = this._addFooter(wrapper);
  //start monitoring
  controlPanel.onMonitoringEnabled(function(){
    controlPanel.controlsDisabled(true);
    //destroy old chart
    if(listener)
      self.dataProvider.removeListener(controlPanel.getSelectedTransformer(), listener);
    chart.destroy();
    //create new chart and set listener
    chart = new RTTransformerChart(60*60);

    listener = function(data){chart.updateSerie(data[0]);}
    self.dataProvider.addListener(controlPanel.getSelectedTransformer(), listener);//TODO: možda treba da se doda na onLoad event

    chart.prependTo(footer);
    chart.drawEmptyChart();
    chart.setTitle(controlPanel.getSelectedDiagramName());

  });

  controlPanel.onMonitoringDisabled(function(){
    controlPanel.controlsDisabled(false);
    self.dataProvider.removeListener(controlPanel.getSelectedTransformer(), listener);
    listener = null;
  });

  wrapper.css("min-height",wrapper.height()+"px");

  return wrapper;
};

/**
 * Create buttons for deleting and adding chart.
 */
RTMultipleChart.prototype._addFooter = function(parent, listener){
  var self = this;
  var footer = $('<div/>');
  var dltBtn = $('<button/>').html("Izbriši");
  dltBtn.appendTo(footer);
  dltBtn.on('click',function(){
    //TODO:disable delete on active chart
    parent.remove();
  });

  var self = this;
  var addChartBtn = $('<button/>').html("Dodaj dijagram");
  addChartBtn.appendTo(footer);
  addChartBtn.on('click',function(){
    self.addChart(parent, true);
  });
  footer.appendTo(parent);

  return footer;
};
