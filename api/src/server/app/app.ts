import { randomUUID } from "crypto";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { corsOptions } from "../config/cors";
import { env } from "./env";
import { createHealthRouter } from "./health";
import { logger } from "./logger";
import { errorMiddleware } from "../middlewares/error.middleware";
import { notFoundMiddleware } from "../middlewares/notFound.middleware";
import { apiRouter } from "../routes";

export function createApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");

  app.use(
    pinoHttp({
      logger,
      genReqId: () => randomUUID()
    })
  );

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  app.use(express.json({ limit: "200kb" }));

  app.use("/health", createHealthRouter());
  app.use("/api", apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API listening");
  });
}
