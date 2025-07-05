import {InferType, object, string} from 'yup';

export const loginSchema = object({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

export type LoginDTO = InferType<typeof loginSchema>;
