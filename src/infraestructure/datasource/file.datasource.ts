import fs from 'fs';
import path from 'path';

export class FileDataSource {
  private dbPath: string;

  constructor() {
    // Busca el archivo en la carpeta /data dentro de la raíz del proyecto
    this.dbPath = path.resolve(process.cwd(), 'data', 'db.json');
  }

  loadData() {
    if (!fs.existsSync(this.dbPath)) {
      throw new Error(`No se encontró el archivo ${this.dbPath}`);
    }

    const data = fs.readFileSync(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }
}
