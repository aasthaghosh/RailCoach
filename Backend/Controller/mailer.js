const nodemailer = require("nodemailer");

require("dotenv").config();


const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    }
})
 async function sendEmail (req, res){
    const { email, message } = req.body;

    try {
        await transport.sendMail({
            from: `"Website Contact" <${process.env.MAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,   // YOUR email
            replyTo: email,                // user's email
            subject: "New Message from Website",
            html: `
        <h3>New Contact Message</h3>
        <p><b>User Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
        });
        return res.json({ success: true, message: "Message sent successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Email failed" });
    }
}

module.exports = sendEmail;