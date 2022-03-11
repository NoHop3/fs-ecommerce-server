import User from '../../src/models/User'
import UserService from '../../src/services/userServices'
import connect, { MongodHelper } from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser() {
  const user = new User({
    email: 'r_geo@gmail.com',
    username: 'Rgeor',
    password: '12344321',
    firstName: 'Rafael',
    lastName: 'Georgio',
  })
  return await UserService.createUser(user)
}

describe('user service', () => {
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
    const user = await createUser()
    expect(user).toHaveProperty('_id', user._id)
    expect(user).toHaveProperty('email', 'r_geo@gmail.com')
    expect(user).toHaveProperty('username', 'Rgeor')
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    if(found)
    {expect(found.email).toEqual(user.email)
    expect(found._id).toEqual(user._id)}
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      email: 'r_geoUpdated@gmail.com',
      username: 'RgeorUpd',
    }
    const updated = await UserService.updateById(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(user).toHaveProperty('email', 'r_geoUpdated@gmail.com')
    expect(user).toHaveProperty('username', 'RgeorUpd')
  })

  it('should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      password: '12344321',
      firstName: 'Rafael',
      lastName: 'Georgio',
    }

    return UserService.updateById(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await createUser()
    await UserService.deleteById(user._id)
    return UserService.findById(user._id).catch((e) => {
      expect(e.message).toBe(`User ${user._id} not found`)
    })
  })
})
