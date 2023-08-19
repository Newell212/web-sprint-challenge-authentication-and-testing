const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

let token = ""

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('[POST] /register', () => {
  const newUser = {username: 'napoleon', password: '1234'}

  test('empty user is an error', async () => {
    const res = await request(server).post('/api/auth/register').send({})
    expect(res.status).toBe(401)
  })

  test('username required', async () => {
    const res = await request(server).post('/api/auth/register').send({password: '1234'})
    expect(res.status).toBe(401)
  })

  test('password required', async () => {
    const res = await request(server).post('/api/auth/register').send({username: '1234'})
    expect(res.status).toBe(401)
  })

  test('adds new user to the database', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
  })

  test('wont add user if username is not unique', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(401)
  })
})

describe('[POST] /login', () => {
  test('wont login if username or password is incorrect', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'napoleons', password: '1234'})
    expect(res.status).toBe(401)
  })
  test('logs user in and creates a token', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'napoleon', password: '1234'})
    token = res.body.token
    expect(token).toEqual(res.body.token)
  })
  test('responds with invalid credentials if theres no username', async () => {
    const res = await request(server).post('/api/auth/login').send({password: '1234'})
    expect(res.body.message).toEqual('invalid credentials')
  })
})

describe('[GET] /', () => {
  test('wont access jokes without token', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toEqual('token required')
  })
  test('will access jokes', async () => {
    const res = await request(server).get('/api/jokes').set({Authorization: token})
    expect(res.body).toHaveLength(3)
  })
})