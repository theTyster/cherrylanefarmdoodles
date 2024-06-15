/*****************************************************************************/
/*********************************** Types ***********************************/
/*****************************************************************************/

/* RETURNED DATA */
export interface DogFamily {
	/* Represents data called from dogsDb */
	readonly groupPhoto: string;
	readonly mother: string;
	readonly father: string;
	readonly dueDate: string;
	readonly birthday: string | null;
	readonly goHomeDate: string| null;
}

/*****************************************************************************/
/****************************** Front Page Data ******************************/
/*****************************************************************************/

export async function getFrontPageDogData(env: Env): Promise<DogFamily[]> {
	const dbQuery = env.dogsDB
		.prepare(
			`
      SELECT
        I.groupPhoto,
        AM.dogName as mother,
        AF.dogName as father,
        L.dueDate,
        L.birthday,
        L.goHomeDate
      FROM
      Families AS F
      LEFT JOIN Group_Photos AS I ON F.groupPhoto = I.ID
      LEFT JOIN Adults AS AM ON F.mother = AM.ID
      LEFT JOIN Adults AS AF ON F.father = AF.ID
      LEFT JOIN Litters AS L ON F.litterId = L.ID
  `
		)
		.bind();
	let { results } = await dbQuery.all<DogFamily>();
	return results;
}

/*****************************************************************************/

async function handleRootRequest(env: Env): Promise<Response> {
	const dogs = await getFrontPageDogData(env);
	return Response.json(dogs);
}

/*****************************************************************************/
/****************************** Request Handler ******************************/
/*****************************************************************************/

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);
		if (request.method === 'GET') {
			if (pathname === '/') return handleRootRequest(env);
			else return new Response('Not Found', { status: 404 });
		} else {
			return new Response('Method Not Allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
