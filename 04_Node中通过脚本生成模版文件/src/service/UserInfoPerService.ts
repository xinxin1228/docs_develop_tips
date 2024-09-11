import { UserInfoPerDao } from '../dao/index.ts'

export default class UserInfoPerService {
  static UserInfoPerDao: UserInfoPerDao = new UserInfoPerDao()

  hi(): string {
    return UserInfoPerService.UserInfoPerDao.hi()
  }
}
