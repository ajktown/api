import { SchemaTimestampsConfig } from 'mongoose'

export enum SchemaCollectionName {
  DeprecatedWords = `words`,
  DeprecatedUser = `users`,
}

export enum DiscriminatorKey {
  Event = `event`,
}

export const defaultSchemaTimestampsConfig: SchemaTimestampsConfig = {
  createdAt: true,
  updatedAt: true,
}
