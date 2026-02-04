import type { NextFunction, Request, Response } from "express";

export function notFoundMiddleware(_req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({ error: "not_found" });
}
