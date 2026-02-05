import { Router } from "express";

import { publicRouter } from "./public.routes";
import { recommendationsRouter } from "./recommendations.routes";
import { sitesRouter } from "./sites.routes";
import { stationsRouter } from "./stations.routes";

export const apiRouter = Router();

apiRouter.use("/public", publicRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/stations", stationsRouter);
apiRouter.use("/sites", sitesRouter);
