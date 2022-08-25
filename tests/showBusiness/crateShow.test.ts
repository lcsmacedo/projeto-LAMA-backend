import { ShowBusiness } from "../../src/business/ShowBusiness"
import { ShowDatabaseMock } from "../mocks/ShowDatabaseMock"
import { IdGeneratorMock } from "../mocks/services/IdGeneratorMock"
import { HashManagerMock } from "../mocks/services/HashManagerMock"
import { AuthenticatorMock } from "../mocks/services/AuthenticatorMock"
import { BaseError } from "../../src/errors/BaseError"
import { ShowDatabase } from "../../src/database/ShowDatabase"
import { ICreateShowInputDTO } from "../../src/models/Show"

describe("testing ShowBusiness", () => {
    const showBusiness = new ShowBusiness(
        new ShowDatabaseMock() as unknown as ShowDatabase,
        new IdGeneratorMock(),
        new HashManagerMock(),
        new AuthenticatorMock()
    )

    test("create show successful", async () => {
        const input: ICreateShowInputDTO = {
            token: "token-astrodev",
            band: "system of down",
            starts_at: "2022/12/11"
        }

        const response = await showBusiness.createShow(input)

        expect(response.message).toEqual("show created successfully")
        expect(response.show.getId()).toEqual("id-mock")
        expect(response.show.getBand()).toEqual("system of down")
    })


    test("returns error when sending invalid starts-at", async () => {
      try {      
        const input: ICreateShowInputDTO = {
          token: "token-astrodev",
          band: "pink",
          starts_at: "2022/12/04"
      }


         await showBusiness.createShow(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(400)
        expect(error.message).toEqual("the date of the show cannot be earlier than the start of the festival")
        }
      }
    })

    test("returns error when existe more tahn one show at starts-at", async () => {
      try {      
        const input: ICreateShowInputDTO = {
          token: "token-astrodev",
          band: "pink",
          starts_at: "2022/12/05"
      }

         await showBusiness.createShow(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(401)
        expect(error.message).toEqual( "there can only be one show per day during the event")
        }
      }
    })

    test("returns error when normal user create a show", async () => {
      try {      
        const input: ICreateShowInputDTO = {
          token: "token-mock",
          band: "pink",
          starts_at: "2022/12/10"
      }
      
         await showBusiness.createShow(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(401)
        expect(error.message).toEqual("only admins can create shows")
        }
      }
    })

  }) 
