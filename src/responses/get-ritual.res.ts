import { IRitualActionGroup } from '@/domains/ritual_action_group/index.interface'

export interface GetRitualsRes {
  rituals: IRitualActionGroup[]
}

export interface GetRitualByIdRes {
  ritual: IRitualActionGroup
}
