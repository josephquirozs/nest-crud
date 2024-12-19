import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController(true)
export class AppController {
  @Get()
  @Redirect('api')
  redirect(): void { }
}
