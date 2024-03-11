import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IJwt, IToken } from './models/interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SESSION_SECRET,
      ignoreExpiration: false
    })
  }

  async validate(payload: IJwt): Promise<IToken> {
    return {
      id: payload.sub,
      username: payload.username
    } as IToken
  }
}
