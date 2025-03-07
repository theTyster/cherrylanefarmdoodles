export function runMenuTests() {
  describe("The Menu", () => {
    /**
     * Ensures the menu is opened after it has been hydrated. Across multiple
     * tests.
     **/
    function clickMenu() {
      return cy.get("[id^=nav_title-menu-button]").wait(100).click();
    }

    it("Should close when the page is scrolled", () => {
      clickMenu().within((menu) => {
        cy.wrap(menu).should("have.text", "Menu");
        cy.wrap(menu).should("not.be.visible");
        cy.scrollTo(0, 1);
        cy.wrap(menu).should("be.visible");
      });
    });

    it("Should contain working, 'Home', 'About', 'Mothers', and 'Recent Litters' buttons", () => {
      clickMenu();
      cy.get("nav").within(() => {
        cy.contains("Home")
          .should("have.prop", "tagName", "A")
          .and("have.attr", "href", "/");
        cy.contains("About")
          .should("have.prop", "tagName", "A")
          .and("have.attr", "href", "/about");
        cy.contains("Mothers").should("have.prop", "tagName", "BUTTON").click();

        cy.get("[class^=nav_submenu_]")
          .should("be.visible")
          .within((submenu) => {
            // Move through the submenu
            cy.wrap(submenu)
              .children()
              .first()
              .should("have.prop", "tagName", "BUTTON")
              .next()
              .should("have.prop", "tagName", "A")
              .and("have.attr", "href", "/dams/1")
              .next()
              .should("have.prop", "tagName", "A")
              .and("have.attr");
            // Click the back button
            cy.get("button").should("have.text", "< Back").click();
          });

        cy.contains("Recent Litters")
          .should("be.visible")
          .and("have.prop", "tagName", "BUTTON")
          .click();
        cy.get("[class^=nav_submenu_]")
          .should("be.visible")
          .within((submenu) => {
            // Move through the submenu
            cy.wrap(submenu)
              .children()
              .first()
              .should("have.prop", "tagName", "BUTTON")
              .next()
              .should("have.prop", "tagName", "A")
              .and("have.attr", "href", "/litter/1")
              .next()
              .should("have.prop", "tagName", "A")
              .and("have.attr", "href", "/litter/2");
            // Click the back button
            cy.get("button").should("have.text", "< Back").click();
          });
      });
    });
  });
}
