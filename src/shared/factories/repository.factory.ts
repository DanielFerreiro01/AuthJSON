import { FileDataSource } from "../../infraestructure/datasource/file.datasource";
import { DynamicRepository } from "../../infraestructure/repositories/dynamic.repository";

export class RepositoryFactory {
  private static instance: DynamicRepository;

  static getInstance(): DynamicRepository {
    if (!this.instance) {
      const datasource = new FileDataSource();
      const data = datasource.loadData();
      this.instance = new DynamicRepository(data);
    }
    return this.instance;
  }

  
}
