import { app } from './app'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

app.register(cookie)

app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })