import { Component, OnInit } from '@angular/core';
//html editor
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FootersService } from '../footers.service';

@Component({
  selector: 'app-styles-footer',
  templateUrl: './styles-footer.component.html',
  styleUrls: ['./styles-footer.component.css']
})
export class StylesFooterComponent implements OnInit {
  footer: any = {};
  found: boolean = false;
  creatingnew: boolean = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter footer here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      }
    ]
  }
  constructor(
  	private route: ActivatedRoute, 
  	private router: Router,
  	private footersService: FootersService,
  	private notifyService: ToastrService
  	) { }

  ngOnInit() {
  	//request the header for this template
  	this.footersService.getFooterByTplId(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
  		this.footer = data;
  		this.found = true;
  	}, e => {
  		this.found = false;
  	})
  }
  editonf(){
  	this.config.editable = true;
  }
  editofff(){
  	this.config.editable = false;
  }

  savef(update, create){
  	if(this.footer.idfooters){
  		//update it
  		this.footersService.update(this.footer.idfooters, this.footer.html).subscribe(data => {
	  		console.log(data);
	  		this.notifyService.success("Footer", "Footer has been updated successfully");
	  		this.editofff();
	  	}, e => {
	  		this.notifyService.error("Footer", "Footer not updated" + e);
	  		console.log(e);
	  	});
  	}else{
  		//create it
	  	this.footersService.create(this.route.parent.snapshot.paramMap.get("tid"), this.footer.html).subscribe(data => {
	  		console.log(data);
	  		this.notifyService.success("Footer created")
	  	},e =>{
	  		this.notifyService.error("Error " + e);
	  	})
  	}	
  }
  create(){
  	this.found = true;
  }

}
