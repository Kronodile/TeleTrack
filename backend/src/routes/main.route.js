import { Router } from "express";

const mainRouter = Router();

mainRouter.use("/auth",authRouter);
mainRouter.use("/product",productRouter);

export default mainRouter;