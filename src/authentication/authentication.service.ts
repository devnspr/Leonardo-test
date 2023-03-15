import { Injectable } from '@nestjs/common';
import { encode } from 'jwt-simple';

@Injectable()
export class AuthenticationService {
  private secret = process.env.JWT_SECRET;
  async signIn(username: string, password: string): Promise<string> {
    return encode({ username }, this.secret);
  }
}
