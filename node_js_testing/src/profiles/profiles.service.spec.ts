import { ProfilesService } from './profiles.service';
import { validCreateProfileDto } from '../../test/test-data/test-data';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(() => {
    service = new ProfilesService();
  });

  describe('create', () => {
    it('should create new profile', async () => {
      const profile = await service.create(validCreateProfileDto);
      expect(profile).toHaveProperty('id');
      expect(profile).toMatchObject(validCreateProfileDto);
    });

    it('should return an error if user with email already exists', async () => {
      await service.create(validCreateProfileDto);
      await expect(service.create(validCreateProfileDto)).rejects.toThrow(
        `Profile with email ${validCreateProfileDto.email} already exists`,
      );
    });
  });

  describe('findById', () => {
    it('should find a profile by id', async () => {
      const profile = await service.create(validCreateProfileDto);
      expect(await service.findById(profile.id)).toBe(profile);
    });

    it('should return an error if user not found', async () => {
      await expect(service.findById('invalidId')).rejects.toThrow(
        'Profile with id invalidId not found',
      );
    });
  });
});
