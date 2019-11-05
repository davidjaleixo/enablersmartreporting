import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-datasource',
	templateUrl: './datasource.component.html',
	styleUrls: ['./datasource.component.css']
})
export class DatasourceComponent implements OnInit {

	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
	}

}
