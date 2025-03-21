"use server";
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  orderNumber: string;
  cc?: string;
  pdfBlob: Blob;
}

// 🔹 تحويل `Blob` إلى `Buffer`
const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// 🔹 إنشاء وإرجاع كائن `nodemailer` لنقل البريد
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // `true` عند استخدام `port 465`
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// 🔹 إرسال الفاتورة عبر البريد الإلكتروني
export const sendInvoiceEmail = async ({
  to,
  orderNumber,
  cc,
  pdfBlob,
}: EmailOptions) => {
  try {
    const transporter = createTransporter();
    const pdfBuffer = await blobToBuffer(pdfBlob);

    const mailOptions = {
      from: `"Amwag Co." <${process.env.EMAIL_USER}>`,
      to,
      cc, // Include CC if provided
      subject: `Invoice for Order #${orderNumber}`,
      text: `Dear customer,\n\nAttached is your invoice for Order #${orderNumber}.\n\nThank you for your business!\n\nBest Regards,\nAmwag Co.`,
      attachments: [
        {
          filename: `Invoice_${orderNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// "use server";
// import nodemailer from "nodemailer";

// interface EmailOptions {
//   to: string;
//   orderNumber: string;
//   cc?: string;
//   pdfBlob: Blob;
// }

// // 🔹 تحويل `Blob` إلى `Buffer`
// const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
//   const arrayBuffer = await blob.arrayBuffer();
//   return Buffer.from(arrayBuffer);
// };

// // 🔹 إنشاء وإرجاع كائن `nodemailer` لنقل البريد
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // `true` عند استخدام `port 465`
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// // 🔹 إرسال الفاتورة عبر البريد الإلكتروني
// export const sendInvoiceEmail = async ({
//   to,
//   orderNumber,
//   pdfBlob,
// }: EmailOptions) => {
//   try {
//     const transporter = createTransporter();
//     const pdfBuffer = await blobToBuffer(pdfBlob);

//     const mailOptions = {
//       from: `"Amwag Co." <${process.env.EMAIL_USER}>`,
//       to,
//       subject: `Invoice for Order #${orderNumber}`,
//       text: `Dear customer,\n\nAttached is your invoice for Order #${orderNumber}.\n\nThank you for your business!\n\nBest Regards,\nAmwag Co.`,
//       attachments: [
//         {
//           filename: `Invoice_${orderNumber}.pdf`,
//           content: pdfBuffer,
//           encoding: "base64",
//         },
//       ],
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
//   } catch (error: any) {
//     console.error(`❌ Error sending email to ${to}: ${error.message}`);
//   }
// };
