/// <reference types="cypress" />

const VALID_EQUATION_1 = "7*7+14";
const DATE_1 = "17122024";

const VALID_EQUATION_2 = "3*10+7";
const DATE_2 = "23022025";

const INVALID_EQUATION_1 = "24*22-";
const DATE_3 = "08122026";

const INVALID_EQUATION_2 = "1-1-12";
const DATE_4 = "05072027";

describe("Mathler Game", () => {
  beforeEach(() => {
    // Não é necessário visitar a página aqui, pois faremos isso em cada teste
  });

  it("1 - should display the game title and target result", () => {
    cy.visit(`http://localhost:3000?date=${DATE_1}`);
    cy.get("[data-cy=start]").click();
    cy.get("[data-cy=title]").should("be.visible");
    cy.get("[data-cy=subtitle]").should("be.visible");
  });

  it("2 - should allow entering a valid equation and submit it", () => {
    cy.visit(`http://localhost:3000?date=${DATE_1}`);
    cy.get("[data-cy=start]").click();
    const equation = VALID_EQUATION_1.split("");
    equation.forEach((char) => {
      cy.get(`[data-cy="key-${char}"]`).click();
    });
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=row-0]").within(() => {
      equation.forEach((char, index) => {
        cy.get(`[data-cy=tile-${index}]`).should("have.text", char);
      });
    });

    cy.get("[data-cy=success-message]").should("be.visible");
  });

  it("3 - should allow entering another valid equation and submit it", () => {
    cy.visit(`http://localhost:3000?date=${DATE_2}`);
    cy.get("[data-cy=start]").click();
    const equation = VALID_EQUATION_2.split("");
    equation.forEach((char) => {
      cy.get(`[data-cy="key-${char}"]`).click();
    });
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=row-0]").within(() => {
      equation.forEach((char, index) => {
        cy.get(`[data-cy=tile-${index}]`).should("have.text", char);
      });
    });

    cy.get("[data-cy=success-message]").should("be.visible");
  });

  it("4 - should not allow submitting an invalid equation", () => {
    cy.visit(`http://localhost:3000?date=${DATE_3}`);
    cy.get("[data-cy=start]").click();
    const equation = INVALID_EQUATION_1.split("");
    equation.forEach((char) => {
      cy.get(`[data-cy="key-${char}"]`).click();
    });
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=destructive-message]").should("be.visible");
  });

  it("5 - should not allow submitting an equation with negative numbers", () => {
    cy.visit(`http://localhost:3000?date=${DATE_4}`);
    cy.get("[data-cy=start]").click();
    const equation = INVALID_EQUATION_2.split("");
    equation.forEach((char) => {
      cy.get(`[data-cy="key-${char}"]`).click();
    });
    cy.get("[data-cy=key-Enter]").click();

    cy.get("[data-cy=warning-message]").should("be.visible");
  });
});
