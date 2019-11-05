import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionsService } from '../connections.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datasource-fields',
  templateUrl: './datasource-fields.component.html',
  styleUrls: ['./datasource-fields.component.css']
})
export class DatasourceFieldsComponent implements OnInit {

	tables: any = [];
  fields: any = [];

	
  constructor(
  	private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService
  	) { }

  mergeSelected(){
    //console.log("starting merge...");
    for(var i=0; i<this.tables.length;i++){
      //console.log("table id " + i);
      //check if fields exist
      if(this.tables[i].fields && this.tables[i].selectedFields){
        //console.log("fields size" + this.tables[i].fields.length);
        //console.log("selectedFields size" + this.tables[i].selectedFields.length);
        //iterate fields
        for(var j=0; j<this.tables[i].fields.length;j++){
          //check if selected fields exists
          //iterate selected fields
          for(var z=0; z<this.tables[i].selectedFields.length;z++){
            //console.log("comparing " + this.tables[i].fields[j].Field + " with " + this.tables[i].selectedFields[z].name);
            if(this.tables[i].fields[j].Field == this.tables[i].selectedFields[z].name){
              //console.log("found match");
              this.tables[i].fields[j].selected = true;
              this.tables[i].fields[j].aliases = this.tables[i].selectedFields[z].aliases;
            }
          }
        }
      }
      if(i == this.tables.length -1){
        console.log("tables");
        console.log(this.tables);
      }
    }

  }

  ngOnInit() {
  	this.connectionsService.getAvailableFields(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
      this.tables = data;

      for (var i = 0; i < this.tables.length; i++){
        this.connectionsService.getSelectedFields(this.tables[i].idtables).subscribe(selectedFields => {
          var selFields : any = [];
          selFields = selectedFields;
          //find the table to store the selectedFields result
          for (var j = 0; j< selFields.length; j++){
            for (var x = 0; x < this.tables.length; x++){
              if(selFields[j].tables_idtables == this.tables[x].idtables){
                this.tables[x].selectedFields = selFields;
                x = this.tables.length;
                j = selFields.length;
                this.mergeSelected();
              }
              
            }
          }
         },err => {
           this.notifyService.error("Connection service error", err.error.error);
         })      
      }
    }, err => {
      if(err.status == 404){
        this.notifyService.error("Connection service error", err.error.error);
      }else{
        this.notifyService.error("Connection service error", JSON.stringify(err));
      }
    })
  }
  selectField(tablename: string, fieldname: string){
    console.log(tablename);
    console.log(fieldname);
    for(var t = this.tables.length -1; t >= 0; t--){
      for(var f=this.tables[t].fields.length -1; f >= 0; f--){
        if(tablename == this.tables[t].name && fieldname == this.tables[t].fields[f].Field){
          this.tables[t].fields[f].selected = true
        }
      }
    }
  }
  unselectField(tablename: string, fieldname: string){
    for(var t = this.tables.length -1; t>=0; t--){
      for(var f=this.tables[t].fields.length -1; f >=0; f--){
        if(tablename == this.tables[t].name && fieldname == this.tables[t].fields[f].Field){
          this.tables[t].fields[f].selected = false
        }
      }
    }
  }
  //TODO check when the use-case is NON SELECTED
  saveFields() {
    this.fields = [];
    let count = 0;
    for(var t=this.tables.length -1; t>=0; t--){
      for(var f=this.tables[t].fields.length -1; f >=0; f--){
        if(this.tables[t].fields[f].selected){
          count++;
          this.fields.push([this.tables[t].fields[f].Field, this.tables[t].fields[f].aliases, this.tables[t].idtables])
          this.connectionsService.deleteFields(this.tables[t].idtables).subscribe(r =>{
            console.log(r);
            count--;
          })
        }
        
      }
    }
    setTimeout(() => {
        console.log(this.fields);
        if(this.fields.length == 0){
          this.notifyService.warning("No fields selected");
        }else{
          this.connectionsService.saveFields(this.fields).subscribe(r => {
            this.notifyService.success("Fields selected saved");
          },e =>{
            this.notifyService.error("Fields selected not saved");
          })
        };
      }, 2000);
    
    

  }

}
