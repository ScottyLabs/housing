import createClient from "openapi-fetch";
import type { paths } from "./openapi.d.ts";

const client = createClient<paths>({
  credentials: "include",
});

export default client;
