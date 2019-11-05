import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {
	api:string='/api/vfosenabler/v1/conn';

  constructor(private http: HttpClient) { }

  getByTplId(tid: number): Observable <any>{
  	return this.http.get(environment.api + this.api + "/" + tid);
  }
  test(conn: JSON){
  	return this.http.post(environment.api + this.api + "/" + 'test', conn);
  }
  save(conn: any, tid: string){
  	if(conn.idconnections){
  		//update request
  		return this.http.patch(environment.api + this.api + "/" + conn.idconnections, [
  			{op: 'replace', obj: 'hostname', v: conn.hostname},
  			{op: 'replace', obj: 'port', v: conn.port},
  			{op: 'replace', obj: 'username', v: conn.username},
  			{op: 'replace', obj: 'password', v: conn.password},
  			{op: 'replace', obj: 'tablename', v: conn.tablename},
  			{op: 'replace', obj: 'dbname', v: conn.dbname}])
  	}else{
  		conn.tpl_id = tid;
  		//post request
  		return this.http.post(environment.api + this.api, conn)
  	}
  }
  getAvailableTables(tid: string){
    return this.http.get(environment.api + this.api + "/" + tid + "/tables");
  }
  getSelectedTables(tid: string){
    return this.http.get(environment.api + "/api/vfosenabler/v1/tables/" + tid);
  }
  saveTables(payload: any){
    return this.http.post(environment.api + "/api/vfosenabler/v1/tables", payload);
  }
  deleteTables(tid: string){
    return this.http.delete(environment.api + "/api/vfosenabler/v1/tables/"+tid);
  }
  getAvailableFields(tid: string){
    return this.http.get(environment.api + this.api + "/" + tid + "/fields");
  }
  getSelectedFields(tableid: any){
    return this.http.get(environment.api + "/api/vfosenabler/v1/fields/" + tableid);
  }
  saveFields(payload: any){
    return this.http.post(environment.api + "/api/vfosenabler/v1/fields", payload);
  }
  deleteFields(tableid: any){
    return this.http.delete(environment.api + "/api/vfosenabler/v1/fields/" + tableid);
  }
  getFilters(templateid: any){
    return this.http.get(environment.api + "/api/vfosenabler/v1/filters/" + templateid);
  }
  getSeletecFieldsByTemplateId(tid: string){
    return this.http.get(environment.api + "/api/vfosenabler/v1/fields/" + tid + "/bytemplate");
  }
  saveFilter(payload: any){
    return this.http.post(environment.api +"/api/vfosenabler/v1/filters", payload);
  }
  deleteFilter(id: string){
    return this.http.delete(environment.api +"/api/vfosenabler/v1/filters/" + id);
  }
  getRelations(tid: string){
    return this.http.get(environment.api +"/api/vfosenabler/v1/relations/" + tid);
  }
  saveRelations(payload: any){
    return this.http.post(environment.api +"/api/vfosenabler/v1/relations", payload);
  }
  deleteRelations(id: string){
    return this.http.delete(environment.api +"/api/vfosenabler/v1/relations/" + id);
  }
}

