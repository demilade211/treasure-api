// controllers/contactController.js
import sendEmail from '../utils/sendEmail.js';
import ErrorHandler from '../utils/errorHandler.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return next(new ErrorHandler('All fields are required', 400));
    }

    // Optional: validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorHandler('Invalid email address', 400));
    }

    // Send email to your support inbox
    await sendEmail({
      email: 'thetreasureboxng@gmail.com', // destination email
      subject: `Contact Form Submission from ${name}`,
      message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // Optionally send confirmation email to user
    await sendEmail({
      email,
      subject: 'We Received Your Message',
      message: `Hi ${name},\n\nThank you for contacting us! We will get back to you shortly.\n\n- Tuale Team`,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    return next(error);
  }
};
