import { UserBusiness } from "../../src/business/UserBusiness"
import { BaseError } from "../../src/errors/BaseError"
import { ILoginInputDTO } from "../../src/models/User"
import { AuthenticatorMock } from "../mocks/services/AuthenticatorMock"
import { HashManagerMock } from "../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../mocks/services/IdGeneratorMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("Testing UserBusiness", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new HashManagerMock(),
        new AuthenticatorMock()
    )

    test("successful login", async () => {
        const input: ILoginInputDTO = {
            email: "astrodev@gmail.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)

        expect(response.message).toEqual("Login successfully")
        expect(response.token).toEqual("token-astrodev")
    })

    test("returns error when sending invalid 'email'", async () => {
      try {      

        const input: ILoginInputDTO = {
        email: "lucasgmail.com",
        password: "alice99"
    }

         await userBusiness.login(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(400)
        expect(error.message).toEqual("invalid 'email'")
        }
      }
    })


    test("returns error when password is invalid", async () => {
      try {      

        const input: ILoginInputDTO = {
        email: "astrodev@gmail.com",
        password: "bnaninha"
    }

         await userBusiness.login(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(401)
        expect(error.message).toEqual("incorrect password")
        }
      }
    })

}) 