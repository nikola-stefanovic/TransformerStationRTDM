/**
 * Obezbeđuje komunikaciju sa serverom preko soketa.
 */
function DataProvider(){
  this.socket = io('http://localhost:3000/');

  //create associative array
  //key is location id, while the value is array of listeners
  this.observers = {};

  this.socket.on('connect', function(socket) {
    console.log('Socket: connected!');
  });

}

DataProvider.prototype.addListener = function(location_id, cb){
  if(this.observers.hasOwnProperty(location_id))
  {
    this.observers[location_id].push(cb);
  }else {
    this.observers[location_id] = [];
    this.observers[location_id].push(cb);
    this._starReceivingUpdate(location_id);
  }
};

DataProvider.prototype.removeListener = function(locationId, cbToRemove){
  if(this.observers.hasOwnProperty(locationId))
  {
    var listeners=this.observers[locationId];
    var index = listeners.indexOf(cbToRemove);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    if(listeners.length == 0){
      this._stopReceivingUpdate(locationId);
      delete this.observers[locationId];
    }
  }
};

DataProvider.prototype._starReceivingUpdate = function(locationId) {
  var listeners = this.observers[locationId];

  this.socket.on(locationId, function(data){
    for(var i=0; i<listeners.length; i++){
      listeners[i](data);
    }
  });
};

DataProvider.prototype._stopReceivingUpdate = function(locationId){
  this.socket.removeListener(locationId);
};
