import { ApiProperty } from '@nestjs/swagger';

class UserPayload {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;
}

export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserPayload })
  user: UserPayload;
}
