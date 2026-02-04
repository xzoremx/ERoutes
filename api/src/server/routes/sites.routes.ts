import { Router } from "express";

import { getSites } from "../controllers/sites.controller";

export const sitesRouter = Router();

sitesRouter.get("/", getSites);
