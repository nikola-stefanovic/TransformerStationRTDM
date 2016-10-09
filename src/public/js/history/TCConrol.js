/**
 * Omogućuje kreiranje panela koji sadrži kontrole za izbor: dijagrama,
 * transformatora, dva vremenska intervala i koji sadrži jedno dugme.
 * Obezbeđuje samo prikaz, ponašanje se definiše dodatno preko interfejsa.
 * @param {object} diagrams     lista dijagrama sa nazivom dijagrama i
 * skupom veličina koje taj dijagram prikazuje.
 * @param {object} transformers lista transformata koja sadrži nazive
 * transformatora i njihove identifikatore.
 */
function TCControl(diagrams, transformers){
  this.diagrams = [{name:"Struja",value:"IPAL,IPAA,IPAH", unitMeasure:"Current (mA)"},
                  {name:"Napon", value:"IPAA,IPBA,IPCA", unitMeasure:"Current (mA)"}];

  this.transformers = [{name:"Transformer a", id:41},
                      {name:"Transformer b", id:15}];

  this.root = $('<div/>').addClass("w3-container w3-light-grey");
  //create 'options' html elements
  this.diagramSelect = this._oDiagrams(this.diagrams);
  this.transformerSelect = this._oTransformer(this.transformers);
  this.afterDatetime = this._oDatetimePicker("2015-01-01T00:00");
  this.beforeDatetime = this._oDatetimePicker("2017-01-01T00:00");
  this.showButton = this._oShowButton();
  //connect 'options' html elements
  this._connectElements();

}

/**
 * Create 'select' html element which represents different
 * types of diagrams (values) that can be shown.
 * @return {html element} created select element
 */
TCControl.prototype._oDiagrams = function(diagrams){
  //create 'select' element
  var selectElement = $('<select/>', {
    'class':'w3-border w3-white',
    'name':"option"
  });
  for(var i=0; i<diagrams.length; i++){
    selectElement.append($('<option/>').val(diagrams[i].value).html(diagrams[i].name));
  }

  return selectElement;
};

/**
 * Create 'select' html element that lets a user to
 * choose a transformer.
 * @return {html element} created select element
 */
TCControl.prototype._oTransformer = function(transformers){
  //create 'select' element
  var selectElement = $('<select/>').addClass('w3-border w3-white');

  for(var i=0; i<transformers.length; i++){
    selectElement.append($('<option/>').val(transformers[i].id).html(transformers[i].name));
  }

  return selectElement;
};

/**
 * Create a datetime input conrol.
 * @return {[type]}              created control.
 */
TCControl.prototype._oDatetimePicker = function(defaultValue){
  var datetime = $('<input/>').attr('type','datetime-local').val(defaultValue);
  return datetime;
};

/**
 * Wrap an html element within a div and prepend a 'span'.
 * @param  {string} text          text for span element.
 * @param  {htmlElement} arguments    html elements to wrap.
 * @return {dom}               wrapped element.
 */
TCControl.prototype._wrapElement = function(text){
  //create a 'div' wrapper element
  var divWrapper = $('<div/>').addClass('wrapper');
  $('<span/>').html(text).appendTo(divWrapper);
  //wrap html elements
  for(var i=1; i<arguments.length; i++){
    arguments[i].appendTo(divWrapper);
  }
  return divWrapper;
};

TCControl.prototype._oShowButton = function(){
  var btn = $('<a/>').attr('class','w3-btn w3-white w3-padding-tiny w3-border').html('Prikaži');
  return btn;
};

/**
 * Wrap previously created 'option' elements and append them in the root element.
 */
TCControl.prototype._connectElements = function() {
  //wrap and append elements to the root element
  this.root.append(this._wrapElement("Veličina ", this.diagramSelect));
  this.root.append(this._wrapElement("Transformer ", this.transformerSelect));
  this.root.append(this._wrapElement("U periodu od ", this.afterDatetime));
  this.root.append(this._wrapElement("do ", this.beforeDatetime, this.showButton));
};

/**
 * Append created papnel to provided element.
 */
TCControl.prototype.appendTo = function(htmlElement){
  this.root.appendTo(htmlElement);
};

TCControl.prototype.checkInput = function(){
  var res = {valid:true, msg:null};

  var values = this.diagramSelect.val();
  var transformerId = this.transformerSelect.val();
  var readAfter = this.afterDatetime.val();
  var readBefore = this.beforeDatetime.val();

  if(!values || !transformerId || !readAfter || !readBefore){
    res.msg = "Nisu unete sve vrednosti.";
    res.valid = false;
  }else if(new Date(readBefore) <= new Date(readAfter)){
    res.msg = "Nevalidan vremenski interval.";
    res.valid = false;
  }

  return res;
};

TCControl.prototype.onShowButtonClicked = function(cb){
  this.showButton.on('click',function(){cb();});
};

TCControl.prototype.getSelectedDiagramName = function(){
  var selectedDiagramIndex =  this.diagramSelect.prop('selectedIndex');
  return this.diagrams[selectedDiagramIndex].name;
};

TCControl.prototype.getSelectedDiagram = function(){
  return this.diagramSelect.val().split(",");
};

TCControl.prototype.getSelectedTransformer = function(){
  return this.transformerSelect.val();
};

TCControl.prototype.getReadAfter = function(){
  return this.afterDatetime.val();
};

TCControl.prototype.getReadBefore = function(){
  return this.beforeDatetime.val();
};
