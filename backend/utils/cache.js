import { getRedisClient } from '../config/redis.js';

const TTL = 300; // 5 minutes

// Read from cache → returns parsed data or null
export const getCache = async (key) => {
  try {
    const client = getRedisClient();
    if (!client || client.status !== 'ready') return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Cache GET error [${key}]:`, error.message);
    return null; // Redis down → graceful fallback
  }
};

// Write to cache with TTL
export const setCache = async (key, value, ttl = TTL) => {
  try {
    const client = getRedisClient();
    if (!client || client.status !== 'ready') return;
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (error) {
    console.error(`Cache SET error [${key}]:`, error.message);
  }
};

// Delete one or more keys (used on create/update/delete)
export const deleteCache = async (keys) => {
  try {
    const client = getRedisClient();
    if (!client || client.status !== 'ready') return;
    const keyList = Array.isArray(keys) ? keys : [keys];
    await client.del(...keyList);
  } catch (error) {
    console.error(`Cache DEL error [${keys}]:`, error.message);
  }
};
