import { UserDatabase } from "../database/UserDatabase"
import { ConflictError } from "../errors/ConflictError"
import { NotFoundError } from "../errors/NotFoundError"
import { RequestError } from "../errors/RequestError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { ILoginInputDTO, ILoginOutputDTO, ISignupInputDTO, ISignupOutputDTO, User, USER_ROLES } from "../models/User"
import { Authenticator, ITokenPayload } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) {}

    public signup = async (input: ISignupInputDTO) => {
      const { name, email, password } = input

      if (typeof name !== "string") {
          throw new RequestError("'name' must to be a string")
      }

      if (typeof email !== "string") {
          throw new RequestError("'email' must to be a string")
      }

      if (typeof password !== "string") {
          throw new RequestError("'password' must to be a string")
      }

      if (name.length < 3) {
          throw new RequestError("'name' must have at least 3 characters")
      }

      if (password.length < 6) {
          throw new RequestError("'password' must have at least 6 characters")
      }

      if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
          throw new RequestError("invalid 'email'")
      }

      const isEmailExists = await this.userDatabase.findByEmail(email)

      if (isEmailExists) {
          throw new ConflictError("email already registered")
      }

      const id = this.idGenerator.generate()
      const hashedPassword = await this.hashManager.hash(password)

      const user = new User(
          id,
          name,
          email,
          hashedPassword,
          USER_ROLES.NORMAL
      )

      await this.userDatabase.createUser(user)

      const payload: ITokenPayload = {
          id: user.getId(),
          role: user.getRole()
      }

      const token = this.authenticator.generateToken(payload)

      const response: ISignupOutputDTO = {
          message: "registration successful",
          token
      }

      return response
  }

  public login = async (input: ILoginInputDTO) => {
    const { email, password } = input

  if (typeof email !== "string") {
      throw new RequestError("'email' must to be a string")
  }

  if (typeof password !== "string") {
      throw new RequestError("'password' must to be a string")
  }

  if (password.length < 6) {
      throw new RequestError("'password' must have at least 6 characters")
  }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        throw new RequestError("invalid 'email'")
    }

    const userDB = await this.userDatabase.findByEmail(email)

    if (!userDB) {
        throw new NotFoundError("email not registered")
    }

    const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role
    )

    const isPasswordCorrect = await this.hashManager.compare(
        password,
        user.getPassword()
    )

    if (!isPasswordCorrect) {
        throw new UnauthorizedError("incorrect password")
    }

    const payload: ITokenPayload = {
        id: user.getId(),
        role: user.getRole()
    }

    const token = this.authenticator.generateToken(payload)

    const response: ILoginOutputDTO = {
        message: "Login successfully",
        token
    }

    return response
}
} 
