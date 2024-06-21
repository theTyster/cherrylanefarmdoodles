import {
	createExecutionContext,
	env,
	waitOnExecutionContext,
} from "cloudflare:test";
import { describe, test, expect } from "vitest";
import worker, { Fido } from "../src/index";

type IncomingRequest = Request<URL, IncomingRequestCfProperties>;

const incomingRequest = Request<URL, IncomingRequestCfProperties>;

/*const workerFetch = async (request: IncomingRequest, env: Env) => {
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, env, ctx);
	await waitOnExecutionContext(ctx);
	return response;
};*/

describe("D1 query functions", () => {
	test("getFrontPageDogData()", async () => {
    const {results} = await Fido.getFrontPageDogData(env);

		expect(results, "Should return a predefined object.").toMatchObject([
			{
				groupPhoto: "https://example.com/group_img1.jpg",
				mother: "Bella",
				father: "Max",
				dueDate: "2023-03-13",
				birthday: "2024-06-01",
				goHomeDate: "2025-05-29",
			},
			{
				groupPhoto: "https://example.com/group_img2.jpg",
				mother: "Bella",
				father: "Max",
				dueDate: "2023-01-19",
				birthday: "2024-06-10",
				goHomeDate: "2025-04-22",
			},
			{
				groupPhoto: "https://example.com/group_img3.jpg",
				mother: "Lucy",
				father: "Charlie",
				dueDate: "2025-06-15",
				birthday: null,
				goHomeDate: null,
			},
			{
				groupPhoto: "https://example.com/group_img4.jpg",
				mother: "Lucy",
				father: "Charlie",
				dueDate: "2025-02-15",
				birthday: null,
				goHomeDate: null,
			},
		]);
	});
});

/*describe("D1 API", async () => {
	const request = new incomingRequest("http://example.com");
	const response = await workerFetch(request, env);

	test("Successful response.", async () => {
		expect(response.ok).toBe(true);
		expect(response.statusText).toBe("OK");
		expect(response.status).toBe(200);
	});

	test("JSON content-type header.", async () => {
		expect(response.headers.get("content-type")).toBe("application/json");
	});

	test("JSON payload for root uri.", async () => {
		expect(await response.json()).toMatchObject([
			{
				groupPhoto: "https://example.com/group_img1.jpg",
				mother: "Bella",
				father: "Max",
				dueDate: "2023-03-13",
				birthday: "2024-06-01",
				goHomeDate: "2025-05-29",
			},
			{
				groupPhoto: "https://example.com/group_img2.jpg",
				mother: "Bella",
				father: "Max",
				dueDate: "2023-01-19",
				birthday: "2024-06-10",
				goHomeDate: "2025-04-22",
			},
			{
				groupPhoto: "https://example.com/group_img3.jpg",
				mother: "Lucy",
				father: "Charlie",
				dueDate: "2025-06-15",
				birthday: null,
				goHomeDate: null,
			},
			{
				groupPhoto: "https://example.com/group_img4.jpg",
				mother: "Lucy",
				father: "Charlie",
				dueDate: "2025-02-15",
				birthday: null,
				goHomeDate: null,
			},
		]);
	});

	test("404 response.", async () => {
		const request = new incomingRequest("http://example.com/not-a-real-page");
		const response = await workerFetch(request, env);

		expect(response.ok).toBe(false);
		expect(response.statusText).toBe("Not Found");
		expect(response.status).toBe(404);
	});

	test.each([
		["POST"],
		["PUT"],
		["PATCH"],
		["DELETE"],
		["HEAD"],
		["OPTIONS"],
		["TRACE"],
	])("%s Requests", async (requestMethod) => {
		const requestOpts = { method: requestMethod };
		const rqst = new incomingRequest("http://example.com", requestOpts);
		const response = await workerFetch(rqst, env);

		expect(response.ok).toBe(false);
		expect(response.statusText).toBe("Method Not Allowed");
		expect(response.status).toBe(405);
	});
});*/
