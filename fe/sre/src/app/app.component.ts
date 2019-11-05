import { Component } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { TemplatesService } from './templates.service';
import { environment } from './../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sre-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sre-app';
  tpls: any = [];
  currenttpl: any;
  owner: string;

  constructor (private sessionSt: SessionStorageService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private templatesService: TemplatesService, 
    private notifyService: ToastrService){
     router.events.subscribe((data) => {
       let aux: any = [] = router.url.split("/"); 
       aux.forEach((eachR, idx, arr) => {
         if(eachR == "templates"){
           this.setTplActive(aux[idx+1]);
         }
       })
     })
  }
  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.templatesService.getTplByOwner(val.state.root.firstChild.params.owner).subscribe(
          data => {
            this.tpls = data;
          }, e => {
            console.log(e);
          })
        this.owner = val.state.root.firstChild.params.owner;
      }
    })

  }

  setTplActive(tpl_id: string){
    this.currenttpl = parseInt(tpl_id);
  }

  addTpl(id: number, name: string, owner_name: string){
    this.tpls.push({idtemplates: id, owner: owner_name, name: name});
  }

  delTpl(id: number){
    this.tpls.forEach((eachElem,idx, arr )=> {
      if(eachElem.idtemplates == id){
        this.tpls.splice(idx, 1);
      }
    })
  }

    //submit new template modal
  deletetpl(tpl: number) {
    this.templatesService.deleteTpl(tpl).subscribe(data => {
      console.log(data);
      this.notifyService.success("Template", "Template has been deleted successfully");
        this.delTpl(tpl);
      }, e => {
        console.log(e);
        this.notifyService.error("Template","Template was not deleted");
      });
  }
  
}
