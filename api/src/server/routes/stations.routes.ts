import { Router } from "express";

import { getStations } from "../controllers/stations.controller";

export const stationsRouter = Router();

stationsRouter.get("/", getStations);
