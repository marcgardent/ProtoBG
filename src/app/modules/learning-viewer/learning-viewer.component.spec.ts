import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningViewerComponent } from './learning-viewer.component';

describe('LearningViewerComponent', () => {
  let component: LearningViewerComponent;
  let fixture: ComponentFixture<LearningViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
