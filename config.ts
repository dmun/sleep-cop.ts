import dotenv from "dotenv";

dotenv.config();

const { SLEEP_COP_TOKEN, SLEEP_COP_CLIENT_ID } = process.env;

if (!SLEEP_COP_TOKEN || !SLEEP_COP_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  SLEEP_COP_TOKEN,
  SLEEP_COP_CLIENT_ID,
};
