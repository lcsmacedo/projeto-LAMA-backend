import { ShowBusiness } from "../../src/business/ShowBusiness"
import { ShowDatabaseMock } from "../mocks/ShowDatabaseMock"
import { IdGeneratorMock } from "../mocks/services/IdGeneratorMock"
import { HashManagerMock } from "../mocks/services/HashManagerMock"
import { AuthenticatorMock } from "../mocks/services/AuthenticatorMock"
import { BaseError } from "../../src/errors/BaseError"
import { ShowDatabase } from "../../src/database/ShowDatabase"
import { IBookTicketInputDTO, ICreateShowInputDTO } from "../../src/models/Show"

describe("testing ShowBusiness", () => {
    const showBusiness = new ShowBusiness(
        new ShowDatabaseMock() as unknown as ShowDatabase,
        new IdGeneratorMock(),
        new HashManagerMock(),
        new AuthenticatorMock()
    )

    test("booking ticket show successful", async () => {
      const input: IBookTicketInputDTO = {
        token: "token-fulano",
        showId: "202"
    }  

        const response = await showBusiness.bookTicket(input)

        expect(response.message).toEqual("ticket booked successfully")
    })


    test("returns an error when it can't find the show", async () => {
      try {      
        const input: IBookTicketInputDTO = {
          token: "token-fulano",
          showId: "204"
      }  

         await showBusiness.bookTicket(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(404)
        expect(error.message).toEqual("show not found")
        }
      }
    })

    test("returns an error when it can't find the show", async () => {
      try {      
        const input: IBookTicketInputDTO = {
          token: "token-astrodev",
          showId: "201"
      }  

         await showBusiness.bookTicket(input)

      } catch (error:unknown) {
        if(error instanceof BaseError){
        expect(error.statusCode).toEqual(400)
        expect(error.message).toEqual("ticket has already been booked")
        }
      }
    })

  })
