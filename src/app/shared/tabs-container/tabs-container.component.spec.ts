import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from '../tab/tab.component';
import { TabsContainerComponent } from './tabs-container.component';

@Component({
  template: `
    <app-tabs-container>
      <app-tab tabTitle="Tab 1">Tab 1</app-tab>
      <app-tab tabTitle="Tab 2">Tab 2</app-tab>
    </app-tabs-container>
  `,
})
class TestHostComponent {}

describe('TabsContainerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, TabsContainerComponent, TabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should 2 TabComponents', () => {
    const tabs = fixture.debugElement.queryAll(By.css('li'));

    const tabsContainerComponent = fixture.debugElement.query(
      By.directive(TabsContainerComponent)
    ).componentInstance as TabsContainerComponent;

    const tabsProp = tabsContainerComponent.tabs;

    expect(tabs.length).withContext('Tabs did not render').toBe(2);
    expect(tabsProp.length)
      .withContext('Could not grab component property')
      .toBe(2);
  });
});
