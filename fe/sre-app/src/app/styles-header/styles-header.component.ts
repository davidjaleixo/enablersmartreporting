import { Component, OnInit } from '@angular/core';
//html editor
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadersService } from '../headers.service';

import * as ab2str from 'arraybuffer-to-string';

@Component({
  selector: 'app-styles-header',
  templateUrl: './styles-header.component.html',
  styleUrls: ['./styles-header.component.css']
})
export class StylesHeaderComponent implements OnInit {

  header: any = {};
  found: boolean = false;
  creatingnew: boolean = false;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter header here...',
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
  	private headersService: HeadersService,
  	private notifyService: ToastrService
  	) { }

  ngOnInit() {
  	//request the header for this template
	this.headersService.getHeaderByTplId(this.route.parent.snapshot.paramMap.get("tid")).subscribe(data => {
		this.header = data;
		this.found = true;
	}, e => {
		this.found = false;
	})
  }
  editonh(){
  	this.config.editable = true;
  }
  editoffh(){
  	this.config.editable = false;
  }

  saveh(update, create){
  	if(this.header.idheaders){
  		//update it
  		this.headersService.update(this.header.idheaders, this.header.html).subscribe(data => {
	  		console.log(data);
	  		this.notifyService.success("Header", "Header has been updated successfully");
	  		this.editoffh();
	  	}, e => {
	  		this.notifyService.error("Header", "Header not updated" + e);
	  		console.log(e);
	  	});
  	}else{
  		//create it
	  	this.headersService.create(this.route.parent.snapshot.paramMap.get("tid"), this.header.html).subscribe(data => {
	  		console.log(data);
	  		this.notifyService.success("Header created")
	  	},e =>{
	  		this.notifyService.error("Error " + e);
	  	})
  	}	
  }
  create(){
  	this.found = true;
  }

}
