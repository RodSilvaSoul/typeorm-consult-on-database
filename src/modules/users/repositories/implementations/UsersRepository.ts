import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const result = await this.repository.findOne({
      where: {
        id: user_id,
      },
      relations: ["games"],
    });

    return result as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      "SELECT * FROM users ORDER BY users.first_name"
    );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(
      `SELECT * FROM users 
       WHERE LOWER(users.first_name) = LOWER('${first_name}') 
       AND LOWER(users.last_name) = LOWER('${last_name}')`
    ); // Complete usando raw query
  }
}
