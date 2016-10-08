function checkInputs(columns, transformerId, readBefore, readAfter){
  var res = {valid:true, msg:null};
  if(!columns || !transformerId || !readAfter || !readBefore){
    res.msg = "Nisu unete sve vrednosti.";
    res.valid = false;
  }else if(new Date(readBefore) <= new Date(readAfter)){
    res.msg = "Nevalidan vremenski interval.";
    res.valid = false;
  }
  return res;
}



$(function () {
  var tc = new RTTransformerChart(container, 60*60);//container variable sets server
  var columnsName = ['IPAL','IPAA','IPAH','VABL'];
  tc.addEmptySerie("Napon");

  tc.onLoad(function(seriesArr){
    // set up the updating of the chart each second
    var series = seriesArr[0];

    setInterval(function () {
        var x = (new Date()).getTime(), // current time
            y = Math.round(Math.random() * 100);
        series.addPoint([x, y], true, true);
    }, 1000);
  });

  tc.drawEmptyChart(41, "2005-04-27T18:44:13.000Z", "2025-04-27T18:44:16.000Z", columnsName);


  //set initial values to datetime input element
  $("#ts-read-after").attr("value", "2016-01-01T00:00");
  $("#ts-read-before").attr("value","2017-01-01T00:00");

  var showDiagramBtn = $("#ts-show-diagram").on('click', function(){
    //get data from input controls
    var columns = $("#ts-diagram-type").val();
    var transformerId = $("#ts-transformer").val();
    var readAfter = $("#ts-read-after").val();
    var readBefore = $("#ts-read-before").val();
    //check input values
    var inputs = checkInputs(columns, transformerId, readBefore, readAfter);
    if(!inputs.valid){
      alert(inputs.msg);
      return;
    }
    var columnsArray = columns.split(",");
    //destroy old chart
    $('#container').highcharts().destroy();
    //create and draw new chart
    var tc = new TransformerChart(container);

    tc.drawChart(transformerId, readBefore, readAfter, columnsArray);

  });

  //tc.drawEmptyChart();
});
