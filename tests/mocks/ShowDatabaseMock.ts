import { BaseDatabase } from "../../src/database/BaseDatabase"
import { IShowDB, ITicketDB, Show } from "../../src/models/Show"

export class ShowDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = "Labook_Posts"
    public static TABLE_LIKES = "Labook_Likes"

    public toShowDBModel = (show: Show) => {
      const showDB: IShowDB = {
          id: show.getId(),
          band: show.getBand(),
          starts_at: show.getStartsAt()
      }

      return showDB
  }

    public createShow = async (show: Show) => {

  }

  public getShows = async (showId?:string) => {
    const shows: IShowDB[] = [
      {
          id: "201",
          band: "Foo Fighters",
          starts_at: new Date("2022/12/05")
      },
      {
          id: "202",
          band: "System of a Down",
          starts_at: new Date("2022/12/06")
      },
      {
          id: "203",
          band: "Evanescence",
          starts_at: new Date("2022/12/07")
      },
  ]

    return shows;
  };

  public getTickets = async (showId: string) => {
    const result: any = [
      { tickets: 3 },
      { tickets: 2 },
      { tickets: 1 },
    ]
    return result;
  };

  public findBandByDate = async (starts_at: string): Promise<IShowDB[] | undefined> => {
    switch(starts_at) {
      default:
          return []
  }
}

public findBandById = async (showId: string): Promise<IShowDB[] | undefined> => {
  switch(showId) {
    case "201" :
      return {
      id: "201",
      band: "Foo Fighters",
      starts_at: new Date("2022/12/05")
    } as unknown as IShowDB[]
    case "202" :
      return {
      id: "202",
      band: "System of a Down",
      starts_at: new Date("2022/12/06")
    } as unknown as IShowDB[]
    default:
        return []
}
}

public findTicket = async (showId: string, userId: string) => {
  switch(showId) {
    case "201":
        return userId === "101" ? {
            id: "301",
            show_id: "201",
            user_id: "101"
        } as ITicketDB : undefined
        case "202":
          return userId === "103" ? {
              id: "301",
              show_id: "201",
              user_id: "101"
          } as ITicketDB : undefined
    default:
        return undefined
}
}

public bookTicket = async (ticketDB: ITicketDB) => {

}

public removeTicket = async (showId: string, userId: string) => {

}

}

