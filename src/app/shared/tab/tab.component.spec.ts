import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let fixture: ComponentFixture<TabComponent>;
  let component: TabComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    const element = fixture.debugElement.query(By.css('.hidden'));
    // const element2 = fixture.nativeElement.querySelector('.hidden');
    // const element3 = document.querySelector('.hidden');
    expect(element).toBeTruthy();
  });

  it('should not have .hidden class', () => {
    component.active = true;

    // running change detection after updating component's properties (RECOMMEND)
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.hidden'));
    expect(element).not.toBeTruthy();
  });
});
