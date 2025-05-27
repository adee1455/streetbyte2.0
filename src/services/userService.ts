import { query } from '@/lib/db';

interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  auth_provider: string;
  created_at: Date;
}

export const createOrGetUser = async (userData: {
  name: string;
  email: string;
  image?: string;
  auth_provider: string;
}): Promise<User> => {
  try {
    // First check if user exists
    const existingUser = await query({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [userData.email],
    }) as User[];

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // Generate a simple ID (timestamp + random number)
    const id = Date.now() + Math.floor(Math.random() * 1000);

    // If user doesn't exist, create new user
    await query({
      query: `
        INSERT INTO users (id, name, email, image, auth_provider, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `,
      values: [
        id,
        userData.name,
        userData.email,
        userData.image || null,
        userData.auth_provider,
      ],
    });

    // Return the newly created user
    return {
      id,
      name: userData.name,
      email: userData.email,
      image: userData.image || null,
      auth_provider: userData.auth_provider,
      created_at: new Date()
    };
  } catch (error) {
    console.error('Error in createOrGetUser:', error);
    throw error;
  }
};

export const getUserProfile = async (email: string): Promise<User | null> => {
  try {
    const result = await query({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [email],
    }) as User[];

    return result[0] || null;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}; 