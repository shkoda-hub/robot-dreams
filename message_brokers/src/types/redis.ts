export enum RedisStreamKey {
  NOTIFICATIONS_STREAM = 'events.notifications',
  NOTIFICATIONS_GROUP = 'notifications-group',
}

export type RedisStreamEntry<T> = [id: string, fields: T];

export type RedisStreamBatch<T> = [
  stream: string,
  entries: RedisStreamEntry<T>[],
];
