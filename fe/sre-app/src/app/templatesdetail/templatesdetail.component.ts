import { Component, OnInit, TemplateRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

//our services
import { TemplatesService } from '../templates.service';
import { HeadersService } from '../headers.service';
import { ConnectionsService } from '../connections.service';

import { ToastrService } from 'ngx-toastr';

//html editor
import { AngularEditorConfig } from '@kolkov/angular-editor';

import * as ab2str from 'arraybuffer-to-string';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Component({
  selector: 'app-templatesdetail',
  templateUrl: './templatesdetail.component.html',
  styleUrls: ['./templatesdetail.component.css']
})
export class TemplatesdetailComponent implements OnInit {

	//store variable
  template: any = {};
  conn: any = [];
  header: any = {};
  found: boolean = false;
  connform: any = {};
  modalRef: BsModalRef;


  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }
  
  constructor(
  	private templatesService: TemplatesService,
  	private route: ActivatedRoute, 
  	private router: Router,
  	private headersService: HeadersService,
  	private connectionsService: ConnectionsService,
  	private notifyService: ToastrService,
  	private modalService: BsModalService
  ) { }

  

  
  ngOnInit() {
  	//request the template service for the templates of this user
  	this.templatesService.getTplById(this.route.snapshot.params.owner, this.route.snapshot.params.tid).subscribe(
  		data => {
  			this.template = data;
	  	}, e => {
	  		console.log(e);
	  	}
	)
	//request the connections for this template
	this.connectionsService.getByTplId(this.route.snapshot.params.tid).subscribe(data => {
		this.connform = data;
	})
	//request the header for this template
	this.headersService.getHeaderByTplId(this.route.snapshot.params.tid).subscribe(data => {
		console.log("received data: " + data);
    this.header = data;
		//convert arraybuffer to string 
		//this.header.html = ab2str(new Uint8Array(this.header.html.data));
		
    this.found = true;
	}, e => {
		console.log(e);
		this.found = false;
	})
	//request the body for this template

	//request the footer for this template

  }
  editonh(){
  	this.config.editable = true;
  }
  editoffh(){
  	this.config.editable = false;
  }

  saveh(){
  	this.headersService.update(this.header.idheaders, this.header.html).subscribe(data => {
  		console.log(data);
  		this.notifyService.success("Header", "Header has been updated successfully");
  		this.editoffh();
  	}, e => {
  		this.notifyService.error("Header", "Header not updated" + e);
  		console.log(e);
  	});
  }

  //open manage connection modal
  manageconn(template: TemplateRef<any>) {
  	this.modalRef = this.modalService.show(template);
  }
  testconn(){
  	this.connectionsService.test(this.connform).subscribe(data => {
  		console.log(data);
  		this.notifyService.success("We can reach your DB");
  	}, e => {
  		console.log(e);
  		this.notifyService.error("We can't reach your DB");
  	})
  }
  saveconn(){
  	this.connectionsService.save(this.connform, this.route.snapshot.params.tid).subscribe(data => {
  		//close modal
  		this.modalRef.hide();
  		this.modalRef = null;
  		console.log(data);
  		this.notifyService.success("Saved");

  	}, e => {
  		console.log(e);
  		this.notifyService.error("Not saved");
  	});
  }
}
