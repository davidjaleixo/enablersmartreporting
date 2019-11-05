import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../templates.service';
import { SessionStorageService } from 'ngx-webstorage';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';

//import Appcomponent
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	owners: any = [];
  owner: string;

  data: any = {};

  //form attributes
  public tplName="";

  modalRef: BsModalRef;

  constructor(
  	private templatesService: TemplatesService, 
  	private route: ActivatedRoute, 
  	private router: Router,
    private sessionSt: SessionStorageService,
    private modalService: BsModalService,
    private notifyService: ToastrService,
    private sidebar: AppComponent
    ) { }

  ngOnInit() {
  	this.templatesService.getOwners().subscribe(
  		data => {
  			this.owners = data;
      }, e => {
        console.log(e);
      })

    this.owner = this.route.snapshot.params.owner;
  }

  setOwner(owner: string){
    this.sessionSt.store("owner", owner)
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
        console.log("created template: " + JSON.stringify(data));

        //this.templates.push({idtemplates: this.data.id, name: this.tplName});
        
        this.notifyService.success("Template", "Template has been created successfully");
        
        //update list of created tpls
        this.sidebar.addTpl(data.id, this.tplName, this.route.snapshot.params.owner);
        //reset form variable
        this.tplName = "";
        /*setTimeout(() => {
          window.location.reload();
        }, 2000);
        */
      }, e => {
        console.log(e);
        this.tplName = "";
        this.notifyService.error("Template","Template not created" + e);
      });
  }
  
  
}
