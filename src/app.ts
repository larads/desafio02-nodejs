import { env } from './env'
import fastify from 'fastify'

export const app = fastify()

app
    .listen({
        port: env.PORT,
    })
    .then(() => {
        console.log(`HTTP Server Running at port ${env.PORT}`)
    })