import { time } from "console";
import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) like :title", {
        title: `%${param.toLowerCase()}%`,
      })
      .getMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(games.id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return (
      await this.repository
        .createQueryBuilder("games")
        .where("games.id = :id", { id })
        .leftJoinAndSelect("games.users", "users")
        .getMany()
    )[0].users;

    // Complete usando query builder
  }
}
