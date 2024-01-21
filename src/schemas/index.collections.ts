import { SchemaTimestampsConfig } from 'mongoose'

export enum SchemaCollectionName {
  Words = `words`,
  Users = `users`,
  Supports = `supports`,
  Preferences = `preferences`,
  SharedResources = `shared-resources`,
  Actions = 'actions',
}

export enum DiscriminatorKey {
  Event = `event`,
}

export const defaultSchemaTimestampsConfig: SchemaTimestampsConfig = {
  createdAt: true,
  updatedAt: true,
}
