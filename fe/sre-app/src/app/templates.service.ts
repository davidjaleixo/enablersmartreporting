import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

	api:string = '/api/vfosenabler/v1/templates/'

  constructor(private http: HttpClient) { }

  getTplByOwner(owner: string){
  	return this.http.get(environment.api + this.api + owner);
  }
  createTpl(owner: string, name: string): Observable <any>{
  	return this.http.post(environment.api + this.api, {user: owner, tpl_name: name});
  }
  getTplById(owner: string, tid: number){
  	return this.http.get(environment.api + this.api + owner + '?tid='+tid);
  }
  getOwners(){
    return this.http.get(environment.api + '/api/vfosenabler/v1/owners');
  }
  deleteTpl(tpl_id: number){
    return this.http.delete(environment.api + this.api + tpl_id);
  }

}
