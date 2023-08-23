import { SchemaTimestampsConfig } from 'mongoose'

export enum SchemaCollectionName {
  Words = `words`,
  Users = `users`,
  Supports = `supports`,
  Preferences = `preferences`,
}

export enum DiscriminatorKey {
  Event = `event`,
}

export const defaultSchemaTimestampsConfig: SchemaTimestampsConfig = {
  createdAt: true,
  updatedAt: true,
}
