import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { JWT_SECRET } from '../util/secrets'
import userServices from '../services/userServices'

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: any, done: any) => {
    const email = payload.email
    const username = payload.username
    const foundUser = await userServices.checkIfExists(email, username)
    done(null, foundUser)
  }
)
