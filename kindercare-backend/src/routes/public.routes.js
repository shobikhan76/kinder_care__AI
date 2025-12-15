
import {listClinics } from "../controllers/public.controller"
import { Router } from "express"
import auth from "../middlewares/auth"
const router = Router() 

router.get('/clinics' , auth , listClinics)