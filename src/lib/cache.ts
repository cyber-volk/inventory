import Memcached from '../../memcached'

const memcached = new Memcached(process.env.MEMCACHED_SERVERS, {
  retry: 10000,
  retries: 5,
  timeout: 1000,
  maxValue: 1048576,
  poolSize: 10
})

export class Cache {
  private static instance: Cache
  private client: Memcached

  private constructor() {
    this.client = memcached
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache()
    }
    return Cache.instance
  }

  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err: Error | null, data: string) => {
        if (err) reject(err)
        resolve(data as T)
      })
    })
  }

  async set(key: string, value: any, ttl: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, ttl, (err: Error | null) => {
        if (err) reject(err)
        resolve(true)
      })
    })
  }

  async delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err: Error | null) => {
        if (err) reject(err)
        resolve(true)
      })
    })
  }

  async flush(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.flush((err: Error | null) => {
        if (err) reject(err)
        resolve(true)
      })
    })
  }
}

export const cache = Cache.getInstance()
