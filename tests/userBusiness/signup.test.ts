import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDatabase } from "../../src/database/UserDatabase"
import { BaseError } from "../../src/errors/BaseError"
import { ISignupInputDTO } from "../../src/models/User"
import { AuthenticatorMock } from "../mocks/services/AuthenticatorMock"
import { HashManagerMock } from "../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../mocks/services/IdGeneratorMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("testing UserBusiness", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock() as unknown as UserDatabase,
        new IdGeneratorMock(),
        new HashManagerMock(),
        new AuthenticatorMock()
    )

    test("successful signup", async () => {
        const input: ISignupInputDTO = {
            name: "lucas",
            email: "lucas@gmail.com",
            password: "lucas123"
        }

        const response = await userBusiness.signup(input)

        expect(response.message).toEqual("registration successful")
        expect(response.token).toEqual("token-mock")
    })


    test("returns error when sending 'name' with empty string", async () => {
      try {      

        const input: ISignupInputDTO = {
        name: "",
        email: "lucas@gmail.com",
        password: "lucas123"
    }

            await userBusiness.signup(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(400)
        expect(error.message).toEqual("'name' must have at least 3 characters")
        }
      }
    })

    test("returns error if 'name' is not a string", async () => {
      try {      

        const input: ISignupInputDTO = {
        name: undefined,
        email: "lucas@gmail.com",
        password: "lucas123"
    } as unknown as ISignupInputDTO

          await userBusiness.signup(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(400)
        expect(error.message).toEqual("'name' must to be a string")
        }
      }
    })


    test("returns error if email already existe", async () => {
      try {      

        const input: ISignupInputDTO = {
        name: "lucas",
        email: "astrodev@gmail.com",
        password: "lucas123"
    } as unknown as ISignupInputDTO

          await userBusiness.signup(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(409)
        expect(error.message).toEqual("email already registered")
        }
      }
    })

  })