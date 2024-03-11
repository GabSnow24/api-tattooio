import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiResponse } from '@nestjs/swagger'
import { LocalAuthGuard } from './local-auth.guard'
import { CounterMetric, PromCounter } from '@digikare/nestjs-prom'

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK
  })
  @HttpCode(HttpStatus.OK)
  login(@Request() req: any, @PromCounter('auth_user_sucess') counter1: CounterMetric): any {
    counter1.inc(1)
    return this.authService.login(req.user)
  }
}
