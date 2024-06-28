// TODO: There should be ISharedRitual
// export interface ISharedRitual {
//   name: string
//   actionGroupIds: string[]
// }
// export interface IRitual extends ISharedRitual {
//   id: string
//   ownerId: string
// }

// TODO: There should be only IRitual that actually requires actionGroupIds all the time.
export interface IRitual {
  id: string
  ownerId: string
  name: string
  orderedActionGroupIds: string[]
}

export interface IParentRitual extends IRitual {
  actionGroupIds: string[]
  archivedActionGroupSet: Set<string>
}
