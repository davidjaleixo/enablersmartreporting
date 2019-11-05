import { Component, OnInit, TemplateRef } from '@angular/core';
import { TemplatesService } from '../templates.service';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';

import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

import { SessionStorageService } from 'ngx-webstorage';



@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

	//store variable
	templates: any = [];
	data: any = {};
	
	//form attributes
	public tplName="";

	modalRef: BsModalRef;

	//injecting the services on this component constructor
  constructor(
  	private templatesService: TemplatesService, 
  	private route: ActivatedRoute, 
  	private router: Router, 
  	private modalService: BsModalService, 
  	private notifyService: ToastrService,
    private sessionSt: SessionStorageService
  ) { }

  ngOnInit() {

  	//request the template service for the templates of this user
  	this.templatesService.getTplByOwner(this.route.snapshot.params.owner).subscribe(
  		data => {
  			this.templates = data;
	  	}, e => {
	  		console.log(e);
	  	}
	)
  }

  //open new template modal
  opencreatetpl(template: TemplateRef<any>) {
  	this.modalRef = this.modalService.show(template);
  }
  //submit new template modal
  createtpl(name: string) {
  	this.modalRef.hide();
  	this.modalRef = null;
  	this.templatesService.createTpl(this.route.snapshot.params.owner, this.tplName).subscribe(
  		data => {
  			this.data = data
  			this.templates.push({idtemplates: this.data.id, name: this.tplName});
  			this.tplName = "";
  			this.notifyService.success("Template", "Template has been created successfully");
  		}, e => {
  			console.log(e);
  			this.tplName = "";
  			this.notifyService.error("Template","Template not created" + JSON.stringify(e));
  		});
  }

  //navigate to template details
  tpldetails(id: string) {

    //handles the navigation side menu
    console.log("checking: "+this.sessionSt.retrieve("tplid"));
    this.sessionSt.store("tplid", id);
    console.log("trying to store id ");
    console.log("check: " + this.sessionSt.retrieve("tplid"));

  	this.router.navigate([this.route.snapshot.params.owner, 'templates', id]);
  }

}
