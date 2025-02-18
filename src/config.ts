import dotenv from 'dotenv';

dotenv.config();

class Config {
  public DATABASE_URL: string;
  public JWT_TOKEN: string;
  public NODE_ENV: string;
  public SECRET_KEY_ONE: string;
  public SECRET_KEY_TWO: string;
  public CLIENT_URL: string;
  public REDIS_HOST: string;
  public IS_PRODUCTION: boolean;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.IS_PRODUCTION = this.NODE_ENV === 'production';
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === '') {
        throw new Error(`Configuration ${key} is missing.`);
      }
    }
  }
}

export const config: Config = new Config();
