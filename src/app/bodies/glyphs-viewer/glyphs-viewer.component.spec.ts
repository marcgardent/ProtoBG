import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlyphsViewerComponent } from './glyphs-viewer.component';

describe('GlyphsViewerComponent', () => {
  let component: GlyphsViewerComponent;
  let fixture: ComponentFixture<GlyphsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlyphsViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlyphsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
