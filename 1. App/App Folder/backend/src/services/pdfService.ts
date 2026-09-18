import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ICertificate } from '../models/Certificate';

export const generateCertificatePdf = async (cert: ICertificate): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Landscape certificate
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 50, right: 50 }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const width = doc.page.width;
      const height = doc.page.height;

      // Outer decorative border
      doc
        .lineWidth(3)
        .strokeColor('#14213D')
        .rect(25, 25, width - 50, height - 50)
        .stroke();

      // Inner thin border
      doc
        .lineWidth(1)
        .strokeColor('#16A085')
        .rect(30, 30, width - 60, height - 60)
        .stroke();

      // Header Brand
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#16A085')
        .text('PARIKSHAK', 0, 55, { align: 'center', characterSpacing: 2 });

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#7A8793')
        .text('INDUSTRIAL SAFETY QUALIFICATION REGISTRY', 0, 78, { align: 'center', characterSpacing: 1.5 });

      // Main Certificate Title
      doc
        .font('Helvetica-Bold')
        .fontSize(26)
        .fillColor('#14213D')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 110, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#4A5568')
        .text('This certifies that', 0, 145, { align: 'center' });

      // Worker Name
      doc
        .font('Helvetica-Bold')
        .fontSize(22)
        .fillColor('#14213D')
        .text(cert.workerName.toUpperCase(), 0, 168, { align: 'center' });

      // Worker ID & Organization
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#7A8793')
        .text(`Worker ID: ${cert.workerId}  |  ${cert.organizationName}`, 0, 196, { align: 'center' });

      // Body text
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#4A5568')
        .text('has successfully demonstrated competency and achieved certification in:', 0, 222, { align: 'center' });

      // Module Title
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor('#16A085')
        .text(cert.moduleTitle, 0, 245, { align: 'center' });

      // Score Badge Box
      const scoreBoxX = (width - 160) / 2;
      doc
        .roundedRect(scoreBoxX, 278, 160, 30, 6)
        .fillAndStroke('#E8F8F5', '#16A085');

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#16A085')
        .text(`Score: ${cert.score}%  |  Passed`, scoreBoxX, 287, { width: 160, align: 'center' });

      // Generate QR code for verification
      const verifyUrl = cert.verificationUrl;
      const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        width: 100,
        margin: 1,
        color: { dark: '#14213D', light: '#FFFFFF' }
      });

      // Place QR code on bottom right
      const qrX = width - 170;
      const qrY = height - 175;
      doc.image(qrBuffer, qrX, qrY, { width: 95, height: 95 });

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#7A8793')
        .text('Scan to verify credential', qrX - 10, qrY + 100, { width: 115, align: 'center' });

      // Left Metadata: Issue Date, Certificate ID, Status
      const metaX = 70;
      const metaY = height - 170;

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#7A8793')
        .text('CERTIFICATE ID:', metaX, metaY);
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#14213D')
        .text(cert.certificateId, metaX, metaY + 14);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#7A8793')
        .text('DATE OF ISSUANCE:', metaX, metaY + 38);
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#14213D')
        .text(new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), metaX, metaY + 52);

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#7A8793')
        .text('STATUS:', metaX, metaY + 74);
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor(cert.status === 'VALID' ? '#27AE60' : '#E74C3C')
        .text(cert.status, metaX + 55, metaY + 74);

      // Footer disclaimer
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#94A3B8')
        .text(
          'This official electronic certificate is tamper-proof and verifiable against the PARIKSHAK platform database records.',
          0,
          height - 50,
          { align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
