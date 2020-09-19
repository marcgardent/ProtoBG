import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../services/eventhub.service';
import { MatDialog } from '@angular/material/dialog';
import { RenameComponent } from '../rename/rename.component';
import { IWorkspace, IResource } from '../lib/editor/models';
import { WarehouseService } from '../services/warehouse.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.less']
})
export class ExplorerComponent implements OnInit {

  get warehouse() { return this.warehouseService.current; }
  get workspace() { return this.warehouseService.workspace; }
  get resource() { return this.warehouseService.resource; }

  constructor(private readonly hub: EventHubService, private readonly warehouseService: WarehouseService,  public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  selectWorkspace(workspace: IWorkspace) {
    this.warehouseService.selectWorkspace(workspace);
  }

  selectResource(resource: IResource) {
    this.warehouseService.selectResource(resource);
  }

  renameWorkspace(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.workspace.name, action: 'Rename workspace' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.warehouseService.renameWorkspace(result.name);
    });
  }

  renameResource(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.resource.name, action: 'Rename resource' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.warehouseService.renameResource(result.name);
    });
  }

  createWorkspace(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.workspace.name, action: 'Create Workspace' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.warehouseService.createWorkspace(result.name);
    });
  }

  createResource(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.resource.name, action: 'Create Resource' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.warehouseService.createResource(result.name);
    });
  }

}