import { LoggerAdapter } from '../../config';

export class RouteLogger {
  static logCollection(name: string, itemCount: number): void {
    console.log(`\n${LoggerAdapter.collection(name, itemCount)}`);
  }

  static logRoute(method: string, path: string, roles: string[]): void {
    const coloredMethod = LoggerAdapter.method(method);
    const formattedPath = LoggerAdapter.path(path);
    const formattedRoles = LoggerAdapter.roles(roles);
    console.log(`   ${coloredMethod} ${formattedPath} ${formattedRoles}`);
  }

  static logHeader(): void {
    console.log('\n' + LoggerAdapter.header('🔗 Dynamic Routes Generated'));
    console.log(LoggerAdapter.separator());
  }

  static logFooter(): void {
    console.log(LoggerAdapter.separator() + '\n');
  }
}