import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionsService } from '../connections.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datasource-filters',
  templateUrl: './datasource-filters.component.html',
  styleUrls: ['./datasource-filters.component.css']
})
export class DatasourceFiltersComponent implements OnInit {

	filters: any = [];
  options: any = []; 
  filterValue ="";

  constructor(
    private route: ActivatedRoute, 
  	private router: Router,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService
  ) { }

  ngOnInit() {
  	this.connectionsService.getFilters(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
  		console.log(data)
  		this.filters = data;
  	})

    this.connectionsService.getSeletecFieldsByTemplateId(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
      this.options = data;
    })
  }

  deleteFilter(filterid: string){
  	console.log("Want to delete this filter id " + filterid);
    this.connectionsService.deleteFilter(filterid).subscribe(data => {
      this.filters.forEach( (eachFilter, index)=>{
        if(eachFilter.idfilters == filterid){
          this.filters.splice(index,1);
        }
      })
      this.notifyService.success("Filter deleted");
    }, e=> {
    this.notifyService.error("Filter not deleted");
    })
  }

  addFilter(option: string, conditionpicked: string){
    let choice = option.split("|",5);

    if(conditionpicked == "Choose..."){
      this.notifyService.warning("Please select a valid condition option...");
    }else{
      this.connectionsService.saveFilter([[conditionpicked, this.filterValue, choice[2]]]).subscribe(data => {
          
          this.notifyService.success("Filter saved");
          this.filters.push({fieldname: choice[3], aliases: choice[4], cond: conditionpicked, fields_idfields: choice[2], idfilters: data, idtables: choice[0], tablename: choice[1], table_idtalbes: choice[0], value: this.filterValue});
          //clear
          this.filterValue = "";

        }, e => {
          this.notifyService.error("Filter not saved");
        })  
      }
    }

    

}
