import { afterAll, beforeAll, describe, it } from "vitest";
import { Verifier } from "@pact-foundation/pact";
import path from "node:path";
import type { Server } from "node:http";

import { createApp } from "../../src/provider/app";
import {
  LoanRepository,
  ProviderLoan
} from "../../src/provider/loanRepository";

describe("LoanService Pact verification", () => {
  const repository = new LoanRepository();

  let server: Server;

  beforeAll(() => {
    const app = createApp(repository);

    server = app.listen(8080);
  });

  afterAll(() => {
    server.close();
  });

  it("verifies the LoanWebApp contract", async () => {
    const options = {
      providerBaseUrl: "http://127.0.0.1:8080",

      pactUrls: [
        path.resolve(
          process.cwd(),
          "pacts/LoanWebApp-LoanService.json"
        )
      ],

      stateHandlers: {
        "loan 123 exists and is approved": async () => {
          repository.clear();

          const loan: ProviderLoan = {
            id: 123,
            amount: 7000,
            currency: "EUR",
            status: "APPROVED",
            customerId: 456,
            internalRiskScore: 82
          };

          repository.save(loan);
        }
      }
    };

    await new Verifier(options).verifyProvider();
  });
});