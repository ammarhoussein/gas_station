import { Controller, HttpCode, HttpStatus,Post,Body, UseGuards ,Request,Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor (private authservice:AuthService){}
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: {username:string,password:string}){
        return this.authservice.authenticate(input)
    }
    @UseGuards(AuthGuard)
    @Get('me')
    getUserInfo(@Request() request){
        return request.user
    }

}
