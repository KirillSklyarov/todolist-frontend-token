import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateitemComponent } from './createitem.component';

describe('CreateitemComponent', () => {
  let component: CreateitemComponent;
  let fixture: ComponentFixture<CreateitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
