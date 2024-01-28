const nodemailer = require('nodemailer')
const config = require('../config/index')


class sendEmailService{
    async sendMail(emailStaff, nameStaff, randomPassword) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.pass.password
                }
            });
            // Cấu hình email 
            const mailOptions = {
                from: config.email.user,
                to: `${emailStaff}`,
                subject: `Chào bạn ${nameStaff}`,
                text: `Mật khẩu của tài khoản của bạn ở Noon là: ${randomPassword}`
            };
    
            // Gửi email
            await transporter.sendMail(mailOptions);
            console.log('Send email thành công');
    
        } catch (error) {
            console.log("Lỗi gửi email", error)
        }
    }
}

module.exports = new sendEmailService()