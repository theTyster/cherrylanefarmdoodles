// test/index.spec.ts
import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker, { getFrontPageDogData } from '../src/index';
// Import Types
import { DogFamily } from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

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

describe('Cherry Lane Front Page API', () => {
	it('Responds with an object containing dummy information about dogs.', async () => {
		const request = new IncomingRequest('http://example.com/');
		const response = await worker.fetch(request, env);

    console.log(response);

		expect(await response.json()).toMatchObject(dogFamilies);
	});

	it('Handler function returns expected object containing dummy information.', async () => {
		expect(await getFrontPageDogData(env)).toMatchObject(dogFamilies);
	});
});
