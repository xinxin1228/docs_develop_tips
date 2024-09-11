import { UserInfoPerService } from '../service/index.ts'

export default class UserInfoPerController {
  static UserInfoPerService: UserInfoPerService = new UserInfoPerService()

  hi() {
    const result = UserInfoPerController.UserInfoPerService.hi()
    console.log(result)
  }
}
