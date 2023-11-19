import { UserBuilder } from './user.builder';

export class UserFactory {
  static create(builderCallback: (builder: UserBuilder) => void) {
    const builderInstance = new UserBuilder();
    builderCallback(builderInstance);
    const result = builderInstance.build();
    return result;
  }
}
