import { Router } from "express";

import { recommendationsRouter } from "./recommendations.routes";
import { sitesRouter } from "./sites.routes";
import { stationsRouter } from "./stations.routes";

export const apiRouter = Router();

apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/stations", stationsRouter);
apiRouter.use("/sites", sitesRouter);
