import { Request, Response } from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { BaseError } from "../errors/BaseError";
import { IBookTicketInputDTO, ICreateShowInputDTO, IGetPostsInputDTO, IRemoveLBookTicketInputDTO } from "../models/Show";

export class ShowController {
    constructor(
        private showBusiness: ShowBusiness
    ) {}

    public createShow = async (req: Request, res: Response) => {
      try {
          const input: ICreateShowInputDTO = {
              token: req.headers.authorization,
              band: req.body.band,
              starts_at: req.body.starts_at
          }

          const response = await this.showBusiness.createShow(input)
          res.status(201).send(response)
      } catch (error: unknown) {
          if (error instanceof BaseError) {
              return res.status(error.statusCode).send({ message: error.message })
          }

          res.status(500).send({ message: "unexpected error creating show" })
      }
  }

  public getShows = async (req: Request, res: Response) => {
    try {
        const response = await this.showBusiness.getShows()
        res.status(200).send(response)
    } catch (error: unknown) {
        if (error instanceof BaseError) {
            return res.status(error.statusCode).send({ message: error.message })
        }

        res.status(500).send({ message: "unexpected error searching shows" })
    }
}

public bookTickets = async (req: Request, res: Response) => {
  try {
      const input: IBookTicketInputDTO = {
          token: req.headers.authorization,
          showId: req.params.showId
      }

      const response = await this.showBusiness.bookTicket(input)
      res.status(200).send(response)
  } catch (error: unknown) {
      if (error instanceof BaseError) {
          return res.status(error.statusCode).send({ message: error.message })
      }

      res.status(500).send({ message: "unexpected error booking tickets" })
  }
}

public removeBookTicket = async (req: Request, res: Response) => {
  try {
      const input: IRemoveLBookTicketInputDTO = {
          token: req.headers.authorization,
          showId: req.params.showId
      }

      const response = await this.showBusiness.removeBookTicket(input)
      res.status(200).send(response)
  } catch (error: unknown) {
      if (error instanceof BaseError) {
          return res.status(error.statusCode).send({ message: error.message })
      }

      res.status(500).send({ message: "unexpected error remove booking tickets" })
  }
}
} 
