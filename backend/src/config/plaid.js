import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  })
);

export default plaidClient;
