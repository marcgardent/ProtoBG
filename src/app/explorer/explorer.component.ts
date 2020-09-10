import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../services/eventhub.service';
import { MatDialog } from '@angular/material/dialog';
import { RenameComponent } from '../rename/rename.component';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.less']
})
export class ExplorerComponent implements OnInit {

  get warehouse() { return this.hub.currentWarehouse.value; }
  get workspace() { return this.hub.currentWorkspace.value; }
  get resource() { return this.hub.currentResource.value; }

  constructor(private readonly hub: EventHubService, public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  renameWorkspace(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.workspace.name, action: 'Rename workspace' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.debug("rename workspace", this.workspace, result)
      this.workspace.name = result.name;
      this.warehouse.currentWorkspace = this.workspace.name;
      //this.hub.onWorkspaceUpdated.next(this.workspace);
      //TODO notify rename workspace
    });
  }

  renameResource(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.resource.name, action: 'Rename resource' }
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO rename resource
    });
  }

  newWorkspace(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.workspace.name, action: 'Create Workspace' }
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO rename workspace
    });
  }

  newResource(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.resource.name, action: 'Create Resource' }
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO rename resource
    });
  }

}