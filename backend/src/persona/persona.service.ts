import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async create(createPersonaDto: CreatePersonaDto): Promise<Persona> {
    const persona = this.personaRepository.create(createPersonaDto);

    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      this.throwIfConstraintConflict(error);
    }
  }

  findAll(): Promise<Persona[]> {
    return this.personaRepository.find({
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Persona> {
    const persona = await this.personaRepository.findOneBy({ id_persona: id });
    if (!persona) {
      throw new NotFoundException(`No existe la persona ${id}`);
    }

    return persona;
  }

  async update(
    id: string,
    updatePersonaDto: UpdatePersonaDto,
  ): Promise<Persona> {
    const persona = await this.findOne(id);
    this.personaRepository.merge(persona, updatePersonaDto);

    try {
      return await this.personaRepository.save(persona);
    } catch (error) {
      this.throwIfConstraintConflict(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.personaRepository.delete({ id_persona: id });
      if (!result.affected) {
        throw new NotFoundException(`No existe la persona ${id}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.throwIfConstraintConflict(error);
    }
  }

  private throwIfConstraintConflict(error: unknown): never {
    if (error instanceof QueryFailedError) {
      if (error.driverError.code === '23505') {
        throw new ConflictException(
          'Ya existe una persona con esa identificación',
        );
      }

      if (error.driverError.code === '23503') {
        throw new ConflictException(
          'La persona tiene registros relacionados y no puede eliminarse',
        );
      }
    }

    throw error;
  }
}
