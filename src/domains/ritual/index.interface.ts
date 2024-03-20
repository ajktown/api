// TODO: There should be ISharedRitual
// export interface ISharedRitual {
//   name: string
//   actionGroupIds: string[]
// }
// export interface IRitual extends ISharedRitual {
//   id: string
//   ownerId: string
// }

export interface IRitual {
  id: string
  ownerId: string
  name: string
  orderedActionGroupIds: string[]
}

// export interface IRitualDerived {
//   actionGroupIds: string[]
// }
