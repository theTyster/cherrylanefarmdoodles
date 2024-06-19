// test/index.spec.ts
import { env } from "cloudflare:test";
import { describe, test, expect } from 'vitest';
import worker, { getFrontPageDogData } from '../src/index';

// Import Types
import { DogFamily } from '../src/index';

const IncomingRequest = Request<URL, IncomingRequestCfProperties>;

const dogFamilies: DogFamily[] = [
	{
		groupPhoto: 'https://example.com/group_img1.jpg',
		mother: 'Bella',
		father: 'Max',
		dueDate: '2023-03-13',
		birthday: '2024-06-01',
		goHomeDate: '2025-05-29',
	},
	{
		groupPhoto: 'https://example.com/group_img2.jpg',
		mother: 'Bella',
		father: 'Max',
		dueDate: '2023-01-19',
		birthday: '2024-06-10',
		goHomeDate: '2025-04-22',
	},
	{
		groupPhoto: 'https://example.com/group_img3.jpg',
		mother: 'Lucy',
		father: 'Charlie',
		dueDate: '2025-06-15',
		birthday: null,
		goHomeDate: null,
	},
	{
		groupPhoto: 'https://example.com/group_img4.jpg',
		mother: 'Lucy',
		father: 'Charlie',
		dueDate: '2025-02-15',
		birthday: null,
		goHomeDate: null,
	},
];

describe('D1 query function getFrontPageDogData() from index.', () => {
	test('Returns expected object containing test information.', async () => {
		expect(await getFrontPageDogData(env)).toMatchObject(dogFamilies);
	});
});

describe('D1 API', async () => {
	const requestUri = 'http://example.com';
	const request = new IncomingRequest(requestUri);
	const response = await worker.fetch(request, env);

	test('Successful response.', async () => {
		expect(response.ok).toBe(true);
		expect(response.statusText).toBe('OK');
		expect(response.status).toBe(200);
	});

	test('JSON content-type header.', async () => {
		expect(response.headers.get('content-type')).toBe('application/json');
	});

	test('JSON payload for root uri.', async () => {
		expect(await response.json()).toMatchObject(dogFamilies);
	});

	test('404 response.', async () => {
		const request = new IncomingRequest('http://example.com/not-a-real-page');
		const response = await worker.fetch(request, env);

		expect(response.ok).toBe(false);
		expect(response.statusText).toBe('Not Found');
		expect(response.status).toBe(404);
	});

	test.each([
		['POST'],
		['PUT'],
		['PATCH'],
		['DELETE'],
		['HEAD'],
		['OPTIONS'],
		['TRACE'],
	])('%s Requests', async (requestMethod) => {
		const requestOpts = { method: requestMethod };
		const rqst = new IncomingRequest('http://example.com', requestOpts);
		const response = await worker.fetch(rqst, env);

		expect(response.ok).toBe(false);
		expect(response.statusText).toBe('Method Not Allowed');
		expect(response.status).toBe(405);
	});
});
