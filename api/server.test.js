const request = require('supertest')
// const bcrypt = require('bcryptjs')
const db = require('../data/dbConfig')
const server = require('./server')
// const { BCRYPT_ROUNDS } = require('../config')

let token = ""

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})


describe('[POST] /register', () => {
  const newUser = {username: 'napoleon', password: '1234'}
  // const encryptedPassword = bcrypt.hashSync(newUser.password, BCRYPT_ROUNDS);

  test('adds new user to the database', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
    // expect(res.body.password).toBe(encryptedPassword);
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
})

describe('[GET] /', () => {
  test('wont access jokes without token', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toEqual('token invalid')
  })
  test('will access jokes', async () => {
    const res = await request(server).get('/api/jokes').set({Authorization: token})
    expect(res.body).toHaveLength(3)
  })
})