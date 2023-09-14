import { NotificationBuilder } from '../builder/notification.builder';

export class NotificationFactory {
  static create(builderCallback: (builder: NotificationBuilder) => void) {
    const builderInstance = new NotificationBuilder();
    builderCallback(builderInstance);
    const result = builderInstance.build();
    return result;
  }
}
