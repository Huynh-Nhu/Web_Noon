const router = require('express').Router();


const middlewareController = require('../app/controllers/middlewareController');
const staffController = require('../app/controllers/staffController')
const setStaffController = require('../app/controllers/setStaffController')

router.post('/refresh',staffController.refreshTokens )
router.use('/register', staffController.registerStaff )
router.use('/login', staffController.loginStaff )

//
// router.use('/avatar', setStaffController.setAvatar)
router.use('/setPass',middlewareController.verifyTokenAndAdmin,setStaffController.setPasswordStaff )

// refresh
router.use('/staff',middlewareController.verifyToken ,staffController.getAllStaff )
router.use('/logout',middlewareController.verifyToken ,staffController.logoutStaff )


router.use('/:id',middlewareController.verifyTokenAndAdmin ,staffController.deleteStaff )





module.exports = router;