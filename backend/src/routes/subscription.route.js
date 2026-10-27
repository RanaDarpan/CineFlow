import { getAllPlans, purchasePlan, getCurrentSubscription, cancelSubscription, addPlan, deletePlan, getPlanDetails } from "../controller/subscription.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/plans").get(getAllPlans)
router.route("/purchase-plans/:plan_id").post(verifyJWT, purchasePlan)
router.route("/current-plan").get(verifyJWT, getCurrentSubscription)
router.route("/cancel-plan").post(verifyJWT, cancelSubscription)
router.route("/add-plan").post(verifyJWT, addPlan)
router.route("/delete-plan/:plan_id").delete(verifyJWT, deletePlan)
router.route("/get-plan/:plan_id").get(verifyJWT, getPlanDetails)
 
export default router