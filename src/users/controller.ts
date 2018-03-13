import { JsonController, Post, HttpCode, Get, Param, Put, Body, NotFoundError } from 'routing-controllers'
import User from './entity'

@JsonController()
export default class UserController {

  @Get('/users')
  async allUsers() {
    const users = await User.find()
    return { users }
  }

  @Get('/users/:id')
  getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Put('/users/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updates: Partial<User>
  ) {
    const user = await User.findOneById(id)
    if (!user) throw new NotFoundError('Cannot find user')

    return User.merge(user, updates).save()
  }

  @Post('/users')
  @HttpCode(201)
  async createPage(
    @Body() user: User
  ) {
    const { password, ...rest } = user
    const entity = User.create(rest)
    await entity.setPassword(password)
    return entity.save()
  }
}