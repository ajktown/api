import { AccessTokenDomain } from '../auth/access-token.domain'
import { IMeal } from './index.interface'
import { NotExistOrNoPermissionError } from '@/errors/404/not-exist-or-no-permission.error'
import { DeleteForbiddenError } from '@/errors/403/action_forbidden_errors/delete-forbidden.error'
import { UpdateForbiddenError } from '@/errors/403/action_forbidden_errors/update-forbidden.error'
import { MealDoc, MealModel, MealProps } from '@/schemas/meal.schema'
import { PatchMealBodyDTO } from '@/dto/meal.patch.dto'
import { PostMealBodyDTO } from '@/dto/meal.post.dto'

export class MealDomain {
  private readonly props: IMeal

  private constructor(props: IMeal) {
    this.props = props
  }

  get id() {
    return this.props.id
  }

  /**
   * Creates a new meal domain and saves it to the database.
   * @returns The created MealDomain instance from the database.
   */
  static async create(
    atd: AccessTokenDomain,
    dto: PostMealBodyDTO,
    model: MealModel,
  ): Promise<MealDomain> {
    const meal = new MealDomain({
      // A temporary ID for the constructor, will be replaced by the DB one.
      id: 'temp-id',
      ownerId: atd.userId,
      name: dto.name,
      amount: dto.amount,
      unit: dto.unit,
      labels: dto.labels,
      kcal: dto.kcal,
      ingredients: {
        protein: dto.protein,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newDoc = await meal.toDoc(model).save()
    return MealDomain.fromMdb(newDoc)
  }

  /**
   * Fetches a single meal by its ID, ensuring the user has permission.
   * @throws NotExistOrNoPermissionError if the meal doesn't exist or the user is not the owner.
   */
  static async findById(
    id: string,
    atd: AccessTokenDomain,
    model: MealModel,
  ): Promise<MealDomain> {
    const doc = await model.findById(id).exec()
    if (!doc || doc.ownerID !== atd.userId)
      throw new NotExistOrNoPermissionError()

    return MealDomain.fromMdb(doc)
  }

  /**
   * Fetches all meals owned by the user.
   */
  static async findAllByOwner(
    atd: AccessTokenDomain,
    model: MealModel,
  ): Promise<MealDomain[]> {
    const docs = await model.find({ ownerID: atd.userId }).exec()
    return docs.map(MealDomain.fromMdb)
  }

  /**
   * Creates a MealDomain instance from a Mongoose document.
   */
  static fromMdb(doc: MealDoc): MealDomain {
    return new MealDomain({
      id: doc.id,
      ownerId: doc.ownerID,
      name: doc.name,
      amount: doc.amount,
      unit: doc.unit,
      labels: doc.labels,
      kcal: doc.kcal,
      ingredients: {
        protein: doc.ingredients.protein,
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })
  }

  /**
   * Converts the domain object into a new Mongoose document.
   */
  toDoc(mealModel: MealModel): MealDoc {
    const mealProps: MealProps = {
      ownerID: this.props.ownerId,
      name: this.props.name,
      amount: this.props.amount,
      unit: this.props.unit,
      labels: this.props.labels,
      kcal: this.props.kcal,
      ingredients: this.props.ingredients,
    }
    return new mealModel(mealProps)
  }

  /**
   * Converts the domain object to a Response DTO.
   */
  toResDTO(): IMeal {
    return this.props
  }

  /**
   * Updates the meal record in the database.
   * @throws UpdateForbiddenError if the user is not the owner.
   */
  async update(
    atd: AccessTokenDomain,
    dto: PatchMealBodyDTO,
    model: MealModel,
  ): Promise<MealDomain> {
    if (atd.userId !== this.props.ownerId) {
      throw new UpdateForbiddenError(atd, `Meal`)
    }

    const updatedDoc = await model
      .findByIdAndUpdate(this.id, dto, { new: true })
      .exec()
    return MealDomain.fromMdb(updatedDoc)
  }

  /**
   * Deletes the meal record from the database.
   * @throws DeleteForbiddenError if the user is not the owner.
   */
  async delete(atd: AccessTokenDomain, model: MealModel): Promise<void> {
    if (atd.userId !== this.props.ownerId) {
      throw new DeleteForbiddenError(atd, `Meal`)
    }
    await model.findByIdAndDelete(this.props.id).exec()
  }
}