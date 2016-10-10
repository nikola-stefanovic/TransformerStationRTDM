/**
 * Obezbeđuje kreiranje stranice koja sadrži više dijagrama.
 */
function MultipleChart(container_id){
  this.addChart(container_id);

}

MultipleChart.prototype.addChart = function(chart_cont, appendAfter){
  //create div that wrap control panel, chart and footer
  var wrapper = $('<div/>');
  wrapper.addClass("chart-wrapper");
  if(!appendAfter){
    wrapper.appendTo($(chart_cont));
  }else {
    wrapper.insertAfter(chart_cont);
  }
  //create control panel for chart
  var controlPanel = new TCControl(diagramDescription,transformerDescription);
  controlPanel.appendTo(wrapper);
  //create empty chart
  var initialChart = new TransformerChart();
  initialChart.appendTo(wrapper);
  initialChart.drawEmptyChart();
  initialChart.setTitle("Izaberite podatke za prikaz");
  //create footer
  var footer = this._addFooter(wrapper);
  //redraw chart
  var chart = initialChart;
  controlPanel.onShowButtonClicked(function(){
    var checkInput = controlPanel.checkInput();
    if(!checkInput.valid){
      alert(checkInput.msg);
      return;
    }
    //recreate chart
    chart.destroy();
    chart = new TransformerChart(controlPanel.getSelectedDiagramDescription());
    chart.prependTo(footer);
    var diagram = controlPanel.getSelectedDiagram();
    var transId = controlPanel.getSelectedTransformer();
    var readAfter = controlPanel.getReadAfter();
    var readBefore = controlPanel.getReadBefore()
    chart.drawChart(transId, readAfter, readBefore, diagram);
    chart.setTitle(controlPanel.getSelectedDiagramName());
    chart.setYAxisTitle(controlPanel.getSelectedDiagramYtitle());

  });

  wrapper.css("min-height",wrapper.height()+"px");

  return wrapper;
};


/**
 * Create buttons for deleting and adding chart.
 */
MultipleChart.prototype._addFooter = function(parent){
  var footer = $('<div/>');
  var dltBtn = $('<button/>').html("Izbriši");
  dltBtn.appendTo(footer);
  dltBtn.on('click',function(){
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
