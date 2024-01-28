const router = require('express').Router();


const middlewareController = require('../app/controllers/middlewareController');
const staffController = require('../app/controllers/staffController')


router.post('/refresh',staffController.refreshTokens )
router.use('/register', staffController.registerStaff )
router.use('/login', staffController.loginStaff )
// refresh
router.use('/staff',middlewareController.verifyToken ,staffController.getAllStaff )
router.use('/logout',middlewareController.verifyToken ,staffController.logoutStaff )


router.use('/:id',middlewareController.verifyTokenAndAdmin ,staffController.deleteStaff )





module.exports = router;