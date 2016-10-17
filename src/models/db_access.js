var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

//TODO: Izbaci višak f-je

var columnArray = ['ID','LOCATION_ID','BATCH_TASK_ID','VALID','READ_TIME','DEVICE_ID','SUCCEDED_COMMUNICATION_ID','IPAL','IPAA','IPAH','IPBL','IPBA','IPBH','IPCL','IPCA','IPCH','VABL','VABA','VABH','VBCL','VBCA','VBCH','VCAL','VCAA','VCAH','PPTL','PPTA','PPTH','PQTL','PQTA','PQTH','EPTC','EQTC','TEML','TEMA','TEMH','FREL','FREA','FREH','IPNL','IPNA','IPNH','IPTL','IPTA','IPTH','PPAL','PPAA','PPAH','PPBL','PPBA','PPBH','PPCL','PPCA','PPCH','PQAL','PQAA','PQAH','PQBL','PQBA','PQBH','PQCL','PQCA','PQCH','PSTL','PSTA','PSTH','PFTL','PFTA','PFTH','EPTP','EQTP','RESOLUTION_TYPE_ID'];
var bindColumns = ":ID,:LOCATION_ID,:BATCH_TASK_ID,:VALID,:READ_TIME,:DEVICE_ID,:SUCCEDED_COMMUNICATION_ID,:IPAL,:IPAA,:IPAH,:IPBL,:IPBA,:IPBH,:IPCL,:IPCA,:IPCH,:VABL,:VABA,:VABH,:VBCL,:VBCA,:VBCH,:VCAL,:VCAA,:VCAH,:PPTL,:PPTA,:PPTH,:PQTL,:PQTA,:PQTH,:EPTC,:EQTC,:TEML,:TEMA,:TEMH,:FREL,:FREA,:FREH,:IPNL,:IPNA,:IPNH,:IPTL,:IPTA,:IPTH,:PPAL,:PPAA,:PPAH,:PPBL,:PPBA,:PPBH,:PPCL,:PPCA,:PPCH,:PQAL,:PQAA,:PQAH,:PQBL,:PQBA,:PQBH,:PQCL,:PQCA,:PQCH,:PSTL,:PSTA,:PSTH,:PFTL,:PFTA,:PFTH,:EPTP,:EQTP,:RESOLUTION_TYPE_ID";
var columnsName =  "ID,LOCATION_ID,BATCH_TASK_ID,VALID,READ_TIME,DEVICE_ID,SUCCEDED_COMMUNICATION_ID,IPAL,IPAA,IPAH,IPBL,IPBA,IPBH,IPCL,IPCA,IPCH,VABL,VABA,VABH,VBCL,VBCA,VBCH,VCAL,VCAA,VCAH,PPTL,PPTA,PPTH,PQTL,PQTA,PQTH,EPTC,EQTC,TEML,TEMA,TEMH,FREL,FREA,FREH,IPNL,IPNA,IPNH,IPTL,IPTA,IPTH,PPAL,PPAA,PPAH,PPBL,PPBA,PPBH,PPCL,PPCA,PPCH,PQAL,PQAA,PQAH,PQBL,PQBA,PQBH,PQCL,PQCA,PQCH,PSTL,PSTA,PSTH,PFTL,PFTA,PFTH,EPTP,EQTP,RESOLUTION_TYPE_ID";

//database configuration
var con_str = {
     user: "s14518",
     password: "novasifra",
     connectString: "160.99.9.199:1521/gislab.elfak.ni.ac.rs"};
var pool;

//create connectino pool
exports.init = function(cb){
	oracledb.createPool(con_str,
		(err, createdPool) => {
			if (err) return cb(err);
    		pool = createdPool;
		});
};

//release connection
function doRelease(connection) {
     connection.release(
          err => {
               if (err) {console.error(err.message);}
          }
     );
}

exports.isReady = function(){
	if(pool)
		return true;
	else
		return false;
};


//find rows using location id and read time interval
exports.getByLocationAndReadTime = function(locationID, readAfter, readBefore, maxNumOfRows, cb){
	pool.getConnection((err, connection) =>{
		if(err) return cb(err);

		if( maxNumOfRows != -1){
			connection.execute("SELECT * FROM trafo_data_history WHERE location_id =:locationID AND "
						+	"read_time>=:readAfter AND read_time<=:readBefore AND ROWNUM<=:maxNumOfRows",
				[locationID, readAfter,readBefore, maxNumOfRows],
				(err, result) =>{
					doRelease(connection);
					if(err) return cb(err);
					return cb(null, formattResult(result));
				});
		}else{
			connection.execute("SELECT * FROM trafo_data_history WHERE location_id =:locationID AND "
						+	"read_time>=:readAfter AND read_time<=:readBefore",
				[locationID, readAfter,readBefore],
				(err, result) =>{
					doRelease(connection);
					if(err) return cb(err);
					return cb(null, formattResult(result));
				});
		}
	});
};

//find rows using location id and read time interval,
//but return only specified columns
exports.getByLocationAndReadTimeCol = function(locationID, readAfter, readBefore, columns, maxNumOfRows, cb){
	pool.getConnection((err, connection) =>{
		if(err) return cb(err);

    if(columns.length == 0)
      columns.push("*"); //return all columns
    else
      columns.push("READ_TIME"); //always return read_time columns for x axis

    var query = "SELECT " + columns.toString() + " FROM trafo_data_history WHERE location_id =:locationID AND "
          +	"read_time>=:readAfter AND read_time<=:readBefore AND ROWNUM<=:maxNumOfRows ORDER BY read_time ASC";

		if( maxNumOfRows != -1){
			connection.execute(query,
				[locationID, readAfter,readBefore, maxNumOfRows],
				(err, result) =>{
					doRelease(connection);
					if(err) return cb(err);
					return cb(null, formattResult(result));
				});
		}else{
			connection.execute("SELECT " + columns.toString() + " FROM trafo_data_history WHERE location_id =:locationID AND "
						+	"read_time>=:readAfter AND read_time<=:readBefore",
				[locationID, readAfter,readBefore],
				(err, result) =>{
					doRelease(connection);
					if(err) return cb(err);
					return cb(null, formattResult(result));
				});
		}
	});
};


exports.getNthRowByReadTimeForLocation = function(location_id, row_num, cb){
	pool.getConnection((err, connection) =>{
		if(err) return cb(err);

		connection.execute("select * " +
								"from ( select a.*, rownum rnum " +
						          "from ( select * from trafo_data_history where location_id = :location_id order by read_time asc, id asc ) a " +
						      "where rownum <= :n ) " +
						  "where rnum >= :n",
			[location_id, row_num],
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

//TODO: sredi f-ju
exports.insertRow = function(row, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);

    var query = "INSERT INTO trafo_data_history(" + columnsName + ") " +
                "VALUES (" +bindColumns + ")";

    var niz = [];
    for(var i=0; i<72; i++)
      niz.push(null);
        //convert string to javascript Date type
        row.READ_TIME = new Date(row.READ_TIME);

        connection.execute(query,
          row,
          {autoCommit:true},
          (err, result) =>{
            doRelease(connection);
            if(err) return cb(err);
        });
  });
};


function formattResult(queryResult){
  return queryResult.rows;
};

//get row by id
exports.getUserByName = function(name, cb){
	pool.getConnection((err, connection) =>{
		if(err) return cb(err);
		connection.execute("SELECT * FROM ts_user WHERE name=:name",
			[name],
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};


//find transformers in given interval - pagination
exports.getTransformers = function(offset, limit, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);
    var query = "select * from ( " +
                  "select id,address,description,monitoring,row_number() "+
                  "over (order by id)rn " +
                  "from transformer_station ) " +
                "where rn between :n and :m " +
                "order by rn";
    connection.execute(query,
      [offset, offset+limit+1], //add one extra row
      {outFormat:Object.ARRAY},
      (err, transformers) =>{
        doRelease(connection);
        if(err) return cb(err);

        var hasMore = false;
        if(transformers.rows.length > limit){
          hasMore = true;
          transformers.rows.pop(); //remove extra row
        }

        return cb(null, transformers.rows);
      });
    });
};

//TODO: Mislim da se ne koristi.
exports.getAllTransformers = function(cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);
    connection.execute("SELECT id,address FROM transformer_station",
      [],
      (err,result) => {
        doRelease(connection);
        if(err) return cb(err);
        return cb(null, formattResult(result));
    });
  });
};

exports.getTransformerById = function(transformer_id, cb) {
  pool.getConnection((err, connection) =>{
		if(err) return cb(err);
		connection.execute("SELECT * FROM transformer_station WHERE id=:id",
			[transformer_id],
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

exports.updateTransformer = function(transformer_id, location, description, monitoring, cb){
  pool.getConnection((err, connection) =>{
		if(err) return cb(err);
    var query = "UPDATE transformer_station " +
            "SET address=:location, description=:description, monitoring=:monitoring " +
            "WHERE id=:transformer_id";
		connection.execute(query,
			[location, description, monitoring, transformer_id],
      {autoCommit:true},
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

exports.deleteTransformer = function(transformer_id, cb) {
  pool.getConnection((err, connection) =>{
		if(err) return cb(err);
		connection.execute("DELETE FROM transformer_station WHERE id=:id",
			[transformer_id],
      {autoCommit:true},
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

exports.addTransformer = function(location, description, allowMonitoring, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);

    var query = "INSERT INTO transformer_station(address, description, monitoring) " +
                "VALUES (:location, :description, :allowMonitoring)";
    connection.execute(query,
      [location, description, allowMonitoring],
      {autoCommit:true},
      (err, result) =>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null);
    });
  });
};



//------------------Operators---------------
//operators pagination
exports.getOperators = function(offset, limit, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);
    var query = "select * from ( " +
                  "select name,row_number() "+
                  "over (order by name)rn " +
                  "from TS_USER ) " +
                "where rn between :n and :m " +
                "order by rn";
    connection.execute(query,
      [offset, offset+limit+1], //add one extra row
      {outFormat:Object.ARRAY},
      (err, operators) =>{
        doRelease(connection);
        if(err) return cb(err);

        var hasMore = false;
        if(operators.rows.length > limit){
          hasMore = true;
          operators.rows.pop(); //remove extra row
        }

        return cb(null, operators.rows);
      });
    });
};

/**
 * Vraća sve operatore, zajedno sa brojem transformatora koje nadgledaju.
 */
exports.getAllOperators = function(cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);
    var query = "SELECT name, COUNT(operate.operator_id) TRANS_MONITORING "+
            "FROM ts_user LEFT JOIN operate "+
            "ON ts_user.id = operate.operator_id "+
            "WHERE ts_user.role = 'operator' "+
            "GROUP BY name";
    connection.execute(query,
      [], 
      {outFormat:Object.ARRAY},
      (err, operators) =>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null, operators.rows);
      });
    });
};



exports.updateUser = function(oldusername, newusername, password, cb){
  pool.getConnection((err, connection) =>{
		if(err) return cb(err);
    var query = "UPDATE ts_user " +
            "SET name=:newusername, password=:password " +
            "WHERE name=:oldusername";
		connection.execute(query,
			[newusername, password, oldusername],
      {autoCommit:true},
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

exports.deleteUser = function(username, cb) {
  pool.getConnection((err, connection) =>{
		if(err) return cb(err);
		connection.execute("DELETE FROM ts_user WHERE name=:username",
			[username],
      {autoCommit:true},
			(err, result) =>{
        console.log("Izbrisan: " + username);
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});
	});
};

exports.addUser = function(username, password, role, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);

    var query = "INSERT INTO ts_user(name, password, role) " +
                "VALUES (:username, :username, :role)";
    connection.execute(query,
      [username, password, role],
      {autoCommit:true},
      (err, result) =>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null);
    });
  });
};

/**
 * Vraća transformatore koje operator može da nadgleda.
 */
exports.getOperatorsTransformers = function(operator_id, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);

    var query = "SELECT t.id, t.address " +
                "FROM operate o JOIN transformer_station t " +
                "ON o.transformer_id=t.id and o.operator_id = :operator_id " +
                "WHERE t.monitoring != 0";
    connection.execute(query,
      [operator_id],
      {autoCommit:true},
      (err, result) =>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null, result.rows);
    });
  });

};



/**
 * Vraća sve transformatore, kao i informaciju o tome
 * da li operator može da nadgleda vraćene transformatore.
 */
exports.getAssignedTransformers = function(operator_id, cb){
  pool.getConnection((err, connection) =>{
    if(err) return cb(err);

    var query = "SELECT transformer_station.id trafo_id, transformer_station.address," +operator_id +" user_id, "
    + "NVL(operate.id,0) allow_monitoring " +
      "FROM transformer_station LEFT JOIN operate " +
      "ON operate.transformer_id=transformer_station.id AND operate.operator_id = :operator_id";
    connection.execute(query,
      [operator_id],
      {autoCommit:true},
      (err, result) =>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null, result.rows);
    });
  });

};

/**
 * Dodeljuje dozvolu operateru da nadgleda transformator.
 */
exports.allowMonitoring = function(user_id, transformer_id, cb){
  var query = "INSERT INTO operate(operator_id, transformer_id)"+
              "VALUES(:user_id, :transformer_id)";
  pool.getConnection((err, connection)=>{
    if(err) return cb(err);
    connection.execute(query,
      [user_id, transformer_id],
      {autoCommit:true},
      (err, result)=>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null);
      });
  });
};

/**
 * Vrši zabranu operateru da nadgleda određeni transformator.
 */
exports.forbidMonitoring = function(user_id, transformer_id, cb){
  var query = "DELETE FROM operate WHERE operator_id=:user_id AND transformer_id=:transformer_id";
  pool.getConnection((err, connection)=>{
    if(err) return cb(err);
    connection.execute(query,
      [user_id, transformer_id],
      {autoCommit:true},
      (err, result)=>{
        doRelease(connection);
        if(err) return cb(err);
        return cb(null);
      });
  });
};