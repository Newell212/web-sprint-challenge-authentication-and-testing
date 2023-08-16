const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('[POST] /register', () => {
  const newUser = {username: 'napoleon', password: 1234}
  test('adds new user to the database', async () => {
    const res = await request(server).post('/register').send({username: 'napoleon', password: 1234})
    expect(res.body).toBe({username: 'napoleon', password: 1234})

  })
})