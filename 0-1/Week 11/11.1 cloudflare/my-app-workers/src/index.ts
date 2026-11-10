export default {
	async fetch(request, env, ctx): Promise<Response> {
		return new Response("Hello World!");
	},
} satisfies ExportedHandler<Env>;

//routing in Cloudflare environment (the ugly way ~ without any libraries/frameworks)
// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		console.log(request);
// 		console.log(request.body);
// 		console.log(request.headers);

// 		if (request.method === 'GET') {
// 			return Response.json({
// 				message: 'you sent a GET request',
// 			});
// 		} else {
// 			return Response.json({
// 				message: 'you did not send a GET request',
// 			});
// 		}
// 	},
// } satisfies ExportedHandler<Env>;
