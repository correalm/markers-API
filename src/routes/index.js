import express from 'express';
import markersRoutes from './markers.js'

const router = express.Router();

router.use('/markers', markersRoutes)
router.get('/', (req, res) => res.status(200).send("Hello World"))

export default router;