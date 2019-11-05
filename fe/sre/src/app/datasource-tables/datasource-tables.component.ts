import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datasource-tables',
  templateUrl: './datasource-tables.component.html',
  styleUrls: ['./datasource-tables.component.css']
})
export class DatasourceTablesComponent implements OnInit {

	tables: any = [];
	selTables: any = [];
	toSave: any = [];

  constructor(
  	private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService
    ) { }

  ngOnInit() {
  	//get all the available tables
  	this.connectionsService.getAvailableTables(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
  		this.tables = data;
  		//check if we have some tables already selected
  		this.connectionsService.getSelectedTables(this.route.parent.snapshot.paramMap.get("tid")).subscribe(selectedTables => {
  			this.selTables = selectedTables;
  			for (var i = this.tables.length - 1; i >= 0; i--) {
          for (var j = this.selTables.length - 1; j >= 0; j--){
            if(this.tables[i].table_name == this.selTables[j].name){
              this.tables[i].selected = true;
            }
          }
        }
      }, e => {
        //set every table name to false
        for (var i = this.tables.length - 1; i >= 0; i--) {
          this.tables[i].selected = false;
        }
      })
  	}, err => {
      if(err.status == 404){
        this.notifyService.error("Connection service error", err.error.error);
      }else{
        this.notifyService.error("Connection service error", JSON.stringify(err));
      }
    })
  }

  saveTables(){
  	
  	//prepare data to be sent to storage
  	for (var i = this.tables.length - 1; i >= 0; i--) {
  		if(this.tables[i].selected){
  			this.toSave.push([this.tables[i].table_name, this.route.parent.snapshot.paramMap.get("tid")])	
  		}
  	}

  	//delete table selection previously created
  	this.connectionsService.deleteTables(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data =>{
  		
      if(this.toSave.length != 0 ){
        //save the selection
        this.connectionsService.saveTables(this.toSave).subscribe(data2 => {
          this.notifyService.success("Table selection saved");
        }, err => {
          this.notifyService.error("Error", JSON.stringify(err));
        })
      }else{
        this.notifyService.warning("There are no tables selected");
      }

    },e => {
      //this.notifyService.error("Table selection not saved", JSON.stringify(e));
      //probably is a 404
      console.log(e);
      if(this.toSave.length != 0 ){
        //save the selection
        this.connectionsService.saveTables(this.toSave).subscribe(data2 => {
          this.notifyService.success("Table selection saved");
        }, err => {
          this.notifyService.error("Table selection not saved", JSON.stringify(err));
        })
      }else{
        this.notifyService.success("There are no tables selected");
      }

    })
  	
  }

  selectTable(name: string){
  	for (var i = this.tables.length - 1; i >= 0; i--) {
  		if(this.tables[i].table_name == name){
  			this.tables[i].selected = true
  		}
  	}
  }

  unselectTable(name: string){
  	for (var i = this.tables.length - 1; i >= 0; i--) {
  		if(this.tables[i].table_name == name){
  			this.tables[i].selected = false
  		}
  	}
  }

}
