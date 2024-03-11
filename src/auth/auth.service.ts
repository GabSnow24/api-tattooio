import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { IJwt, IRest } from './models/interfaces'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<IRest | boolean> {
    const user = await this.userService.findByUserName(username)

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user
      return rest
    }
    return false
  }

  async login(user: any): Promise<{ access_token: string }> {
    const { username } = user
    const payload: IJwt = { username, sub: user.id }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
