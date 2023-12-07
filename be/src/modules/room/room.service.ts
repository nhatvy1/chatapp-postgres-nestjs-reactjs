import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Room } from './room.entity'
import { Repository } from 'typeorm'
import { CreateRoomDto } from './dto/create.room.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService
  ) {}

  getRoomById(id: number) {
    return this.roomRepository.findOneBy({ id })
  }

  async createRoom(createRoomDto: CreateRoomDto, user: any) {
    const user1 = await this.userService.findUserById(user.userId)
    const user2 = await this.userService.findUserById(createRoomDto.member)

    const room = this.roomRepository.create({
      title: createRoomDto.title,
      description: createRoomDto.description,
      // owner: { id: user.userId },
      members: [user1, user2]
    })

    // room.members = [user.userId, createRoomDto.member]
    await this.roomRepository.save(room)

    return room
  }
}
