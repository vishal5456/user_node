import express  from "express";
import {filelimiter} from '../middlewares/fileLimiter.js'
import {createUser, updateUser , getAllUser , deleteUser , getUserById} from "../controllers/user.js"

const router = express.Router();

router.get('/allUser', getAllUser)
router.delete('/:userId', deleteUser)
router.get('/:userId' , getUserById)
router.post('/create' , [filelimiter] , createUser)
router.patch('/:userId' , updateUser)



export default router;


