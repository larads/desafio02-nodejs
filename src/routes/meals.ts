import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import cookie from '@fastify/cookie'
import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
    app.post('/', async (request, response) => {
        const sessionId = request.cookies.sessionId

        if (!sessionId) {
            return response.status(401).send({
                error: 'Unauthorized',
            })
        }

        const [user] = await knex('users')
            .where('session_id', sessionId)
            .select('id')

        const userId = user.id

        const createMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            isOnTheDiet: z.boolean(),
        })
        const { name, description, isOnTheDiet } = createMealBodySchema.parse(
            request.body,
        )

        await knex('meals').insert({
            id: crypto.randomUUID(),
            user_id: userId,
            name,
            description,
            isOnTheDiet,
        })
        return response.status(201).send()
    })

    app.get('/', async () => {
        const meals = await knex('meals').select()
        return {
            meals,
        }
    })

    app.get('/:id', async (request) => {
        const getMealParamsSchema = z.object({
            id: z.string().uuid(),
        })
        const params = getMealParamsSchema.parse(request.params)

        const meal = await knex('meals').where('id', params.id).first()

        return { meal }
    })

    app.get('/summary', async () => {

        const [count] = await knex('meals').count('id', {
            as: 'Total de refeições registradas',
        })

        const refDieta = await knex('meals')
            .count('id', { as: 'Total de refeições dentro da dieta' })
            .where('isOnTheDiet', true)

        const refForaDieta = await knex('meals')
            .count('id', { as: 'Total de refeições fora da dieta' })
            .where('isOnTheDiet', false)

        const summary = {
            'Total de refeições registradas': parseInt(
                JSON.parse(JSON.stringify(count))['Total de refeições registradas'],
            ),

            'Total de refeições dentro da dieta': parseInt(
                JSON.parse(JSON.stringify(refDieta))[0][
                'Total de refeições dentro da dieta'
                ],
            ),

            'Total de refeições fora da dieta': parseInt(
                JSON.parse(JSON.stringify(refForaDieta))[0][
                'Total de refeições fora da dieta'
                ],
            ),
        }

        return {
            summary,
        }
    })
}