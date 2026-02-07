import app from "./app.js";
import db from "./models/index.js";
import type {Request, Response} from "express";

const PORT: number | string = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

/* db.sequelize.sync({ force: false }); */

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});