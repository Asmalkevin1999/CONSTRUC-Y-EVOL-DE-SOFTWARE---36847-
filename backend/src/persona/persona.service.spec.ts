import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './entities/persona.entity';
import { PersonaService } from './persona.service';

describe('PersonaService', () => {
  let service: PersonaService;
  let repository: jest.Mocked<
    Pick<Repository<Persona>, 'create' | 'save' | 'find' | 'findOneBy' | 'delete'>
  >;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };
    service = new PersonaService(repository as Repository<Persona>);
  });

  it('reports a conflict when the identification is already registered', async () => {
    const dto = {
      nombres: 'Ana',
      apellidos: 'Perez',
      identificacion: 'PRUEBA-001',
      correo: 'ana@example.com',
    } satisfies CreatePersonaDto;
    const persona: Persona = {
      ...dto,
      id_persona: 'c2fb0347-a4f4-4d4d-a570-1e4d06be0a4a',
      telefono: null,
      estado: true,
    };
    const duplicateError = new QueryFailedError(
      'INSERT INTO persona',
      [],
      { code: '23505' },
    );
    repository.create.mockReturnValue(persona);
    repository.save.mockRejectedValue(duplicateError);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('reports a not-found response for an unknown UUID', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
