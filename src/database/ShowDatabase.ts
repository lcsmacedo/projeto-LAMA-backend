import { IShowDB, ITicketDB, Show } from "../models/Show";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  public static TABLE_SHOWS = "Lama_Shows";
  public static TABLE_TICKETS = "Lama_Tickets";

  public toShowDBModel = (show: Show) => {
    const showDB: IShowDB = {
      id: show.getId(),
      band: show.getBand(),
      starts_at: show.getStartsAt(),
    };

    return showDB;
  };

  public createShow = async (show: Show) => {
    const showDB = this.toShowDBModel(show);

    await BaseDatabase.connection(ShowDatabase.TABLE_SHOWS).insert(showDB);
  };

  public getShows = async (showId?:string) => {
   if (showId){
    const showsDB: IShowDB[] = await BaseDatabase.connection(
      ShowDatabase.TABLE_SHOWS
    ).select().where("id","=",showId);

    return showsDB;
   }
   
    const showsDB: IShowDB[] = await BaseDatabase.connection(
      ShowDatabase.TABLE_SHOWS
    ).select()

    return showsDB;
  };


  public getTickets = async (showId: string) => {
    const result: any = await BaseDatabase.connection(
      ShowDatabase.TABLE_TICKETS
    )
      .select()
      .count("id AS tickets")
      .where({ show_id: showId });


    return result[0].tickets as number;
  };

  public findBandByDate = async (starts_at: string): Promise<IShowDB[] | undefined> => {
    const showsDB: IShowDB[] = await BaseDatabase
        .connection(ShowDatabase.TABLE_SHOWS)
        .select()
        .where({ starts_at: starts_at })

    return showsDB
}


  public findBandById = async (showId: string): Promise<IShowDB[] | undefined> => {
    const showsDB: IShowDB[] = await BaseDatabase
        .connection(ShowDatabase.TABLE_SHOWS)
        .select()
        .where({ id: showId })
    return showsDB
}

public findTicket = async (showId: string, userId: string): Promise<ITicketDB | undefined> => {
  const ticketsDB: ITicketDB[] = await BaseDatabase
      .connection(ShowDatabase.TABLE_TICKETS)
      .select()
      .where({ show_id: showId })
      .andWhere({ user_id: userId })

  return ticketsDB[0]
}

public bookTicket = async (ticketDB: ITicketDB) => {
  await BaseDatabase
      .connection(ShowDatabase.TABLE_TICKETS)
      .insert(ticketDB)
}

public removeTicket = async (showId: string, userId: string) => {
  await BaseDatabase
      .connection(ShowDatabase.TABLE_TICKETS)
      .delete()
      .where({ show_id: showId })
      .andWhere({ user_id: userId })
}
} 

