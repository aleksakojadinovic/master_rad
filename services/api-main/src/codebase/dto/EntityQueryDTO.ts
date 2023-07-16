export class EntityQueryDTO {
  // TODO: Maybe pagination
  constructor(
    public searchString: string = '',
    public includes: string[] | null = null,
    public sortBy: string = null,
    public page: number | null,
    public perPage: number | null,
    public filters: any = {},
  ) {}
}
