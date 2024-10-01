import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends Logger {
  log(message: string) {
    // Custom logic before logging
    super.log(`[Custom] ${message}`);
  }

  error(message: string, trace?: string) {
    // Custom logic for errors, with optional trace
    super.error(`[Custom Error] ${message}`, trace || '');
  }

  // Override other methods like warn(), debug(), etc., if needed
}
