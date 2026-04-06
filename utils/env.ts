// Environment variables validation and utilities

interface RequiredEnvVars {
  EXPO_PUBLIC_BASE_URL?: string;
  EXPO_PUBLIC_API_KEY?: string;
}

class EnvironmentValidator {
  private static instance: EnvironmentValidator;
  private validated = false;
  private warnings: string[] = [];

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  validate(): void {
    if (this.validated) return;

    this.warnings = [];

    // Check required environment variables
    // Direct access to process.env allows Expo to inline these at build time
    if (!process.env.EXPO_PUBLIC_BASE_URL) {
      this.warnings.push(
        "EXPO_PUBLIC_BASE_URL is not set - API calls may fail"
      );
    }

    if (!process.env.EXPO_PUBLIC_API_KEY) {
      this.warnings.push(
        "EXPO_PUBLIC_API_KEY is not set - some features may be limited"
      );
    }

    // Log warnings in development
    // Using console here is intentional as this runs before loggers initialize
    // eslint-disable-next-line no-console
    if (__DEV__ && this.warnings.length > 0) {
      console.warn("Environment configuration warnings:", this.warnings);
    }

    this.validated = true;
  }

  getWarnings(): string[] {
    return [...this.warnings];
  }

  isValid(): boolean {
    return this.warnings.length === 0;
  }
}

// Export singleton instance
export const envValidator = EnvironmentValidator.getInstance();

// Export validation function for explicit invocation
export function validateEnv(): void {
  envValidator.validate();
}

// Note: Validation should be called explicitly from app bootstrap
// Remove automatic validation to decouple from import timing
