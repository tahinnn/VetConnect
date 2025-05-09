const PDFDocument = require('pdfkit');
const moment = require('moment');
const Appointment = require('../models/Appointment');

const generateAppointmentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the appointment by ID
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=appointment_${appointment._id}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header with logo and title
    doc
      .fillColor('#1E40AF') // Dark blue color
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('Pet Medical Appointment', { align: 'center' })
      .moveDown(0.5);



    // Add appointment ID and date
    doc
      .fontSize(12)
      .fillColor('#4B5563') // Gray color
      .text(`Appointment ID: ${appointment._id}`, { align: 'right' })
      .text(`Generated on: ${moment().format('MMMM D, YYYY')}`, { align: 'right' })
      .moveDown(1);

    // Add appointment status
    doc
      .fontSize(14)
      .fillColor('#059669') // Green color
      .text(`Status: ${appointment.status || 'Scheduled'}`, { align: 'right' })
      .moveDown(2);

    // Add appointment date in a highlighted box
    doc
      .fillColor('#EFF6FF') // Light blue background
      .roundedRect(50, 180, 495, 60, 8)
      .fill()
      .fillColor('#1E40AF')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Appointment Date', 70, 195)
      .fontSize(20)
      .text(moment(appointment.appointmentDate).format('MMMM D, YYYY'), 70, 220)
      .moveDown(3);

    // Add user information section
    doc
      .fillColor('#1E40AF')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('User Information', 50, 280)
      .moveDown(0.5);

    // Add user details in a table-like format
    const userDetails = [
      { label: 'Name', value: appointment.userName },
      { label: 'Phone', value: appointment.phoneNumber },
      { label: 'Email', value: appointment.email }
    ];

    userDetails.forEach((detail, index) => {
      const y = 320 + (index * 25);
      doc
        .fillColor('#4B5563')
        .fontSize(12)
        .font('Helvetica')
        .text(detail.label + ':', 70, y)
        .font('Helvetica-Bold')
        .text(detail.value, 200, y);
    });

    // Add pet information section
    doc
      .fillColor('#1E40AF')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Pet Information', 50, 420)
      .moveDown(0.5);

    // Add pet details in a table-like format
    const petDetails = [
      { label: 'Pet Name', value: appointment.petName },
      { label: 'Pet Type', value: appointment.petType },
      { label: 'Veterinary Type', value: appointment.veterinaryType },
      { label: 'Clinic Location', value: appointment.clinicPlace }
    ];

    petDetails.forEach((detail, index) => {
      const y = 460 + (index * 25);
      doc
        .fillColor('#4B5563')
        .fontSize(12)
        .font('Helvetica')
        .text(detail.label + ':', 70, y)
        .font('Helvetica-Bold')
        .text(detail.value, 200, y);
    });

    // Add important information section
    doc
      .fillColor('#1E40AF')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Important Information', 50, 580)
      .moveDown(0.5);

    // Add important notes
    const importantNotes = [
      '• Please arrive 15 minutes before your scheduled appointment time',
      '• Bring any previous medical records of your pet',
      '• For any changes or cancellations, please contact the clinic directly',
      '• Keep this appointment slip for your records'
    ];

    importantNotes.forEach((note, index) => {
      doc
        .fillColor('#4B5563')
        .fontSize(12)
        .font('Helvetica')
        .text(note, 70, 620 + (index * 20));
    });

    // Add footer
    doc
      .fontSize(10)
      .fillColor('#6B7280')
      .text(
        'This is an official appointment slip. Please keep it for your records.',
        50,
        750,
        { align: 'center', width: 495 }
      );

    // Add page numbers
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .fillColor('#6B7280')
        .text(
          `Page ${i + 1} of ${pages.count}`,
          50,
          780,
          { align: 'center', width: 495 }
        );
    }

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
};

module.exports = {
  generateAppointmentPDF
}; 