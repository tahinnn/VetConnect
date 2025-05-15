const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Create new adoption with payment
router.post('/', async (req, res) => {
    try {
        const adoption = new Adoption(req.body);
        await adoption.save();
        res.status(201).json(adoption);
    } catch (error) {
        console.error('Error creating adoption:', error);
        res.status(500).json({ error: 'Failed to create adoption' });
    }
});

// Get adoption by ID
router.get('/:id', async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ error: 'Adoption not found' });
        }
        res.json(adoption);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch adoption' });
    }
});

// Generate and download booking slip
router.get('/:id/booking-slip', async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);
        if (!adoption) {
            return res.status(404).json({ error: 'Adoption not found' });
        }

        // Create PDF document
        const doc = new PDFDocument();
        const filename = `adoption-slip-${adoption._id}.pdf`;

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Pipe PDF document to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('VetConnect Adoption Booking Slip', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('Booking Details', { underline: true });
        doc.moveDown();

        // Add adoption details
        const details = [
            { label: 'Booking ID', value: adoption._id },
            { label: 'Issue Date', value: new Date(adoption.issuedDate).toLocaleDateString() },
            { label: 'Status', value: adoption.status.toUpperCase() },
            { label: 'Adopter Name', value: adoption.name },
            { label: 'Phone', value: adoption.phone },
            { label: 'Email', value: adoption.email },
            { label: 'Address', value: adoption.address },
            { label: 'Pick-up Type', value: adoption.pickupType },
            { label: 'Pet Name', value: adoption.pet.name },
            { label: 'Pet Breed', value: adoption.pet.breed },
            { label: 'Pet Age', value: `${adoption.pet.age} years` },
            { label: 'Payment Method', value: adoption.paymentMethod },
            { label: 'Payment Status', value: adoption.paymentStatus },
            { label: 'Amount Paid', value: `$${adoption.amount}` }
        ];

        details.forEach(detail => {
            doc.text(`${detail.label}: ${detail.value}`);
            doc.moveDown(0.5);
        });

        // Add pet image if available
        if (adoption.pet.image) {
            const imagePath = path.join(__dirname, '..', adoption.pet.image);
            if (fs.existsSync(imagePath)) {
                doc.image(imagePath, {
                    fit: [250, 250],
                    align: 'center'
                });
            }
        }

        // Add footer
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for adopting from VetConnect!', { align: 'center' });
        doc.text('This is an official adoption booking slip.', { align: 'center' });

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error generating booking slip:', error);
        res.status(500).json({ error: 'Failed to generate booking slip' });
    }
});

module.exports = router;
