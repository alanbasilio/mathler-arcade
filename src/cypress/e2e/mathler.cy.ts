/// <reference types="cypress" />

const DATE_1 = "20241217";
const DATE_2 = "20250223";
const DATE_3 = "20261208";
const DATE_4 = "20270705";

const INVALID_EQUATION_1 = "24*22-";
const INVALID_EQUATION_2 = "1-1-12";

const submitEquation = (equation: string) => {
  equation.split("").forEach((char) => {
    cy.get(`[data-cy="key-${char}"]`).click();
  });
  cy.get("[data-cy=key-Enter]").click();
};

describe("Mathler Game", () => {
  it("1 - should display the game title and target result", () => {
    cy.visit(`http://localhost:3000?date=${DATE_1}`);
    cy.get("[data-cy=start]").click();
    cy.get("[data-cy=title]").should("be.visible");
    cy.get("[data-cy=subtitle]").should("be.visible");
  });

  it("2 - should allow entering a valid equation and submit it", () => {
    cy.task<string>("getEquationForDate", DATE_1).then((equation) => {
      cy.visit(`http://localhost:3000?date=${DATE_1}`);
      cy.get("[data-cy=start]").click();
      submitEquation(equation);

      cy.get("[data-cy=row-0]").within(() => {
        equation.split("").forEach((char, index) => {
          cy.get(`[data-cy=tile-${index}]`).should("have.text", char);
        });
      });

      cy.get("[data-cy=success-message]").should("be.visible");
    });
  });

  it("3 - should allow entering another valid equation and submit it", () => {
    cy.task<string>("getEquationForDate", DATE_2).then((equation) => {
      cy.visit(`http://localhost:3000?date=${DATE_2}`);
      cy.get("[data-cy=start]").click();
      submitEquation(equation);

      cy.get("[data-cy=row-0]").within(() => {
        equation.split("").forEach((char, index) => {
          cy.get(`[data-cy=tile-${index}]`).should("have.text", char);
        });
      });

      cy.get("[data-cy=success-message]").should("be.visible");
    });
  });

  it("4 - should not allow submitting an invalid equation", () => {
    cy.visit(`http://localhost:3000?date=${DATE_3}`);
    cy.get("[data-cy=start]").click();
    submitEquation(INVALID_EQUATION_1);
    cy.get("[data-cy=destructive-message]").should("be.visible");
  });

  it("5 - should not allow submitting an equation with negative numbers", () => {
    cy.visit(`http://localhost:3000?date=${DATE_4}`);
    cy.get("[data-cy=start]").click();
    submitEquation(INVALID_EQUATION_2);
    cy.get("[data-cy=warning-message]").should("be.visible");
  });
});
