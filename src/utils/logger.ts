/**
 * Logger utilitário seguro
 * 
 * SEGURANÇA:
 * - Logs só aparecem em ambiente de desenvolvimento
 * - Evita vazamento de informações sensíveis em produção
 * - Console.logs em produção podem expor dados a atacantes
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface LoggerConfig {
  enabled: boolean;
  prefix?: string;
}

const config: LoggerConfig = {
  enabled: process.env.NODE_ENV === "development",
  prefix: "[ByteBank]",
};

/**
 * Cria uma função de log condicional
 */
const createLogFunction = (level: LogLevel) => {
  return (...args: unknown[]): void => {
    if (config.enabled) {
      const prefix = config.prefix ? `${config.prefix} ` : "";
      console[level](prefix, ...args);
    }
  };
};

/**
 * Logger seguro - só exibe logs em desenvolvimento
 * 
 * @example
 * import { logger } from '@/utils/logger';
 * 
 * logger.log("Dados carregados:", data);
 * logger.error("Erro ao processar:", error);
 * logger.warn("Token expirando em breve");
 */
export const logger = {
  log: createLogFunction("log"),
  info: createLogFunction("info"),
  warn: createLogFunction("warn"),
  error: createLogFunction("error"),
  debug: createLogFunction("debug"),
  
  /**
   * Log de grupo (útil para debugging complexo)
   */
  group: (label: string, fn: () => void): void => {
    if (config.enabled) {
      console.group(`${config.prefix} ${label}`);
      fn();
      console.groupEnd();
    }
  },

  /**
   * Log de tabela (útil para arrays/objetos)
   */
  table: (data: unknown): void => {
    if (config.enabled) {
      console.table(data);
    }
  },
};

export default logger;
