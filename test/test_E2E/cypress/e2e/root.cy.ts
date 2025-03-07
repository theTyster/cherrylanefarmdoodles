import { runMenuTests } from "./suites/menu";

describe("Front Page", () => {
  beforeEach(() => cy.visit("/"));
  runMenuTests();
});
