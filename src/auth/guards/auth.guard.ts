import { CanActivate,ExecutionContext,Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtservice:JwtService){}
    async canActivate(context:ExecutionContext){
        const request=context.switchToHttp().getRequest();
        const authorization=request.headers.authorization;
        const token=authorization?.split(' ')[1]

        if(!token){
            throw new UnauthorizedException();
        }
        try{
            //await this.jwtservice.verifyAsync(token);
            const tokenpayload= await this.jwtservice.verifyAsync(token);
            request.user={
                userId:tokenpayload.sub,
                username:tokenpayload.username
            } 
            return true;
        } catch (err){
            throw new UnauthorizedException();
        }
    }
}