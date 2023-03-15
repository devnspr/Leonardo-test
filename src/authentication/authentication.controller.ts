import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private service: AuthenticationService) {}
  @Post('/sign_in')
  async authenticate(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const token = await this.service.signIn(username, password);
    return { token };
  }
}
