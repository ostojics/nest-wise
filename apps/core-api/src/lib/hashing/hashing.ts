import * as argon2 from 'argon2';

/**
 * Hashes a plaintext password using Argon2.
 *
 * @param password Plaintext password to hash.
 * @returns Promise that resolves to the Argon2-encoded hash string.
 */
export const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};

/**
 * Verifies a plaintext password against an Argon2-encoded hash.
 *
 * @param password Plaintext password to verify.
 * @param hash Argon2-encoded hash string to compare against.
 * @returns Promise that resolves to true if the password matches; otherwise false.
 */
export const verifyPassword = async (password: string, hash: string) => {
  return await argon2.verify(hash, password);
};
