import { ShowDatabase } from "../database/ShowDatabase";
import { NotFoundError } from "../errors/NotFoundError";
import { RequestError } from "../errors/RequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  IBookTicketInputDTO,
  IBookTicketOutputDTO,
  ICreateShowInputDTO,
  ICreateShowOutputDTO,
  IGetPostsInputDTO,
  IGetShowsOutputDTO,
  IRemoveeBookTicketOutputDTO,
  IRemoveLBookTicketInputDTO,
  ITicketDB,
  Show,
} from "../models/Show";
import { USER_ROLES } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
  constructor(
    private showDatabase: ShowDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}

  public createShow = async (input: ICreateShowInputDTO) => {
    const { token, band, starts_at } = input;

    const payload = this.authenticator.getTokenPayload(token);

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError("only admins can create shows");
    }

    if (starts_at < "2022/12/05") {
      throw new RequestError("the date of the show cannot be earlier than the start of the festival");
    }

    const showDB = await this.showDatabase.findBandByDate(starts_at);

    if (showDB.length > 1) {
      throw new UnauthorizedError(
        "there can only be one show per day during the event"
      );
    }

    if (!payload) {
      throw new UnauthorizedError("not authenticated");
    }

    if (typeof band !== "string") {
      throw new RequestError("invalid 'band' parameter");
    }

    if (band.length < 1) {
      throw new RequestError("'band' needs at least one character");
    }

    const id = this.idGenerator.generate();

    const show = new Show(id, band, new Date(starts_at));

    await this.showDatabase.createShow(show);

    const response: ICreateShowOutputDTO = {
      message: "show created successfully",
      show,
    };

    return response;
  };

  public getShows = async (showId?:string) => {
    const showsDB = await this.showDatabase.getShows(showId);

    const shows = showsDB.map((showDB) => {
      return new Show(showDB.id, showDB.band, showDB.starts_at);
    });

    for (let show of shows) {
      const showId = show.getId();
      const tickets = await this.showDatabase.getTickets(showId);
      show.setTickets(5000 - tickets);
    }

    const response: IGetShowsOutputDTO = {
      shows,
    };

    return response;
  };

  public bookTicket = async (input: IBookTicketInputDTO) => {
    const { token, showId } = input;

    const payload = this.authenticator.getTokenPayload(token);

    if (!payload) {
      throw new UnauthorizedError("not authenticated");
    }

    const showDB = await this.showDatabase.findBandById(showId);

    if (showDB.length < 1) {
      throw new NotFoundError("show not found");
    }

    const isAlreadyReserved = await this.showDatabase.findTicket(
      showId,
      payload.id
    );

    if (isAlreadyReserved) {
      throw new RequestError("ticket has already been booked");
    }

    const showTickets = await this.getShows(showId)
    const numberOfTickets = showTickets.shows

    if (numberOfTickets[0].getTickets() < 0) {
      throw new RequestError("ticket sold out");
    }

    const ticketDB: ITicketDB = {
      id: this.idGenerator.generate(),
      show_id: showId,
      user_id: payload.id,
    };

    await this.showDatabase.bookTicket(ticketDB);

    const response: IBookTicketOutputDTO = {
      message: "ticket booked successfully",
    };

    return response;
  };

  public removeBookTicket = async (input: IRemoveLBookTicketInputDTO) => {
    const { token, showId } = input

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
        throw new UnauthorizedError("not authenticated")
    }
    
    const showDB = await this.showDatabase.findBandById(showId)
    


    if (!showDB) {
        throw new NotFoundError("show does not found")
    }

    const isAlreadyReserved = await this.showDatabase.findTicket(
      showId,
      payload.id
    );

    if (!isAlreadyReserved) {
      throw new RequestError("ticket has not been booked");
    }

    await this.showDatabase.removeTicket(showId, payload.id)

    const response: IRemoveeBookTicketOutputDTO = {
        message: "ticket removed successfully"
    }

    return response
}
} 