import { Component } from '@angular/core';
import { ApiService } from './api.service'

@Component({
    selector: 'post',
    template: `
        <mat-card>
            <mat-card-header>
                <mat-card-title>
                    <h4>New Post</h4>
                </mat-card-title>
            </mat-card-header>
            <mat-card-content>
                <form>
                    <mat-form-field style="width : 50%">
                        <textarea [(ngModel)]="medication.description" name="description" matInput placeholder="Description"></textarea>
                    </mat-form-field>
                    <br>   
                    <mat-form-field>
                        <mat-select placeholder="Dosage" [(ngModel)]="medication.dosage" name="dosage">
                            <mat-option *ngFor="let number of numbers" [value]="number">{{number}}</mat-option>
                        </mat-select>
                    </mat-form-field>
                    <br>
                    <mat-form-field style="width : 50%">
                        <textarea [(ngModel)]="medication.notes" name="notes" matInput placeholder="Notes"></textarea>
                    </mat-form-field>
                    <br>
                    <button (click)="post()" mat-raised-button color="primary">Add</button>
                </form>
            </mat-card-content>
        </mat-card>
    `
})
export class PostComponent {
    numbers = [1,2,3,4,5,6,7,8,9,10]
    medication = {}
    constructor(private apiService: ApiService) { 
    }
    postMsg = ""
    post(){
        this.apiService.postMessage(this.medication)

    }
}
