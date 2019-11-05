import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-connections-mysql',
  templateUrl: './connections-mysql.component.html',
  styleUrls: ['./connections-mysql.component.css']
})
export class ConnectionsMysqlComponent implements OnInit {

	connformmysql: any = {};

  constructor(  	
  	private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService
    ) { }

  ngOnInit() {
  	//request the connections for this template
    this.connectionsService.getByTplId(Number(this.route.parent.snapshot.paramMap.get("tid"))).subscribe(data => {
      if(!data.hostname.includes("storage:")){
        this.connformmysql = data;
      }
    })
  }

  testconn_mysql(){
  	this.connectionsService.test(this.connformmysql).subscribe(data => {
  		console.log(data);
  		this.notifyService.success("DB is reachable");
  	}, e => {
  		this.notifyService.error("DB is not reachable", JSON.stringify(e.error.sqlMessage));
  	})
  }
  saveconn_mysql(){
  	this.connectionsService.save(this.connformmysql, this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
  		console.log(data);
  		this.notifyService.success("Saved");

  	}, e => {
  		console.log(e);
  		this.notifyService.error("Not saved");
  	});
  }

}
