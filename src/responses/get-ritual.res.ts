import { IParentRitual, IRitual } from '@/domains/ritual/index.interface'

export interface GetRitualsRes {
  rituals: IParentRitual[]
}

export interface GetRitualByIdRes {
  ritual: IRitual
}
