/// <reference types="cypress" />

describe("Mathler Game", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the game title and target result", () => {
    cy.get("[data-cy=title]").should("be.visible");
    cy.get("[data-cy=subtitle]").should("be.visible");
    cy.contains("that results in 65").should("be.visible");
  });

  it("should allow entering a guess and submit it", () => {
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-+]").click();
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-*]").click();
    cy.get("[data-cy=key-2]").click();
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=row-0]").within(() => {
      cy.get("[data-cy=tile-0]").should("have.text", "5");
      cy.get("[data-cy=tile-1]").should("have.text", "5");
      cy.get("[data-cy=tile-2]").should("have.text", "+");
      cy.get("[data-cy=tile-3]").should("have.text", "5");
      cy.get("[data-cy=tile-4]").should("have.text", "*");
      cy.get("[data-cy=tile-5]").should("have.text", "2");
    });
  });

  it("should display success message when the correct equation is guessed", () => {
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-+]").click();
    cy.get("[data-cy=key-5]").click();
    cy.get("[data-cy=key-*]").click();
    cy.get("[data-cy=key-2]").click();
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=success-message]").should("be.visible");
  });
});
