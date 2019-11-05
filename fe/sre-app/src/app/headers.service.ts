import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HeadersService {

	api:string='/api/vfosenabler/v1/headers/';
	test:ArrayBuffer;

  constructor(private http: HttpClient) { 
  	}

	getHeaderByTplId(tid: string){
  		
  		return this.http.get( environment.api + this.api + tid);
  	}

  	create(tid: string, html: string){
  		return this.http.post(environment.api + this.api + tid, html);
  	}
  	update(hid: string, html: string){
  		return this.http.patch( environment.api +this.api + hid, html);
  	}

}