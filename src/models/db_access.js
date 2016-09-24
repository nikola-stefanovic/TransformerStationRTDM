//DataBaseAccess.js
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

var columnArray = ['ID','LOCATION_ID','BATCH_TASK_ID','VALID','READ_TIME','DEVICE_ID','SUCCEDED_COMMUNICATION_ID','IPAL','IPAA','IPAH','IPBL','IPBA','IPBH','IPCL','IPCA','IPCH','VABL','VABA','VABH','VBCL','VBCA','VBCH','VCAL','VCAA','VCAH','PPTL','PPTA','PPTH','PQTL','PQTA','PQTH','EPTC','EQTC','TEML','TEMA','TEMH','FREL','FREA','FREH','IPNL','IPNA','IPNH','IPTL','IPTA','IPTH','PPAL','PPAA','PPAH','PPBL','PPBA','PPBH','PPCL','PPCA','PPCH','PQAL','PQAA','PQAH','PQBL','PQBA','PQBH','PQCL','PQCA','PQCH','PSTL','PSTA','PSTH','PFTL','PFTA','PFTH','EPTP','EQTP','RESOLUTION_TYPE_ID'];
var bindColumns = ":ID,:LOCATION_ID,:BATCH_TASK_ID,:VALID,:READ_TIME,:DEVICE_ID,:SUCCEDED_COMMUNICATION_ID,:IPAL,:IPAA,:IPAH,:IPBL,:IPBA,:IPBH,:IPCL,:IPCA,:IPCH,:VABL,:VABA,:VABH,:VBCL,:VBCA,:VBCH,:VCAL,:VCAA,:VCAH,:PPTL,:PPTA,:PPTH,:PQTL,:PQTA,:PQTH,:EPTC,:EQTC,:TEML,:TEMA,:TEMH,:FREL,:FREA,:FREH,:IPNL,:IPNA,:IPNH,:IPTL,:IPTA,:IPTH,:PPAL,:PPAA,:PPAH,:PPBL,:PPBA,:PPBH,:PPCL,:PPCA,:PPCH,:PQAL,:PQAA,:PQAH,:PQBL,:PQBA,:PQBH,:PQCL,:PQCA,:PQCH,:PSTL,:PSTA,:PSTH,:PFTL,:PFTA,:PFTH,:EPTP,:EQTP,:RESOLUTION_TYPE_ID";
var columnsName =  "ID,LOCATION_ID,BATCH_TASK_ID,VALID,READ_TIME,DEVICE_ID,SUCCEDED_COMMUNICATION_ID,IPAL,IPAA,IPAH,IPBL,IPBA,IPBH,IPCL,IPCA,IPCH,VABL,VABA,VABH,VBCL,VBCA,VBCH,VCAL,VCAA,VCAH,PPTL,PPTA,PPTH,PQTL,PQTA,PQTH,EPTC,EQTC,TEML,TEMA,TEMH,FREL,FREA,FREH,IPNL,IPNA,IPNH,IPTL,IPTA,IPTH,PPAL,PPAA,PPAH,PPBL,PPBA,PPBH,PPCL,PPCA,PPCH,PQAL,PQAA,PQAH,PQBL,PQBA,PQBH,PQCL,PQCA,PQCH,PSTL,PSTA,PSTH,PFTL,PFTA,PFTH,EPTP,EQTP,RESOLUTION_TYPE_ID";

//database configuration
var con_str = {
     user: "xxxxxxxxxx",
     password: "xxxxxxxx",
     connectString: "xxxxxxxxxxxx"};
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

//get row by id
exports.getByID = function(id, cb){
	pool.getConnection((err, connection) =>{
		if(err) return cb(err);
		connection.execute("SELECT * FROM trafo_data_history WHERE id=:id",
			[id],
			(err, result) =>{
				doRelease(connection);
				if(err) return cb(err);
				return cb(null, formattResult(result));
			});

	});
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
    console.log(query);

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


//by default properties names are uppercase, this
//function make it lowercase
function formattResult(queryResult){
  return queryResult.rows;
};
