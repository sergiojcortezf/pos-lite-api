import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './config/data-source';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.connectDb();
  }

  private config(): void {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    // Ruta de prueba
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send('API POS-Lite está corriendo!');
    });

  }

  private async connectDb(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('Conexión a la base de datos establecida.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      process.exit(1);
    }
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  }
}