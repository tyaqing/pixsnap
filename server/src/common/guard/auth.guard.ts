import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      this.jwtService.verify(token)
      const payload = this.jwtService.decode(token)
      this.logger.log({
        message: 'printPayload',
        payload,
      })
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload
    } catch (e) {
      this.logger.warn({
        message: 'invalidToken',
        token,
        error: e,
      })
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['accessToken']
  }
}
