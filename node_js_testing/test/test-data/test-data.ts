import { CreateProfileDto } from '../../src/profiles/dto/create-profile.dto';

export const validCreateProfileDto: CreateProfileDto = {
  age: 10,
  displayName: 'testUser',
  email: 'testuser@mail.com',
};

export const createProfileDtoWithInvalidEmail: CreateProfileDto = {
  age: 10,
  displayName: 'testUser',
  email: 'testusermail.com',
};
