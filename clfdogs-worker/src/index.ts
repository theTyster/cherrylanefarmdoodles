/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// };

export interface Env {
  dogsDB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/") {
      const { results } = await env.dogsDB.prepare(
        "SELECT * FROM ClfDogs"
      )
        .all();
      return Response.json(results);
    }

    return new Response(
      "Call /api/beverages to see everyone who works at Bs Beverages"
    );
  },
} satisfies ExportedHandler<Env>;
