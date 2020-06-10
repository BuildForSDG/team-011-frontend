import { AppPage } from "./app.po";
import { browser, logging, element, by } from "protractor";

describe("workspace-project App", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("should display welcome message", () => {
    page.navigateTo();
    expect(page.getTitleText("app-home .title")).toBeTruthy();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE
      } as logging.Entry)
    );
  });

  describe("Auth", () => {
    it("should navigate to login page", async () => {
      page.navigateTo("/account/login");
      expect(page.getTitleText("app-login .card-title")).toBe("Sign In");
    });
    it("should navigate to signup page", () => {
      page.navigateTo("/account/signup");
      expect(page.getTitleText("app-signup .card-title")).toBe("Register");
    });
    // it('should navigate to login page when link is clicked', () => {
    //   element(by.linkText('Login')).click();
    //   expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/account/login`);
    // });
    // it('should navigate to signup page when signup link is clicked', () => {
    //   element(by.linkText('Sign Up')).click();
    //   expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/account/signup`);
    // });
  });
});
