import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RenameComponent } from 'src/app/modals/rename/rename.component';
import { EventHubService } from 'src/app/services/eventhub.service';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { IWorkspace, IResource } from 'src/core/editor/models';


@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.sass']
})
export class ExplorerComponent implements OnInit {

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
  
  renameResource(): void {
    const dialogRef = this.dialog.open(RenameComponent, {
      width: '250px',
      data: { name: this.resource.name, action: 'Rename resource' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.warehouseService.renameResource(result.name);
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