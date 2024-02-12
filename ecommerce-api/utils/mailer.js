const nodeMailer = require('nodemailer')

const sendEmail = (options) => {
    // Create email transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth:{
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        html: options.message,
    }

    // send email
    // await transporter.sendMail(mailOptions)

    transporter.sendMail(mailOptions, function(error, res){
        if(error){
            res.status(400)
            throw new Error('Failed to send Email')
        }else{
            res.send("Email has been sent successfully");
        }
    })
}

module.exports = {sendEmail}