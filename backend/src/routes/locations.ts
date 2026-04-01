import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import { isAuth, isStaff } from "../middleware/auth.js";
import locationService from "../services/locationService.js";

router.get("/", isAuth, async (req: Request, res: Response) => {
    const locations = await locationService.getAll();
    res.json({ message: "List of locations", data: locations})
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response) => {
    const idNum = Number(req.params.id);
    if(Number.isNaN(idNum)) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Location ID must be a number"})
    }
    const location = await locationService.getOneById(idNum);
    if(!location){
        return res.status(404).json({ status: "error", statuscode: 404, message: "Location not found"})
    }
    res.json({ message: "Location details", data: location});
});

router.post("/", isAuth, isStaff, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { address, city, state, zipCode } = req.body;
        if(!address || !city || !state || !zipCode) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields: address, city, state, zipCode" });
        }
        const newLocation = await locationService.create({ address, city, state, zipCode });
        res.status(201).json({ message: "Location created", data: newLocation });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Location ID must be a number" });
        }
        const { address, city, state, zipCode } = req.body;
        if (!address && !city && !state && !zipCode) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "At least one field (address, city, state, zipCode) must be provided for update" });
        }
        const updatedLocation = await locationService.update(idNum, { address, city, state, zipCode });
        res.json({ message: "Location updated", data: updatedLocation });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Location ID must be a number" });
        }
        await locationService.delete(idNum);
        res.json({ message: "Location deleted" });
    } catch (err) {
        next(err);
    }
});

export default router;
