import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Role } from './schema/role.schema';
import { RoleDTO } from './dto/role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  async findAll() {
    const roles = await this.rolesService.findAll();
    return this.mapper.mapArray(roles, Role, RoleDTO);
  }
}
