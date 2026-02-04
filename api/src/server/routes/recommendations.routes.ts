import { Router } from "express";

import { getRecommendations } from "../controllers/recommendations.controller";

export const recommendationsRouter = Router();

recommendationsRouter.get("/", getRecommendations);
