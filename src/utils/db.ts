interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  predictions_count: number;
  created_at: string;
  last_prediction?: string;
}

class Database {
  private static instance: Database;
  private users: Map<number, UserData>;

  private constructor() {
    this.users = new Map();
    this.loadFromLocalStorage();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('tarot_users');
      if (data) {
        const parsed = JSON.parse(data);
        this.users = new Map(Object.entries(parsed).map(([key, value]) => [Number(key), value as UserData]));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      const data = Object.fromEntries(this.users);
      localStorage.setItem('tarot_users', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  public getUser(userId: number): UserData | undefined {
    return this.users.get(userId);
  }

  public createOrUpdateUser(userData: Pick<UserData, 'id' | 'first_name'> & Partial<Omit<UserData, 'id' | 'first_name' | 'predictions_count' | 'created_at'>>): UserData {
    const existingUser = this.users.get(userData.id);
    const updatedUser: UserData = {
      id: userData.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      photo_url: userData.photo_url,
      predictions_count: existingUser?.predictions_count || 0,
      created_at: existingUser?.created_at || new Date().toISOString(),
      last_prediction: existingUser?.last_prediction
    };
    this.users.set(userData.id, updatedUser);
    this.saveToLocalStorage();
    return updatedUser;
  }

  public incrementPredictionCount(userId: number): void {
    const user = this.users.get(userId);
    if (user) {
      user.predictions_count += 1;
      user.last_prediction = new Date().toISOString();
      this.users.set(userId, user);
      this.saveToLocalStorage();
    }
  }

  public getPredictionCount(userId: number): number {
    return this.users.get(userId)?.predictions_count || 0;
  }
}

export const db = Database.getInstance(); 