import fs from "fs";
import path from "path";
import { PaginationDto } from "../../domain/dtos/pagination.dto";

export class DynamicRepository {
  private dbPath: string;

  constructor(private data: any) {
    this.dbPath = path.resolve(process.cwd(), "data", "db.json");
  }

  public getData() {
    return this.data;
  }

  private persist() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), "utf-8");
  }

  private getCollectionNode(collectionName: string) {
    if (!this.data.collections) this.data.collections = {};
    if (!this.data.collections[collectionName]) {
      this.data.collections[collectionName] = { data: [], permissions: {} };
    }
    return this.data.collections[collectionName].data;
  }

  getCollection(collectionName: string) {
    return this.getCollectionNode(collectionName);
  }

  getById(collectionName: string, id: string) {
    const collection = this.getCollectionNode(collectionName);
    return collection.find((item: any) => item.id === id);
  }

  create(collectionName: string, item: any) {
    const collection = this.getCollectionNode(collectionName);
    const newItem = { id: Date.now().toString(), ...item };
    collection.push(newItem);
    this.persist();
    return newItem;
  }

  update(collectionName: string, id: string, item: any) {
    const collection = this.getCollectionNode(collectionName);
    const index = collection.findIndex((e: any) => e.id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...item };
    this.persist();
    return collection[index];
  }

  delete(collectionName: string, id: string) {
    const collection = this.getCollectionNode(collectionName);
    const index = collection.findIndex((e: any) => e.id === id);
    if (index === -1) return null;
    const deleted = collection.splice(index, 1);
    this.persist();
    return deleted[0];
  }

  getPaginatedCollection(collectionName: string, paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  const collection = this.getCollectionNode(collectionName);

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = collection.slice(start, end);

  return {
    data: paginatedData,
    total: collection.length,
    page,
    limit,
    totalPages: Math.ceil(collection.length / limit),
  };
}

}
