$(function () {
function chart(){
  var cp = new TCControl();
  cp.appendTo("#container");

  var tc = new TransformerChart("#container");
  tc.setTitle("Izaberite podatke za prikaz")
  tc.drawEmptyChart();


  cp.onShowButtonClicked(function(){

    var checkInput = cp.checkInput();
    if(!checkInput.valid){
      alert(checkInput.msg);
      return;
    }

    tc.destroy();
    tc = new TransformerChart("#container");
    var diagram = cp.getSelectedDiagram();
    var transId = cp.getSelectedTransformer();
    var readAfter = cp.getReadAfter();
    var readBefore = cp.getReadBefore()
    tc.drawChart(transId, readAfter, readBefore, diagram);
    tc.setTitle(cp.getSelectedDiagramName());
  });
}

//chart();
var chartsPage = new MultipleChart("#container");


});
