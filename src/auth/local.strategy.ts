import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService,
    // private readonly promService: PromService
  ) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password)

    if (!user) {
      // this.promService.getCounter({ name: 'auth_user_error', help: 'User authentication error counter' }).inc(1)
      Logger.error('IncorrectCredentials', '', 'AuthService', true)
      throw new UnauthorizedException()
    }

    return user
  }
}
