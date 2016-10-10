/**
 * Obezbeđuje kreiranje stranice koja omogućuje korisniku dinamičko
 * dodavanje različitog broja dijagrama za praćenje izmerenih
 * veličina u realnom vremenu.
 */
function RTMultipleChart(container_id){
  this.dataProvider = new DataProvider();
  this.addChart(container_id);
}

/**
 * Dodaje grafika koji se sastoji panela sa opcijama, dela za
 * iscrtavanje grafika i podnožja sa dodatnim opcijama.
 */
RTMultipleChart.prototype.addChart = function(chart_cont, insertAfter){
  var self = this;
  var listener = null;
  //create div that wrap control panel, chart and footer
  var wrapper = $('<div/>').addClass("chart-wrapper");
  if(!insertAfter)
    wrapper.appendTo($(chart_cont));
  else
    wrapper.insertAfter(chart_cont);

  //create a control panel for the chart
  var controlPanel = new RTCControl(diagramDescription,transformerDescription);
  controlPanel.appendTo(wrapper);
  //create an empty chart
  var chart = new RTTransformerChart(60*60);
  chart.appendTo(wrapper);
  chart.addEmptySerie("Linija");
  chart.drawEmptyChart();
  chart.setTitle("Izaberite podatke za prikaz");
  //create a footer
  var footer = this._addFooter(wrapper);

  controlPanel.onMonitoringEnabled(function(){
    controlPanel.controlsDisabled(true);
    //destroy old chart
    if(listener)
      self.dataProvider.removeListener(controlPanel.getSelectedTransformer(), listener);
    chart.destroy();
    //create new chart
    var diagramDescription = controlPanel.getSelectedDiagramDescription();
    chart = new RTTransformerChart(60*60, diagramDescription);
    chart.setTitle(controlPanel.getSelectedDiagramName());
    //chart.setSubtitle(controlPanel.getSelectedTransformerName());
    chart.setYAxisTitle(controlPanel.getSelectedDiagramYtitle());
    //set listener for new chart
    listener = function(data){chart.updateSerie(data[0]);}
    self.dataProvider.addListener(controlPanel.getSelectedTransformerValue(), listener);//TODO: možda treba da se doda na onLoad event

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
 * Dodaje dva dugmeta ispod grafika za njegovo brisanje ili
 * dodavanje novog grafika ispod.
 */
RTMultipleChart.prototype._addFooter = function(parent, listener){
  var self = this;
  var footer = $('<div/>');
  var dltBtn = $('<button/>').html("Izbriši");
  dltBtn.appendTo(footer);
  dltBtn.on('click',function(){
    //TODO:deaktiviraj dugme za brisanje dok se ne zaustavi apdejtovanje dijagrama
    parent.remove();
  });

  var addChartBtn = $('<button/>').html("Dodaj dijagram");
  addChartBtn.appendTo(footer);
  addChartBtn.on('click',function(){
    self.addChart(parent, true);
  });
  footer.appendTo(parent);

  return footer;
};
