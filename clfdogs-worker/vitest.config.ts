import path from 'node:path';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig(async () => {
	const migrationsPath = path.join(__dirname, 'test/migrations');
	const migrations = await readD1Migrations(migrationsPath);

	return {
		test: {
			setupFiles: ['./test/migrateDB.ts'],
			poolOptions: {
				workers: {
					singleWorker: true,
					wrangler: {
						configPath: './wrangler.toml',
					},
					miniflare: {
						bindings: { TEST_MIGRATIONS: migrations },
					},
				},
			},
		},
	};
});
