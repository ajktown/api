import { IRitual } from '@/domains/ritual/index.interface'

export interface GetRitualsRes {
  rituals: IRitual[]
}

export interface GetRitualByIdRes {
  ritual: IRitual
}
