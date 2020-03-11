const express= require('express')
const {check} = require('express-validator')

const User=require('../controllers/userController')

const router=express.Router()
const validate=require('../middlewares/validate')

router.get('/',User.index)
router.get('/:id',User.show)
router.put('/:id',User.update)
router.delete('/:id',User.destroy)

module.exports=router