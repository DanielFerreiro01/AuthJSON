import { DynamicRepository } from "../../infraestructure/repositories/dynamic.repository";
import { JWTAdapter, bcryptAdapter } from "../../config";
import { User } from "../../domain/entities/user.entity";

export class AuthService {
  constructor(private readonly repository: DynamicRepository) {}

  public async registerUser(user: { email: string; password: string; role?: string }) {
    const users = this.repository.getCollection("users") as User[]; // aquí especificamos el tipo
    if (users.find((u: User) => u.email === user.email)) {
      throw new Error("Email already in use");
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: user.email,
      password: await bcryptAdapter.hash(user.password),
      role: user.role || "user",
    };

    this.repository.create("users", newUser);
    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }

  public async loginUser(email: string, password: string) {
    const users = this.repository.getCollection("users") as User[];
    const user = users.find((u: User) => u.email === email);
    if (!user) throw new Error("User not found");

    const isValid = await bcryptAdapter.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");

    const token = await JWTAdapter.generateToken({ id: user.id, role: user.role });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
