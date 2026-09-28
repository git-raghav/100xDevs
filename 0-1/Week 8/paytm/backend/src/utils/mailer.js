import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
    // secure: true, // Use secure connection
    secure: false, // Use secure connection
    // port: 465, // Port for secure connection
    port: 587, // Port for secure connection
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export async function sendOtpMail(to, otp, purpose) {
    const subject = purpose === "verify_email" ? "Paytm - Email Verification" : "Paytm - Password Reset";
    const action = purpose === "verify_email" ? "to verify your Paytm account" : "to reset your Paytm password";
    const text = `
Dear User,

We received a request ${action}. To proceed, please use the One-Time Password (OTP) provided below:

OTP: ${otp}

For your security, this code will expire in 10 minutes and should not be shared with anyone.

If you did not initiate this request, please ignore this email. For assistance, contact our support team at support@Paytm.com.

Thank you for choosing Paytm.

Sincerely,
Paytm Security Team
support@Paytm.com
  `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f4f6f8; margin:0; padding:20px;">
  <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background:#ffffff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding:20px; text-align:center; background:#004aad; border-radius:8px 8px 0 0;">
        <h1 style="color:#ffffff; margin:0;">Paytm</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        <p style="font-size:16px; color:#333;">Dear User,</p>
        <p style="font-size:16px; color:#333;">
          We received a request ${action}. To proceed, please use the One-Time Password (OTP) provided below:
        </p>

        <div style="margin:20px 0; text-align:center;">
          <span style="display:inline-block; padding:15px 30px; font-size:24px; font-weight:bold; letter-spacing:4px; color:#004aad; border:2px solid #004aad; border-radius:6px;">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#555;">
          For your security, this code will expire in <strong>10 minutes</strong> and should not be shared with anyone.
        </p>
        <p style="font-size:14px; color:#555;">
          If you did not initiate this request, please ignore this email. For assistance, contact our support team.
        </p>
        <p style="font-size:14px; color:#555;">
          Thank you for choosing Paytm.
        </p>

        <p style="font-size:14px; color:#333; margin-top:30px;">
          Sincerely,<br/>
          <strong>Paytm Security Team</strong><br/>
          <a href="mailto:support@Paytm.com" style="color:#004aad; text-decoration:none;">support@Paytm.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const mailOptions = {
        from: `"Paytm Security Team" <${process.env.MAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent.");
    } catch (err) {
        console.error("Error sending OTP:", err);
    }
}
