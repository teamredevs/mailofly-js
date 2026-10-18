import assert from "node:assert/strict";
import test from "node:test";
import { Mailofly } from "../src/client";

test("template variable lookup calls the metadata endpoint and returns names", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    assert.equal(String(input), "https://api.example.test/templates/template%2Fid/variables");
    return new Response(JSON.stringify({data:{id:"template/id",variable_names:["first_name","reset_url"]}}),{status:200,headers:{"Content-Type":"application/json"}});
  };
  try {
    const client = new Mailofly({apiKey:"test-key",baseUrl:"https://api.example.test"});
    assert.deepEqual(await client.templates.variables("template/id"),{data:{id:"template/id",variable_names:["first_name","reset_url"]}});
  } finally { globalThis.fetch = originalFetch; }
});
