import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-connections-storage',
  templateUrl: './connections-storage.component.html',
  styleUrls: ['./connections-storage.component.css']
})
export class ConnectionsStorageComponent implements OnInit {

	connform: any = {};

  constructor(  	
  	private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService
    ) { }

  ngOnInit() {
    //request the connections for this template
    this.connectionsService.getByTplId(Number(this.route.parent.snapshot.paramMap.get("tid"))).subscribe(data => {
      if(data.hostname.includes("storage:")){
        data.hostname = data.hostname.slice(8);
        this.connform = data;
      }
    })
  }

  testconn(){
    let testcon = Object.assign({},this.connform);
    testcon.hostname = "storage:" + this.connform.hostname;
    this.connectionsService.test(testcon).subscribe(data => {
      this.notifyService.success("DB is reachable");
    }, e => {
      this.notifyService.error("DB is not reachable", JSON.stringify(e.error.sqlMessage));
    })
  }
  saveconn(){
    let savecon = this.connform;
    savecon.hostname = "storage:" + this.connform.hostname;
    this.connectionsService.save(savecon, this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
      console.log(data);
      this.notifyService.success("Saved");

    }, e => {
      console.log(e);
      this.notifyService.error("Not saved");
    });
  }

}
