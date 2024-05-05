const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS to allow requests from other origins
app.use(cors());

// Serve static files (e.g., HTML, CSS, JS) from a directory
app.use(express.static('public'));

// Endpoint to serve the HTML form
app.get('/', async  (req, res) => {
        // uncomment to test
            // res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to handle form submission and schedule email
app.post('/', (req, res) => {
    const { to, date, message } = req.body;

    // console.log('Email details:', { to, date, message });
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
                        pass: 'mpfh cryk oldj mitn',
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

                // Clear the scheduled job after sending the email
                job.cancel();

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

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
