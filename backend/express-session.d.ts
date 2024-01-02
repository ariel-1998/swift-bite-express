// Extend the SessionData interface with the user property
export declare module "express-session" {
  interface SessionData {
    user?: number; // Adjust the type according to your needs
  }
}
