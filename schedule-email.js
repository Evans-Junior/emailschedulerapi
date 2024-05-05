
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const router = express.Router();
router.use(bodyParser.json());

// Endpoint to receive scheduling request
router.post('/', async (req, res) => {
    const { to, date, message } = req.body;

    // Validate request payload
    if (!to || !date || !message) {
        return res.status(400).json({ error: 'Missing required fields (to, date, message)' });
    }

    try {
        // Parse date string into a Date object
        const scheduledDate = new Date(date);

        // Schedule the email sending job
        const job = schedule.scheduleJob(scheduledDate, async () => {
            try {
                // Create a Nodemailer transporter
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'ashesigymassociation@gmail.com',
                        pass: 'Ashesigym.,1234@',
                    },
                });

                // Prepare email message
                const mailOptions = {
                    from: 'ashesigymassociation@gmail.com',
                    to,
                    subject: 'Scheduled Notification',
                    text: message,
                };

                // Send the email
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully:', info.response);
            } catch (error) {
                console.error('Error sending scheduled email:', error);
            }
        });

        // Return success response
        res.status(200).json({ message: 'Email scheduled successfully' });
    } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;