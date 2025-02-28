import {
  errorText,
  loadingText,
} from "@/constants/strings";

describe("Admin Panel", () => {
  beforeEach(() => {
    cy.visit("/panel");
  });

  it("Displays the Litter panel", () => {
    const litterNamesRegex =
      /\b[A-z]*\b - \(\b[A-z]*\b ((\b[0-9]*\b,)? (\b[0-9]*\b)\))?|([0-9])(th|st|nd|rd)\)/gm;

    // 7th child is, when the component is failing, one of the following strings
    const failingStrings = [loadingText, errorText];
    failingStrings.forEach((fail) =>
      cy.get("form > :nth-child(7)").should("not.have.text", fail)
    );

    cy.get("select[name=litterId]")
      //cy.get("p#litterId")
      .invoke("text")
      .should("match", litterNamesRegex);

    cy.contains("Important").should("have.css", "color", "rgb(255, 0, 0)");
  });
});
