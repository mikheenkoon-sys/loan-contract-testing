import {
  Pact,
  Matchers,
  SpecificationVersion
} from "@pact-foundation/pact";

import { describe, it, expect } from "vitest";

import { LoanApiClient } from "../../src/consumer/loanApiClient";

const provider = new Pact({
  consumer: "LoanWebApp",
  provider: "LoanService",
  dir: "./pacts",
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4
});

const ALLOWED_CURRENCIES = "EUR|USD|GBP";

describe("GET /loans/:id", () => {
  it("returns an approved loan", () => {
    return provider
      .addInteraction()
      .given("loan 123 exists and is approved")
      .uponReceiving("a request for loan 123")
      .withRequest("GET", "/loans/123")
      .willRespondWith(200, (builder) => {
        builder.headers({ "Content-Type": "application/json" });
        builder.jsonBody({
          id: 123,
          amount: Matchers.number(1500),
          currency: Matchers.regex(`^(${ALLOWED_CURRENCIES})$`, "EUR"),
          status: "APPROVED"
        });
      })
      .executeTest(async (mockServer) => {
        const client = new LoanApiClient(mockServer.url);

        const loan = await client.getLoan(123);

        expect(loan).toEqual({
          id: 123,
          amount: 1500,
          currency: "EUR",
          status: "APPROVED"
        });
      });
  });
});
