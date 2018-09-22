import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ApiService } from './api.service'

@Component({
    selector: 'messages',
    template: `
        <div *ngFor="let message of apiService.messages">
          <mat-card>Description {{message.description}} Dosage {{message.dosage}} Notes {{message.notes}}</mat-card>
        </div>
    `
})
export class MessagesComponent {
    constructor(private apiService: ApiService, private route : ActivatedRoute) { }

    ngOnInit() {
        var userId = this.route.snapshot.params.id
        this.apiService.getMessages(userId);
    }
}
