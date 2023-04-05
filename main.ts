import * as Fastify from "fastify";
import * as FastifyZod from "fastify-type-provider-zod";
import * as Zod from "zod";

// initialize server

const fastify = Fastify.fastify();

// set up zod for fastify

fastify.setValidatorCompiler(FastifyZod.validatorCompiler);
fastify.setSerializerCompiler(FastifyZod.serializerCompiler);

fastify.addHook(undefined as any, undefined as any);

const server = fastify.withTypeProvider<FastifyZod.ZodTypeProvider>();

server.setErrorHandler((error, _, res) => {
  if (error instanceof Zod.ZodError) {
    res
      .status(error.statusCode ?? 500)
      .send({ ...error, message: JSON.parse(error.message) });
  }
});

//

server.route({
  method: "GET",
  url: "/",
  schema: {
    querystring: Zod.object({
      foo: Zod.string(),
    }),
  },
  handler: (_, res) => {
    res.send("hello");
  },
});

//

server.listen({ port: 3000 });
