import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'
let existingToken = ''

async function createUser(override?: Partial<UserDocument>) {
  let user = {
    email: 'r_geo@gmail.com',
    username: 'Rgeor',
    password: '12344321',
    firstName: 'Rafael',
    lastName: 'Georgio',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users').send(user)
}

describe('user controller', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body.email).toEqual('r_geo@gmail.com')
    expect(res.body.username).toEqual('Rgeor')
  })

  it('should not create a user with wrong data', async () => {
    const res = await request(app).post('/api/v1/users').send({
      password: '12344321',
      firstName: 'Rafael',
      lastName: 'Georgio',
      username: 'Rgeor',
      // These fields should be included
      // email: 'r_geo@gmail.com',
    })
    expect(res.status).toBe(400)
  })

  it('should get back an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    res = await request(app).get(`/api/v1/users/${userId}`)

    expect(res.body._id).toEqual(userId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await request(app).get(`/api/v1/users/${nonExistingUserId}`)
    expect(res.status).toBe(404)
  })
  it('should be able to login with existing email', async () => {
    const res1 = await createUser({
      email: 'r_geo1@gmail.com',
      username: 'Rgeor1',
      password: '12344321',
      firstName: 'Rafael1',
      lastName: 'Georgio1',
    })
    const res2 = await request(app).post('/api/v1/users/login').send({
      email: 'r_geo1@gmail.com',
      password: '12344321',
    })
    expect(res1.body._id).toEqual(res2.body.loginUser._id)
    expect(res1.body.email).toEqual(res2.body.loginUser.email)
  })
  it('should be able to login with existing username', async () => {
    const res1 = await createUser({
      email: 'r_geo1@gmail.com',
      username: 'Rgeor1',
      password: '12344321',
      firstName: 'Rafael1',
      lastName: 'Georgio1',
    })
    const res2 = await request(app).post('/api/v1/users/login').send({
      username: 'Rgeor1',
      password: '12344321',
    })
    expect(res1.body._id).toEqual(res2.body.loginUser._id)
    expect(res1.body.username).toEqual(res2.body.loginUser.username)
    existingToken = res2.body.token
  })

  it('should get back all users', async () => {
    const res1 = await createUser({
      email: 'r_geo1@gmail.com',
      username: 'Rgeor1',
      password: '12344321',
      firstName: 'Rafael1',
      lastName: 'Georgio1',
    })
    const res2 = await createUser({
      email: 'r_geo2@gmail.com',
      username: 'Rgeor2',
      password: '12344321',
      firstName: 'Rafael2',
      lastName: 'Georgio2',
    })

    const res3 = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${existingToken}`)
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })
  it('should not get back all users without token', async () => {
    const res3 = await request(app)
      .get('/api/v1/users')
    expect(res3.status).toBe(401)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      email: 'r_georgie@gmail.com',
      username: 'Rgeorgo',
    }

    res = await request(app).put(`/api/v1/users/${userId}`).send(update)

    expect(res.status).toEqual(200)
    expect(res.body.email).toEqual('r_georgie@gmail.com')
    expect(res.body.username).toEqual('Rgeorgo')
  })

  it('should delete an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)
    const userId = res.body._id

    res = await request(app).delete(`/api/v1/users/${userId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(404)
  })
})
