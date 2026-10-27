import { Router } from "express";

const router =Router()
router.get("/test", (req,res) => {
    console.log("TEST ROUTE");
    return res.status(200).json({message: "TEST ROUTE"});
});
export default router;