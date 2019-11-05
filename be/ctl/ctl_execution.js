//Made by David Aleixo @ david.aleixo@knowledgebiz.pt
var handler = "ctl-execution";
var log 	= require('../logger');
var db 		= require('../db');
var flow 	= require('../common');
var fs 		= require('fs');
var path 	= require('path');
var request = require('request');


var _getSelectedTables = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getSelectedTables:";
	log.debug(flowstr);
	db.tables.getByTplId(f,tid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r)
		}
	})
}

var _getSelectedFieldsByTableId = function(f, tableid, cb){
	var flowstr = f + "-" + handler + "-" + "_getSelectedFieldsByTableId:";
	log.debug(flowstr);
	db.fields.getByTableId(f,tableid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r)
		}
	})
}

var _getRelationByTplId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getRelationByTplId:";
	log.debug(flowstr);
	db.relations.getByTemplateId(f, tid, function(e,r){
		if(e){
			log.error(flowstr + "error:" + e);
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r)
		}
	})
}

var _getFiltersByTplId = function(f, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_getFiltersByTplId:";
	log.debug(flowstr);
	db.filters.getByTemplateId(f,tid,function(e,r){
		if(e){
			log.error(flowstr + "error:" + JSON.stringify(e));
			cb(e);
		}else{
			log.debug(flowstr + "result: " + JSON.stringify(r));
			cb(false, r);
		}
	})
}

//MySQL Query
var _queryBuilder = function(f, data, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_queryBuilder:";
	log.debug(flowstr);

	//Prepare the from and left join part
	var from = [];
	var join = [];
	var selection = [];
	var where = [];
	var query = "";
	db.conn.getByTplId(f, tid, function(e,r){
		if(!e){
			log.debug(flowstr + JSON.stringify(r[0]))
			data.forEach(function(eachTable, idx1, array1){
				eachTable.relation.forEach(function(eachRelation){
					if(eachTable.left){
						join.push({leftname: eachTable.name, leftalias: eachTable.name.charAt(0)+eachTable.name.charAt(1), on: eachTable.name.charAt(0)+eachTable.name.charAt(1)+"."+eachTable.leftfield+"="+eachTable.righttable.charAt(0)+eachTable.righttable.charAt(1)+"."+eachTable.rightfield})
					}else{
						from.push({tablename: eachTable.name, alias: eachTable.name.charAt(0)+eachTable.name.charAt(1)})
					}
				})
				eachTable.sFields.forEach(function(eachField, idx2, array2){
					//DELETE FROM SELECTION THE FIELD THAT IS USE TO JOINT TABLES
					if((eachField.name != eachTable.leftfield) && (eachField.name != eachTable.rightfield)){
						selection.push({tablealias : eachTable.name.charAt(0)+eachTable.name.charAt(1), fieldname: eachField.name, alias: eachField.aliases})	
					}
					//WHERE CONDITIONS
					if(eachField.filter.length >= 1){
						eachField.filter.forEach(function(eachWhere){
							where.push({tablealias: eachTable.name.charAt(0)+eachTable.name.charAt(1), fieldname: eachField.name, condition: eachWhere.condition, value: eachWhere.value })	
						})
					}
					if(idx2 == array2.length -1 && idx1 == array1.length -1){
						//FINISHED
						selection.forEach(function(eachSelection, idxS, arrayS){
							query += " " + eachSelection.tablealias + "." + eachSelection.fieldname + " as " + eachSelection.alias;
							if(idxS != arrayS.length -1){
								query += ","
							}else{
								query = "SELECT " + query + " FROM ";
								//FROM
								from.forEach(function(eachFrom, idxF, arrayF){
									query += eachFrom.tablename + " as " + eachFrom.alias;
									if(idxF != arrayF.length -1){
										query += ","
									}else{
										//JOIN
										if(join.length > 0) {
											join.forEach(function(eachJoin, idxJ, arrayJ){
												query += " LEFT JOIN " + eachJoin.leftname + " " + eachJoin.leftalias + " ON " + eachJoin.on;
												if(idxJ == arrayJ.length -1 ){
														// WHERE
														if(where.length > 0){
															query += " WHERE ";
															where.forEach(function(eachWhere, idxW, arrayW){
																query += eachWhere.tablealias + "." + eachWhere.fieldname + " " + eachWhere.condition + " " + eachWhere.value;
																if(idxW != arrayW.length - 1 ){
																	query += " AND "
																}else{
																	log.debug(flowstr + query);
																	db.execution.query(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, query, function(error,result, resultfields){
																		if(error){
																			log.error(error);
																		}else{
																			log.info(JSON.stringify(result));
																			updateHtml(f, tid, result, resultfields, function(e,html){
																				if(e){
																					cb(e)
																				}else{
																					cb(false, html)
																				}
																			});
																		}
																	});
																}
															})
														//NO WHERE CLAUSE DEFINED		
													}else{
														log.debug(flowstr + "Query!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: " + query);
														db.execution.query(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, query, function(error,result, resultfields){
															if(error){
																log.error(error);
															}else{
																log.info(JSON.stringify(result));
																updateHtml(f, tid, result, resultfields, function(e,html){
																	if(e){
																		cb(e)
																	}else{
																		cb(false, html)
																	}		
																});
															}
														});
													}
												}
											})
											//NO JOIN CLAUSE DEFINED
										}else{
												// WHERE
												if(where.length >= 1){
													query += " WHERE ";
													where.forEach(function(eachWhere, idxW, arrayW){
														query += eachWhere.tablealias + "." + eachWhere.fieldname + " " + eachWhere.condition + " " + eachWhere.value;
														if(idxW != arrayW.length - 1 ){
															query += " AND "
														}else{
															log.debug(flowstr + query);
															log.debug(flowstr + "Query!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: " + query);
															db.execution.query(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, query, function(error,result, resultfields){
																if(error){
																	log.error(error);
																}else{
																	log.info(JSON.stringify(result));
																	updateHtml(f, tid, result, resultfields, function(e,html){
																		if(e){
																			cb(e)
																		}else{
																			cb(false, html)
																		}
																	});
																}
															});
														}
													})
												//NO WHERE CLAUSE DEFINED	
											}else{
												log.debug(flowstr + "Query!!!!!!!!!!!!!!!!!!!!!!!!: " + query);
												db.execution.query(flowstr, r[0].hostname, r[0].username, r[0].password, r[0].dbname, query, function(error,result, resultfields){
													if(error){
														log.error(error);
													}else{
														log.info(JSON.stringify(result));
														updateHtml(f, tid, result, resultfields, function(e,html){
															if(e){
																cb(e)
															}else{
																cb(false, html)
															}
														});
													}
												});
											}
										}
									}
								})
							}	
						})
					} 
				})
			})
		}else{
			log.error(error);
		}
	})
}

//Function for create HTML
var updateHtml = function(f, tid, data, datafields, cb){
	log.debug(__dirname);
	fs.readFile(path.join(__dirname, '../output/output.html'),'utf8', function (err, html) {
		if(err){log.error(err)} else{
			
			db.headers.getByTplId(f, tid, function(e,header){
				db.footers.getByTplId(f,tid, function(er, footer){
					if(header.length == 0 && footer.length == 0){
						cb(false, "There is no Style, please go to Style Tab and create Footer and/or Header");

					}else{
						html = html.replace('SREHEADER',header[0].html);
						html = html.replace('SREFOOTER',footer[0].html);

						//create table
						var report = '<table class="table table-striped">';
						report += '<thead><tr>';
					    //var flag = 0;
					    datafields.forEach(function(eachField, idxf, arrayf){
					    	report += '<th>'+eachField.name+'</th>'
					    	if(idxf == arrayf.length -1){
					    		report += '</tr></thead>';
					    		report += '<tbody>';
					    		data.forEach(function(eachRow, idxR, arrayR){
					    			report += '<tr>';
					    			Object.keys(eachRow).forEach(function(key){
					    				report += '<td>' + eachRow[key] + '</td>'
					    			})
					    			report += '</tr>'
					    			if(idxR == arrayR.length - 1){
					    				report += '</tbody></table>'
					    			}
					    		})
					    	}
					    })
					    html = html.replace('SREREPORT', report);
					    //update the report template name
					    db.templates.getByTplId(f, tid, function(e,r){
					    	html = html.replace('SRETPLNAME', r[0].name);
					    	cb(false, html);
					    })
					}
				})
			})
		}
		
	})
}

//VF-OS Storage for concatenate keys between tables
var concatenateObjectsByKey = function(name, keyleft, keyright, leftObj, rightObj, cb){
	let output = [];
	
	rightObj.forEach(function(eachElemRight, idxr, arrayr){
		//iterate right keys on each elem from the right table
		for(var rightkey in eachElemRight){
			//find the correct key
			if(keyright == rightkey){
				//find the correct value
				leftObj.forEach(function(eachElemLeft){
					for(var leftkey in eachElemLeft){

						if(eachElemLeft[keyleft] == eachElemRight[keyright]){
							//correct value found
							let aux_obj = Object.assign({},eachElemLeft);
							delete aux_obj[keyleft];
							let aux2_obj = Object.assign({},eachElemRight);
							delete aux2_obj[keyright];
							let result = Object.assign({}, aux_obj, aux2_obj);
							output.push(result);
							break;
						}
					}
				})
			}
		}
		if(idxr == arrayr.length - 1){
			//lets go out
			cb(output, name);
		}
	})
}

var convertArrayToObject = function(input, name, cb){
	let aux={};
	var output=[];
	input.forEach( function(eachElem, idx, array) {
		eachElem.forEach( function(eachObj, i, arr) {
			aux[Object.keys(eachObj)[0]] = eachObj[Object.keys(eachObj)[0]];
			if(i == arr.length - 1){
				output.push(aux);
				aux = {};
			}
		})
		if(idx == array.length - 1){
			cb(output, name);
		}
	})
}

var substituteTableName = function(nameToSubstitute, inputdata, cb){
	allData.forEach(function(eachElem, idx, array){
		if(eachElem.tablename == nameToSubstitute){
			eachElem.result = inputdata;
			cb();
		}
	})
}

var resultData = function(alldata, tname, cb){
	var data = [];
	var fields = [];
	alldata.forEach(function(eachData, idx, array){
		if(eachData.tablename != tname){
			delete eachData;
		}
	})
	for(var key in alldata[0].result[0]){
		fields.push({name:key})
	}
	data = alldata[0].result;
	cb(data, fields);
}

//Change the name of field to alias
var resultAlias = function(alldata, alias, cb){
	alldata.forEach(function(eachData, idData, arrayData){
		alias.forEach(function(eachAlias){
			if(eachData.tablename == eachAlias.tablename){
				eachData.result.forEach(function(eachResult, idResult, arrayResult){
					for(var key in eachResult){
						if(eachAlias.alias){
							if(eachAlias.fieldname == key){
								eachResult[eachAlias.alias] = eachResult[key];
								delete eachResult[key];
							}
						}
					}
				})
			}
		})
		if(idData == arrayData.length - 1){
			cb()
		}	
	})
}

//VF-OS Storage with Relations defined
var _storageBuilder = function(f, data, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_storageBuilder:";
	log.debug(flowstr + " Input data: " + JSON.stringify(data));

	var q = "";
	var query = 'query_columns_specification=';
	var filter = 'filter=';
	var includeFilter=false;
	var to_execute = "";
	var allData = [];
	var relations = [];
	var alias = [];
	var questions = [];
	var answers = [];
	//get report template info
	db.conn.getByTplId(flowstr, tid, function(e,template){
		if(!e){
			log.debug(flowstr + "Executing template: " + JSON.stringify(template[0]));
			log.debug(flowstr + JSON.stringify(template[0]));
			//storage url definition
			var url = template[0].hostname.slice(8) + ':'+template[0].port+'/'+"vfos/rel/1.0.1"+'/databases/'+template[0].dbname+'/tables/';
			//iterate input data
			data.forEach(function(eachTable, idxtable, arraytable){
				q += eachTable.name + '/rows?';
				//request vfos storage for each table with selected fields
				eachTable.sFields.forEach(function(eachFields, idxFields, arrayFields){
					//Check Alias on eachField
					if(eachFields.aliases != null){
						//Means there is alias for that specific field
						alias.push({tablename : eachTable.name, fieldname: eachFields.name, alias: eachFields.aliases})
					}else{
						//Means put alias same as the name of the field
						alias.push({tablename : eachTable.name, fieldname: eachFields.name})
					}
					query += '"' + eachFields.name + '"';
					//check if we have more columns to select so we need to add the ',' expression
					if(idxFields != arrayFields.length - 1){
						query += ',';
					}
					//check if each field has filters to be applied on the query
					if(eachFields.filter.length > 0){
						includeFilter = true;
						eachFields.filter.forEach(function(eachFilter, idxFilter, arrayFilter){
							filter +=  eachFields.name + eachFilter.condition + "'" + eachFilter.value + "'";
							//check if we have more filter to add AND expression
							if(idxFilter != arrayFilter.length - 1){
								filter += "AND";
							}
						})
					}
				})
				//create relations object
				eachTable.relation.forEach(function(eachRelation){
					if(eachRelation.left){
						relations.push({leftname: eachTable.name, leftfield: eachRelation.leftfield, righttable: eachRelation.righttable, rightfield: eachRelation.rightfield})
					}
				})

				//concatenate the query to be executed;
				if(includeFilter){
					to_execute = url + q + query + '&' + filter;
					includeFilter = false;
				}else{
					to_execute = url + q + query;
				}

				log.debug(flowstr + ">>>>>>>>>>>>>> our query : " + to_execute);
				q = "";
				query = 'query_columns_specification=';
				filter = 'filter=';
				questions.push(eachTable.name);
				db.execution.queryStorage(flowstr, template[0].hostname.slice(8), template[0].port, template[0].username, template[0].password, to_execute, function(error,result,relatedTo){
					if(error){
						log.error(error);
					}else{
						log.debug(flowstr + " -------------- " + JSON.stringify(result));
						//sort the position where the answer should be placed:
						questions.forEach(function(eachQuestion, index, arrayQuestions){
							if(eachQuestion == relatedTo){
								allData.splice(index, 0, {result: result, tablename: eachTable.name})
								answers.splice(index, 0, relatedTo);
								//log.debug("ANSWER : " + JSON.stringify(answers));
							}
						})
						//check the end first loop
						if(idxtable == arraytable.length - 1){
							//Check and Replace all Elements to Alias Name
							setTimeout(function(){
								//proceed
								resultAlias(allData, alias, function(){
									for(var i = relations.length - 1; i >= 0; i--){
										//iterate data list
										for(var j = 0; j < allData.length; j++){
											//check the correct left table to work with
											if(relations[i].leftname ==  allData[j].tablename){
												//correct table found
												for(var k = 0; k < allData.length; k++){
													//check the correct right table to work with
													if(relations[i].righttable ==  allData[k].tablename){
														//right table found
														concatenateObjectsByKey(relations[i].leftname, relations[i].leftfield, relations[i].rightfield, allData[j].result, allData[k].result, function(result, tablename){
															//log.debug("concatenated result for tablename: " + tablename + " : " + JSON.stringify(result));
															allData.forEach(function(eachElem, idx, array){
																if(eachElem.tablename == tablename){
																	eachElem.result = result;
																	//log.debug("substituted tablename " + tablename);
																}
															})
														})
													}	
												}
											}
										}
									}
									setTimeout(function(){
										//loop has ended;
										//log.debug("WE HAVE ENDED WITH: " + JSON.stringify(allData));
										//create the html fields:
										resultData(allData, relations[0].leftname, function(dataResult, fields){
											updateHtml(f, tid, dataResult, fields, function(e,html){
												if(e){
													cb(e)
												}else{
													cb(false, html)
												}
											});
										})		
									}, 2000);	
								});
							},2000)
						}
					}
				})
			})
		}else{
			log.error(e);
		}
	})
}

//VF-OS Storage with no Relations defined
var _storageBuilderNoRelations = function(f, data, tid, cb){
	var flowstr = f + "-" + handler + "-" + "_storageBuilder:";
	log.debug(flowstr + " Input data: " + JSON.stringify(data));

	var q = "";
	var query = 'query_columns_specification=';
	var filter = 'filter=';
	var includeFilter=false;
	var to_execute = "";
	var allData = [];
	var alias = [];
	//get report template info
	db.conn.getByTplId(flowstr, tid, function(e,template){
		if(!e){
			log.debug(flowstr + "Executing template: " + JSON.stringify(template[0]));
			log.debug(flowstr + JSON.stringify(template[0]));
			//storage url definition
			var url = template[0].hostname.slice(8) + ':'+template[0].port+'/'+"vfos/rel/1.0.1"+'/databases/'+template[0].dbname+'/tables/';
			//iterate input data
			data.forEach(function(eachTable, idxtable, arraytable){
				q += eachTable.name + '/rows?';
				//request vfos storage for each table with selected fields
				eachTable.sFields.forEach(function(eachFields, idxFields, arrayFields){
					//Check Alias on eachField
					if(eachFields.aliases != null){
						//Means there is alias for that specific field
						alias.push({tablename : eachTable.name, fieldname: eachFields.name, alias: eachFields.aliases})
					}else{
						//Means put alias same as the name of the field
						alias.push({tablename : eachTable.name, fieldname: eachFields.name})
					}
					query += '"' + eachFields.name + '"';
					//check if we have more columns to select so we need to add the ',' expression
					if(idxFields != arrayFields.length - 1){
						query += ',';
					}
					//check if each field has filters to be applied on the query
					if(eachFields.filter.length > 0){
						includeFilter = true;
						eachFields.filter.forEach(function(eachFilter, idxFilter, arrayFilter){
							filter +=  eachFields.name + eachFilter.condition + "'" + eachFilter.value + "'";
							//check if we have more filter to add AND expression
							if(idxFilter != arrayFilter.length - 1){
								filter += "AND";
							}
						})
					}
				})
				//concatenate the query to be executed;
				if(includeFilter){
					to_execute = url + q + query + '&' + filter;
					includeFilter = false;
				}else{
					to_execute = url + q + query;
				}

				log.debug(flowstr + ">>>>>>>>>>>>>> our query : " + to_execute);
				q = "";
				query = 'query_columns_specification=';
				filter = 'filter=';
				db.execution.queryStorage(flowstr, template[0].hostname.slice(8), template[0].port, template[0].username, template[0].password, to_execute, function(error,result,relatedTo){
					if(error){
						log.error(error);
					}else{
						log.debug(flowstr + " -------------- " + JSON.stringify(result));
						//check the end first loop
						if(idxtable == arraytable.length - 1){
							allData.push({result: result, tablename: eachTable.name})
							//Check and Replace all Elements to Alias Name
							//proceed
							resultAlias(allData, alias, function(){
								//loop has ended;
								//log.debug("WE HAVE ENDED WITH: " + JSON.stringify(allData));
								//create the html fields:
								resultData(allData, eachTable.name, function(dataResult, fields){
									updateHtml(f, tid, dataResult, fields, function(e,html){
										if(e){
											cb(e)
										}else{
											cb(false, html)
										}
									});
								})			
							});
						}
					}
				})
			})
		}else{
			log.error(e);
		}
	})
}

//module exports
module.exports = {
	//For VF-OS Storage
	storage: function(req, res){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "storage:";
		if(req.params.tid){
			_getSelectedTables(f, req.params.tid, function(e,sTables){
				if(e){
					res.status(500).end();
				}else{
					if(sTables.length > 0){
						_getFiltersByTplId(f, req.params.tid, function(e, filters){
							if(e){
								res.status(500).end();
							}else{
								//it has filter
								_getRelationByTplId(f, req.params.tid, function(e, relations){
									if(e){
										res.status(500).end();
									}else{
										//check if template has relations
										if(relations.length > 0){
											//for each table selected in the template,
											sTables.forEach(function(eachTable, ideachtable, arrayeachtable){
												//retrieve their selected fields
												_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
													if(sFields.length > 0){
														//store in the input data those fields for each table
														eachTable.sFields = sFields;
														//merge on each field the filter information
														eachTable.sFields.forEach(function(eachField){
															eachField.filter = [];
															filters.forEach(function(eachFilter){
																if(eachField.idfields == eachFilter.idfields){
																	//include the filter info
																	eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																}
															})
														})
													}
												})
												//merge the relations on the tables
												eachTable.relation = [];
												relations.forEach(function(eachRelation, idx2, array2){
													if(eachTable.name == eachRelation.lefttable){
														eachTable.relation.push({left: true, leftfield: eachRelation.leftfield, righttable: eachRelation.righttable, rightfield: eachRelation.rightfield})
													}
													if(eachTable.name == eachRelation.righttable){
														eachTable.relation.push({right: true, rightfield: eachRelation.rightfield})
													}	
												})
												//check loop ending
												if(ideachtable == arrayeachtable.length - 1){
													//proceed with builder
													setTimeout(function(){
														_storageBuilder(f, sTables, req.params.tid, function(e,html){
															if(e){
																res.status(500).end();
															}else{
																if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																	res.writeHead(404, {'Content-type': ' application/json'});
																	res.write(JSON.stringify({error: html}));
																	res.end();
																}else{
																	fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																		if(e){
																			log.error(e);
																		}else{
																			log.debug(flowstr + " Html saved");
																			setTimeout(function(){
																				log.debug(flowstr + " Serving smart reporting");
																				res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																					if(e){
																						log.error(e)
																					}
																				});
																			},500)
																		}
																	});
																}
															}	
														})
													},2000)
												}
											})
										}else{
											//for each table selected in the template,
											sTables.forEach(function(eachTable, ideachtable, arrayeachtable){
												//retrieve their selected fields
												_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
													if(sFields.length > 0){
														//store in the input data those fields for each table
														eachTable.sFields = sFields;
														//merge on each field the filter information
														eachTable.sFields.forEach(function(eachField){
															eachField.filter = [];
															filters.forEach(function(eachFilter){
																if(eachField.idfields == eachFilter.idfields){
																	//include the filter info
																	eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																}
															})
														})
													}
												})
												//merge the relations on the tables
												eachTable.relation = [];
												relations.forEach(function(eachRelation, idx2, array2){
													if(eachTable.name == eachRelation.lefttable){
														eachTable.relation.push({left: true, leftfield: eachRelation.leftfield, righttable: eachRelation.righttable, rightfield: eachRelation.rightfield})
													}
													if(eachTable.name == eachRelation.righttable){
														eachTable.relation.push({right: true, rightfield: eachRelation.rightfield})
													}	
												})
												//check loop ending
												if(ideachtable == arrayeachtable.length - 1){
													//proceed with builder
													setTimeout(function(){
														_storageBuilderNoRelations(f, sTables, req.params.tid, function(e,html){
															if(e){
																res.status(500).end();
															}else{
																if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																	res.writeHead(404, {'Content-type': ' application/json'});
																	res.write(JSON.stringify({error: html}));
																	res.end();
																}else{
																	fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																		if(e){
																			log.error(e);
																		}else{
																			log.debug(flowstr + " Html saved");
																			setTimeout(function(){
																				log.debug(flowstr + " Serving smart reporting");
																				res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																					if(e){
																						log.error(e)
																					}
																				});
																			},500)
																		}
																	});
																}
															}	
														})
													},2000)
												}
											})
										}
									}
								})
							}
						})
					}
				}
			})
		}
	},

	//For MySQL Database
	get : function(req, res){
		var f = res.locals.flowid;
		var flowstr = f + "-" + handler + "-" + "get:";
		//SQL BUILDING PROCESS
		if(req.params.tid){
			//get selected tables
			_getSelectedTables(f, req.params.tid,function(e,sTables){
				if(e){
					log.error(flowstr + "500 - Internal Error" + e);
					res.writeHead(500);
				}else{
					if(sTables.length > 0 ){
						log.info(flowstr + "Tables found: " + JSON.stringify(sTables));

						//get the filters for this template id
						_getFiltersByTplId(f, req.params.tid, function(e,filters){
							if(e){
								log.error(flowstr + "500 - Internal Error" + e);
							}else{
								if(filters.length >= 1 ){
									//there is filters
									//get the relations between tables
									_getRelationByTplId(f, req.params.tid, function(e,relations){
										if(e){
											log.error(flowstr + "500 - Internal Error" + e);
											res.writeHead(500);
										}else{
											if(relations.length > 0 ){
												log.info(flowstr + "Relations found: " + JSON.stringify(relations));
												//get selected field for each table
												sTables.forEach(function(eachTable, idx1, array1){
													_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
														if(sFields.length > 0){
															//log.info(flowstr + "Fields found: " + JSON.stringify(sFields));
															eachTable.sFields = sFields;
															//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));

															//merge on each field the filter information
															eachTable.sFields.forEach(function(eachField){
																eachField.filter = [];
																filters.forEach(function(eachFilter){
																	if(eachField.idfields == eachFilter.idfields){
																		//include the filter info
																		eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																	}
																})
															})
														}
													})
													//merge the relations on the tables
													eachTable.relation = [];
													relations.forEach(function(eachRelation, idx2, array2){
														if(eachTable.name == eachRelation.lefttable){
															eachTable.relation.push({left: true, leftfield: eachRelation.leftfield, righttable: eachRelation.righttable, rightfield: eachRelation.rightfield})
														}
														if(eachTable.name == eachRelation.righttable){
															eachTable.relation.push({right: true, rightfield: eachRelation.rightfield})
														}
														
													})
												})
												//MYSQL QUERY BUILDER
												setTimeout(function(){
														//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));
														_queryBuilder(f, sTables, req.params.tid, function(e,html){
															if(e){
																log.error(flowstr + "500 - Internal Error" + e);
																res.writeHead(500);
																res.end();
															}else{
																if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																	res.writeHead(404, {'Content-type': ' application/json'});
																	res.write(JSON.stringify({error: html}));
																	res.end();
																}else{
																	fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																		if(e){
																			log.error(e);
																		}else{
																			log.debug(flowstr + " Html saved");
																			setTimeout(function(){
																				log.debug(flowstr + " Serving smart reporting");
																				res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																					if(e){
																						log.error(e)
																					}
																				});
																			},500)	
																		}
																	});
																}
															}
														})
													},2000)
											}else{
												//THERE IS NO RELATIONS BETWEEN TABLES
												//get selected field for each table
												sTables.forEach(function(eachTable, idx1, array1){
													_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
														if(sFields.length > 0){
															//log.info(flowstr + "Fields found: " + JSON.stringify(sFields));
															eachTable.sFields = sFields;
															//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));

															//merge on each field the filter information
															eachTable.sFields.forEach(function(eachField){
																eachField.filter = [];
																filters.forEach(function(eachFilter){
																	if(eachField.idfields == eachFilter.idfields){
																		//include the filter info
																		eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																	}
																})
															})
														}
													})
												})
												//QUERY BUILDER
												setTimeout(function(){
													//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));
													_queryBuilder(f, sTables, req.params.tid, function(e,html){
														if(e){
															log.error(flowstr + "500 - Internal Error" + e);
															res.writeHead(500);
															res.end();
														}else{
															if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																res.writeHead(404, {'Content-type': ' application/json'});
																res.write(JSON.stringify({error: html}));
																res.end();
															}else{
																fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																	if(e){
																		log.error(e);
																	}else{
																		log.debug(flowstr + " Html saved");
																		setTimeout(function(){
																			log.debug(flowstr + " Serving smart reporting");
																			res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																				if(e){
																					log.error(e)
																				}
																			});
																		},500)	
																	}
																});
															}
														}
													})
												},2000)
											}
										}
									})
								//there is no filters
								}else{
									//get the relations between tables
									_getRelationByTplId(f, req.params.tid, function(e,relations){
										if(e){
											log.error(flowstr + "500 - Internal Error" + e);
											res.writeHead(500);
										}else{
											if(relations.length > 0 ){
												log.info(flowstr + "Relations found: " + JSON.stringify(relations));
												//get selected field for each table
												sTables.forEach(function(eachTable, idx1, array1){
													_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
														if(sFields.length > 0){
															//log.info(flowstr + "Fields found: " + JSON.stringify(sFields));
															eachTable.sFields = sFields;
															//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));

															//merge on each field the filter information
															eachTable.sFields.forEach(function(eachField){
																eachField.filter = [];
																filters.forEach(function(eachFilter){
																	if(eachField.idfields == eachFilter.idfields){
																		//include the filter info
																		eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																	}
																})
															})
														}
													})
													//merge the relations on the tables
													eachTable.relation = [];
													relations.forEach(function(eachRelation, idx2, array2){
														if(eachTable.name == eachRelation.lefttable){
															eachTable.relation.push({left: true, leftfield: eachRelation.leftfield, righttable: eachRelation.righttable, rightfield: eachRelation.rightfield})
														}
														if(eachTable.name == eachRelation.righttable){
															eachTable.relation.push({right: true, rightfield: eachRelation.rightfield})
														}
														
													})
												})
												//MYSQL QUERY BUILDER
												setTimeout(function(){
														//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));
														_queryBuilder(f, sTables, req.params.tid, function(e,html){
															if(e){
																log.error(flowstr + "500 - Internal Error" + e);
																res.writeHead(500);
																res.end();
															}else{
																if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																	res.writeHead(404, {'Content-type': ' application/json'});
																	res.write(JSON.stringify({error: html}));
																	res.end();
																}else{
																	fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																		if(e){
																			log.error(e);
																		}else{
																			log.debug(flowstr + " Html saved");
																			setTimeout(function(){
																				log.debug(flowstr + " Serving smart reporting");
																				res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																					if(e){
																						log.error(e)
																					}
																				});
																			},500)
																		}
																	});
																}
															}
														})
													},2000)
											}else{
												//THERE IS NO RELATIONS BETWEEN TABLES

												//get selected field for each table
												sTables.forEach(function(eachTable, idx1, array1){
													_getSelectedFieldsByTableId(f, eachTable.idtables, function(e,sFields){
														if(sFields.length > 0){
															//log.info(flowstr + "Fields found: " + JSON.stringify(sFields));
															eachTable.sFields = sFields;
															//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));

															//merge on each field the filter information
															eachTable.sFields.forEach(function(eachField){
																eachField.filter = [];
																filters.forEach(function(eachFilter){
																	if(eachField.idfields == eachFilter.idfields){
																		//include the filter info
																		eachField.filter.push({condition: eachFilter.cond, value: eachFilter.value});
																	}
																})
															})
														}
													})
												})
												//QUERY BUILDER
												setTimeout(function(){
													//log.info(flowstr + "So far we have found this: " + JSON.stringify(sTables));
													_queryBuilder(f, sTables, req.params.tid, function(e,html){
														if(e){
															log.error(flowstr + "500 - Internal Error" + e);
															res.writeHead(500);
															res.end();
														}else{
															if(html == "There is no Style, please go to Style Tab and create Footer and/or Header"){
																res.writeHead(404, {'Content-type': ' application/json'});
																res.write(JSON.stringify({error: html}));
																res.end();
															}else{
																fs.writeFile(path.join(__dirname,'../../fe/sre-app/dist/sre-app/outgoing.html'), html, function(e){
																	if(e){
																		log.error(e);
																	}else{
																		log.debug(flowstr + " Html saved");
																		setTimeout(function(){
																			log.debug(flowstr + " Serving smart reporting");
																			res.sendFile('outgoing.html',{root: path.join(__dirname, "../../fe/sre-app/dist/sre-app")}, function(e){
																				if(e){
																					log.error(e)
																				}
																			});
																		},500)	
																	}
																});
															}
														}
													})
												},2000)
											}
										}
									})
								}
							}
						})
					}else{
						log.info(flowstr + "404 - Resource not found");
						res.writeHead(404);
					}
				}	
			})
		}
	}
}