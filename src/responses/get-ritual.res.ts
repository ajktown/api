import { IRitual } from '@/domains/ritual/index.interface'

export type GetRitualRes = IRitual

export interface GetRitualsRes {
  rituals: GetRitualRes[]
}
