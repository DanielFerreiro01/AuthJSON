import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  router: Router;
  public_path?: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly router: Router;

  constructor(options: Options) {
    const { port, router, public_path = "public" } = options;
    this.port = port;
    this.router = router;
    this.publicPath = public_path;
  }

  async start() {

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(express.static(this.publicPath));

    this.app.use(this.router);

    this.app.get(/.*/, (req, res) => {
      const indexPath = path.resolve(this.publicPath, "index.html");
      res.sendFile(indexPath);
    });

    this.app.listen(this.port);
  }
}