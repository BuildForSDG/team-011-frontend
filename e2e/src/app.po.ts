import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(path?: string): Promise<unknown> {
    return browser.get(`${browser.baseUrl}${path}`) as Promise<unknown>;
  }

  getTitleText(css: string): Promise<string> {
    return element(by.css(css)).getText() as Promise<string>;
  }
  clickButton(buttonName: string) {
    return element(by.buttonText(buttonName)).click() as Promise<void>;
  }
}
