/**
 * Omogućuje kreiranje panela koji sadrži kontrole za izbor: dijagrama,
 * transformatora i za aktiviranje 'real time' prikaza.
 * @param {object} diagrams     lista dijagrama sa nazivom dijagrama i
 * skupom veličina koje taj dijagram prikazuje.
 * @param {object} transformers lista transformata koja sadrži nazive
 * transformatora i njihove identifikatore.
 */
function RTCControl(diagrams, transformers){
  this.diagrams = [{name:"Struja",value:"IPAL,IPAA,IPAH", unitMeasure:"Current (mA)"},
                  {name:"Napon", value:"IPAA,IPBA,IPCA", unitMeasure:"Current (mA)"}];

  this.transformers = [{name:"Transformer a", id:41},
                      {name:"Transformer b", id:90}];

  this.root = $('<div/>').addClass("w3-container w3-light-grey");
  //create 'options' html elements
  this.diagramSelect = this._oDiagrams(this.diagrams);
  this.transformerSelect = this._oTransformer(this.transformers);
  this.monitoringSwitch = this._oMonitoringSwitch();
  //connect 'options' html elements
  this._connectElements();
}

/**
 * Create 'select' html element which represents different
 * types of diagrams (values) that can be shown.
 * @return {html element} created select element
 */
RTCControl.prototype._oDiagrams = function(diagrams){
  //create 'select' element
  var selectElement = $('<select/>', {
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
RTCControl.prototype._oTransformer = function(transformers){
  //create 'select' element
  var selectElement = $('<select/>');

  for(var i=0; i<transformers.length; i++){
    selectElement.append($('<option/>').val(transformers[i].id).html(transformers[i].name));
  }

  return selectElement;
};


/**
 * Wrap an html element within a div and prepend a 'span'.
 * @param  {string} text          text for span element.
 * @param  {htmlElement} arguments    html elements to wrap.
 * @return {dom}               wrapped element.
 */
RTCControl.prototype._wrapElement = function(text){
  //create a 'div' wrapper element
  var divWrapper = $('<div/>').addClass('wrapper');
  $('<span/>').html(text).appendTo(divWrapper);
  //wrap html elements
  for(var i=1; i<arguments.length; i++){
    arguments[i].appendTo(divWrapper);
  }
  return divWrapper;
};

RTCControl.prototype._oMonitoringSwitch = function(text){
  var label = $("<label/>").addClass("switch");
  $('<span/>').html(".").appendTo(label);//hack to align text
  var checkBox = $("<input/>").attr('type','checkbox');
  checkBox.appendTo(label);
  $('<div/>').addClass('slider round').appendTo(label);
  return label;
};

/**
 * Wrap previously created 'option' elements and append them in the root element.
 */
RTCControl.prototype._connectElements = function() {
  //wrap and append elements to the root element
  this.root.append(this._wrapElement("Veličina ", this.diagramSelect));
  this.root.append(this._wrapElement("Transformer ", this.transformerSelect));
  this.root.append(this._wrapElement("Nadgledanje ", this.monitoringSwitch));
};

/**
 * Append created papnel to provided element.
 */
RTCControl.prototype.appendTo = function(htmlElement){
  this.root.appendTo(htmlElement);
};

RTCControl.prototype.onMonitoringEnabled = function(cb){
  var checkbox = this.monitoringSwitch.children("input")[0];
  $(checkbox).change(function() {
    if(this.checked) {
        cb();
    }
  });
};

RTCControl.prototype.onMonitoringDisabled = function(cb){
  var checkbox = this.monitoringSwitch.children("input")[0];
  $(checkbox).change(function() {
    if(!this.checked) {
        cb();
    }
  });
};

RTCControl.prototype.controlsDisabled = function(disabled){
    this.diagramSelect.attr("disabled", disabled);
    this.transformerSelect.attr("disabled", disabled);
};

RTCControl.prototype.getSelectedDiagramName = function(){
  var selectedDiagramIndex =  this.diagramSelect.prop('selectedIndex');
  return this.diagrams[selectedDiagramIndex].name;
};

RTCControl.prototype.getSelectedDiagram = function(){
  return this.diagramSelect.val().split(",");
};

RTCControl.prototype.getSelectedTransformer = function(){
  return this.transformerSelect.val();
};

RTCControl.prototype.getReadAfter = function(){
  return this.afterDatetime.val();
};

RTCControl.prototype.getReadBefore = function(){
  return this.beforeDatetime.val();
};
