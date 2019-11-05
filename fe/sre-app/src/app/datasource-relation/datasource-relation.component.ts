import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionsService } from '../connections.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datasource-relation',
  templateUrl: './datasource-relation.component.html',
  styleUrls: ['./datasource-relation.component.css']
})
export class DatasourceRelationComponent implements OnInit {


	availableTables : any = [];
	availableFields : any = [];
	selectedTables : any = [];
	selectedFields : any = [];
	rightTables : any = [];

	leftFields : any = [];
	rightFields : any = [];

  relations: any = [];

  constructor(
  	private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService) { }

  ngOnInit() {

      this.connectionsService.getRelations(this.route.parent.snapshot.paramMap.get("tid")).subscribe( data => {
        this.relations = data;
      })

	    this.connectionsService.getSelectedTables(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
	    	this.selectedTables = data;
	    	for (var i = 0; i < this.selectedTables.length; i++) {
	    		this.connectionsService.getSelectedFields(this.selectedTables[i].idtables).subscribe(fields => {
	    			this.selectedFields.push(fields);
			    })
	    	}
	    })
  }

  onLeftSelect(selected: any){
  	//clear
  	this.leftFields = [];
  	for (var fields of this.selectedFields){
  		for (var field of fields){
  			if(field.tables_idtables == parseInt(selected)){
	  			this.leftFields.push(field);
	  		}
  		}
  	}
  	//clear
  	this.rightTables = [];
  	//reduce that table option for right pick
  	for (var tables of this.selectedTables){
  		if (tables.idtables != parseInt(selected)){
  			this.rightTables.push(tables);
  		}
  	}
  }

  onRightSelect(selected: any){
	//clear
  	this.rightFields = [];
  	for (var fields of this.selectedFields){
  		for (var field of fields){
  			if(field.tables_idtables == parseInt(selected)){
	  			this.rightFields.push(field);
	  		}
  		}	
  	}
  }

  addRelation(lefttable:string, leftfield:string, righttable:string, rightfield: string){
    let ltable:string = "";
    let lfield:string = "";
    let rtable:string = "";
    let rfield:string = "";

    //tables' names
    for (var t of this.selectedTables){
      if(t.idtables == lefttable){
        ltable = t.name
      }
      if(t.idtables == righttable){
        rtable = t.name
      }
    }
   //fields' names
   console.log(this.selectedFields);
    for (var f of this.selectedFields){
      for (var f2 of f){
        if(f2.idfields == leftfield){
          lfield = f2.name
        }
        if(f2.idfields == rightfield){
          rfield = f2.name
        }
      }
      
    }
    this.connectionsService.saveRelations([[ltable, lfield, rtable, rfield, this.route.parent.snapshot.paramMap.get("tid")]]).subscribe(data => {
      this.notifyService.success("Relation saved");
      this.relations.push({idrelations: data, lefttable: ltable, leftfield: lfield, righttable: rtable, rightfield: rfield, templates_idtemplates: this.route.parent.snapshot.paramMap.get("tid")});


    }, e => {
      this.notifyService.error("Relation not saved");
    })
  }
  deleteRelation(id: string){
    console.log("Want to delete this relation id " + id);
    this.connectionsService.deleteRelations(id).subscribe(data => {
      this.relations.forEach( (eachRel, index) => {
        if(eachRel.idrelations == id){
          this.relations.splice(index,1);
        }
      })
      this.notifyService.success("Relation deleted");
    },e => {
      this.notifyService.error("Relation not deleted");
    })
  }
}
