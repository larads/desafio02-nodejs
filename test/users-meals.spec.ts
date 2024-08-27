import { app } from '../src/app'
import supertestRequest from 'supertest'
import { it, beforeAll, afterAll, describe } from 'vitest'

describe('Users routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new account', async () => {
        await supertestRequest(app.server)
            .post('/users')
            .send({
                name: 'mariana_test',
                email: 'mariana@gmail.com',
                address: 'Rua de teste',
                weight: 80.5,
                height: 174,
            })
            .expect(201)
    })
})