import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../templates.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	tpls: any = [];
  constructor(
  	private templatesService: TemplatesService,
  	private route: ActivatedRoute, 
  	private router: Router) { }

  ngOnInit() {
  	this.templatesService.getTplByOwner(this.route.snapshot.params.owner).subscribe(
  		data => {
  			this.tpls = data;
	  	}, e => {
	  		console.log(e);
	  	})
  }

}
