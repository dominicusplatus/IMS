import { Component,Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from 'clarity-angular';
import { Http } from '@angular/http';

 import {IDevice}  from "../../data/device/IDevice";
 import {IotDevice}  from "../../data/device/IotDevice";

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent {

    private httpContext: Http;
    public  devices: Array<IotDevice>;

     constructor(http: Http, @Inject('ORIGIN_URL') originUrl: string) {
        this.httpContext = http;
        this.devices = new Array<IotDevice>();

         this.httpContext.get(originUrl+'/api/device').subscribe(result => {
                var imported = result.json() as Array<IDevice>;
                this.devices = new Array<IotDevice>();
                imported.forEach(element => {
                    this.devices.push(element);
                });

            });

    }

     public fetch()
    {


    }

     clicked(event) {
        this.fetch();
    }

}
