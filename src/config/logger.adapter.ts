import chalk from 'chalk';

export class LoggerAdapter {
  // Colores por método HTTP
  static method(method: string): string {
    const colors: Record<string, any> = {
      GET: chalk.green,
      POST: chalk.blue,
      PUT: chalk.yellow,
      DELETE: chalk.red,
      PATCH: chalk.magenta
    };
    return (colors[method] || chalk.white)(method.padEnd(6));
  }

  // Formatear roles
  static roles(roles: string[]): string {
    if (!roles || roles.length === 0) return chalk.gray('🌐 public');
    if (roles.includes('*')) return chalk.gray('🌐 public');
    return chalk.cyan(`🔐 [${roles.join(', ')}]`);
  }

  // Headers y separadores
  static header(text: string): string {
    return chalk.bold.cyan(text);
  }

  static separator(length: number = 60): string {
    return chalk.gray('─'.repeat(length));
  }

  static divider(length: number = 60): string {
    return chalk.gray('═'.repeat(length));
  }

  // Colecciones
  static collection(name: string, itemCount: number): string {
    return `${chalk.bold.magenta('📦')} ${chalk.bold(name)} ${chalk.gray(`(${itemCount} items)`)}`;
  }

  // Path/URL
  static path(path: string): string {
    return chalk.white(path);
  }

  // Success/Error/Info
  static success(message: string): string {
    return chalk.green(`✅ ${message}`);
  }

  static error(message: string): string {
    return chalk.red(`❌ ${message}`);
  }

  static info(message: string): string {
    return chalk.blue(`ℹ️  ${message}`);
  }

  static warning(message: string): string {
    return chalk.yellow(`⚠️  ${message}`);
  }

  // Server startup
  static serverInfo(port: number, publicPath: string): void {
    console.log('\n' + this.divider());
    console.log(chalk.bold.cyan('  ⚡ AuthJSON Server'));
    console.log(this.divider());
    console.log(chalk.green('  🚀 Server running on') + chalk.bold.white(` http://localhost:${port}`));
    console.log(chalk.gray(`  📂 Public folder: ${publicPath}`));
    console.log(chalk.gray('  🔐 JWT Authentication enabled'));
    console.log(this.divider() + '\n');
  }

  // Log de requests (middleware)
  static request(method: string, path: string, statusCode: number): string {
    const statusColor = statusCode >= 400 
      ? chalk.red 
      : statusCode >= 300 
        ? chalk.yellow 
        : chalk.green;
    
    return `${this.method(method)} ${chalk.gray(path)} ${statusColor(statusCode)}`;
  }
}