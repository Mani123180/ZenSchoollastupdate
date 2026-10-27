import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a clean, professional PDF invoice directly to the user's system.
 * @param {Object} bill - The bill object { invoiceNo, school, schoolId, plan, amount, dueDate, paymentDate, status }
 */
export async function downloadInvoicePDF(bill) {
  if (!bill) return;

  // Create an offscreen DOM container styled for invoice printing
  const container = document.createElement('div');
  container.id = 'temp-pdf-invoice-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '700px';
  container.style.padding = '36px 40px';
  container.style.background = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  container.style.boxSizing = 'border-box';

  const isPaid = bill.status === 'PAID';
  const badgeBg = isPaid ? '#dcfce7' : '#fee2e2';
  const badgeColor = isPaid ? '#15803d' : '#b91c1c';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 22px; margin-bottom: 24px;">
      <div>
        <div style="color: #1e3a8a; font-size: 26px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.5px;">ZenSchool ERP</div>
        <div style="font-size: 13px; color: #64748b; line-height: 1.4;">Platform Central Multi-Tenant Cloud</div>
        <div style="font-size: 13px; color: #64748b;">support@zenschool.edu | +91 98401 11001</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${badgeBg}; color: ${badgeColor};">
          ${bill.status}
        </span>
        <div style="margin-top: 10px; font-size: 14px; color: #475569;">
          Invoice: <strong style="color: #0f172a;">${bill.invoiceNo}</strong>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 26px;">
      <div style="background: #f8fafc; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Billed To Campus</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${bill.school}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Campus ID: ${bill.schoolId || 'SCH001'}</div>
      </div>
      <div style="background: #f8fafc; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Invoice Dates</div>
        <div style="color: #334155; font-size: 13px;">Due Date: <strong>${bill.dueDate}</strong></div>
        <div style="color: #334155; font-size: 13px; margin-top: 4px;">Paid Date: <strong>${bill.paymentDate || 'Pending payment'}</strong></div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
      <thead>
        <tr>
          <th style="background: #f1f5f9; text-align: left; padding: 12px 14px; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1;">Description / Plan</th>
          <th style="background: #f1f5f9; text-align: center; padding: 12px 14px; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1;">Duration</th>
          <th style="background: #f1f5f9; text-align: right; padding: 12px 14px; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 16px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">
            <strong style="color: #0f172a; font-size: 15px;">${bill.plan}</strong>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Annual Cloud ERP License & Multi-Campus Access</div>
          </td>
          <td style="padding: 16px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center; color: #475569;">1 Year</td>
          <td style="padding: 16px 14px; border-bottom: 1px solid #e2e8f0; font-size: 16px; text-align: right; font-weight: 700; color: #1e3a8a;">${bill.amount}</td>
        </tr>
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #cbd5e1; padding-top: 20px;">
      <div style="font-size: 12px; color: #94a3b8; max-width: 380px; line-height: 1.4;">
        Digitally generated by ZenSchool Platform &bull; Valid official cloud bill without physical signature.
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Total Billed</div>
        <div style="font-size: 26px; font-weight: 800; color: #047857; margin-top: 2px;">${bill.amount}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const imgWidth = 595.28; // standard A4 width in pt
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    const cleanSchool = (bill.school || 'Campus').replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Invoice_${bill.invoiceNo}_${cleanSchool}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generates and downloads a real, formatted study material PDF document.
 * @param {Object} material - The study material object { id, title, grade, subject, fileName, fileSize, uploadedBy, date, description }
 */
export async function downloadStudyMaterialPDF(material) {
  if (!material) return;

  const container = document.createElement('div');
  container.id = 'temp-pdf-material-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '700px';
  container.style.padding = '40px 45px';
  container.style.background = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <div style="border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="color: #1e3a8a; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Zen School Academic Portal</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Official Student Study Material & Revision Guide</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Department of Academic Instruction • Academic Year 2026-2027</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; background: #e0e7ff; color: #3730a3;">
          ${material.grade || 'Grade 10-A'}
        </span>
        <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Subject: <strong style="color: #0f172a;">${material.subject || 'General'}</strong></div>
      </div>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; padding: 18px 20px; border-radius: 8px; margin-bottom: 25px;">
      <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Document Title</div>
      <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.3;">${material.title}</h1>
      <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5;">${material.description || 'Reference notes, problem sheets, formulas, and revision documents.'}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px;">
      <div style="background: #f1f5f9; padding: 14px 16px; border-radius: 8px;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Faculty In-Charge</div>
        <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${material.uploadedBy || 'Course Faculty'}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Published: ${material.date || new Date().toISOString().split('T')[0]}</div>
      </div>
      <div style="background: #f1f5f9; padding: 14px 16px; border-radius: 8px;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Document Details</div>
        <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${material.fileName || 'Resource_Guide.pdf'}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Format: ${material.fileType || 'PDF'} • Size: ${material.fileSize || '2.4 MB'}</div>
      </div>
    </div>

    <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 22px; margin-bottom: 30px; background: #ffffff;">
      <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 14px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
        📘 Key Study Concepts & Learning Objectives
      </h3>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
        <li>Review and memorize fundamental identities, equations, and definitions outlined in chapter notes.</li>
        <li>Solve all assigned practice problems and step-by-step model exam questions.</li>
        <li>Prepare notes for periodic chapter assessment tests and board examination revisions.</li>
        <li>For any academic queries or problem explanations, clarify during teacher consultation hours.</li>
      </ol>
    </div>

    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
      <div>Zen School Education Portal &bull; Digital Classroom Resource Hub</div>
      <div>Downloaded: ${new Date().toLocaleDateString('en-GB')}</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const imgWidth = 595.28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    const cleanFileName = (material.fileName || `${material.title || 'Study_Material'}.pdf`).replace(/\s+/g, '_');
    pdf.save(cleanFileName.endsWith('.pdf') ? cleanFileName : `${cleanFileName}.pdf`);
  } catch (err) {
    console.error('Study Material PDF generation error:', err);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generates and downloads a clean, professional Student Fee Bill Invoice PDF
 */
export async function downloadStudentBillPDF(bill) {
  if (!bill) return;

  const container = document.createElement('div');
  container.id = 'temp-pdf-student-bill';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '700px';
  container.style.padding = '36px 40px';
  container.style.background = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';

  const isPaid = bill.paymentStatus === 'Paid';
  const badgeBg = isPaid ? '#dcfce7' : bill.paymentStatus === 'Partially Paid' ? '#fef3c7' : '#fee2e2';
  const badgeColor = isPaid ? '#15803d' : bill.paymentStatus === 'Partially Paid' ? '#b45309' : '#b91c1c';

  const feeItemsRows = (bill.feeItems || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #f1f5f9;">
      <td style="padding: 10px 12px; font-size: 13px; color: #64748b;">${idx + 1}</td>
      <td style="padding: 10px 12px; font-size: 13px; font-weight: 600; color: #1e293b;">
        ${item.feeType}
        ${item.description ? `<div style="font-size: 11px; color: #64748b; font-weight: 400;">${item.description}</div>` : ''}
      </td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; color: #334155;">₹${Number(item.amount || 0).toLocaleString()}</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; color: #16a34a;">${item.discount ? `-₹${Number(item.discount).toLocaleString()}` : '—'}</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; color: #dc2626;">${item.fine ? `+₹${Number(item.fine).toLocaleString()}` : '—'}</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; font-weight: 700; color: #0f172a;">₹${Number(item.netAmount || item.amount || 0).toLocaleString()}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
      <div>
        <div style="color: #1e3a8a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ZenSchool • Sri Sankara Vidhyasala</div>
        <div style="font-size: 13px; color: #64748b; line-height: 1.4;">Official Fee Receipt & Student Billing</div>
        <div style="font-size: 12px; color: #64748b;">Campus: Chennai, Tamil Nadu • accounts@ssvschool.edu</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${badgeBg}; color: ${badgeColor};">
          ${bill.paymentStatus}
        </span>
        <div style="margin-top: 8px; font-size: 14px; color: #475569;">
          Invoice: <strong style="color: #0f172a;">${bill.invoiceNumber}</strong>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
      <div style="background: #f8fafc; padding: 14px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Student Information</div>
        <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${bill.studentName}</div>
        <div style="font-size: 12px; color: #475569; margin-top: 3px;">Class: <strong>${bill.grade} (${bill.section || 'A'})</strong> | Roll: <strong>${bill.rollNo || bill.studentId}</strong></div>
        <div style="font-size: 12px; color: #475569; margin-top: 2px;">Admission No: <strong>${bill.admissionNumber || 'N/A'}</strong></div>
      </div>
      <div style="background: #f8fafc; padding: 14px 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Billing Schedule</div>
        <div style="font-size: 12px; color: #334155;">Billing Month: <strong>${bill.billingMonth} (${bill.academicYear || '2026-2027'})</strong></div>
        <div style="font-size: 12px; color: #334155; margin-top: 3px;">Billing Date: <strong>${bill.billingDate}</strong></div>
        <div style="font-size: 12px; color: #334155; margin-top: 3px;">Due Date: <strong style="color: #dc2626;">${bill.dueDate}</strong></div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">#</th>
          <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">Fee Item</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569;">Base</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569;">Discount</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569;">Fine</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #475569;">Net Amount</th>
        </tr>
      </thead>
      <tbody>
        ${feeItemsRows}
      </tbody>
    </table>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
      <div style="width: 280px; background: #f8fafc; padding: 14px 18px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 6px;">
          <span>Total Fee:</span>
          <strong>₹${Number(bill.totalFees || 0).toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #16a34a; margin-bottom: 6px;">
          <span>Paid Amount:</span>
          <strong>₹${Number(bill.paidAmount || 0).toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; color: #dc2626; border-top: 1px solid #cbd5e1; padding-top: 6px;">
          <span>Pending Amount:</span>
          <span>₹${Number(bill.pendingAmount || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>

    ${bill.remarks ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 10px 14px; margin-bottom: 24px; font-size: 12px; color: #92400e;">
        <strong>Remarks:</strong> ${bill.remarks}
      </div>
    ` : ''}

    <div style="border-top: 1px dashed #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
      <div>This is a computer-generated school billing invoice. No signature required.</div>
      <div>Printed: ${new Date().toLocaleDateString('en-GB')}</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const imgWidth = 595.28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    pdf.save(`FeeBill_${bill.invoiceNumber || 'Invoice'}.pdf`);
  } catch (err) {
    console.error('Fee Bill PDF error:', err);
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
}

/**
 * Generates and downloads a clean, professional Staff Salary Slip PDF
 */
export async function downloadSalarySlipPDF(salary) {
  if (!salary) return;

  const container = document.createElement('div');
  container.id = 'temp-pdf-salary-slip';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '700px';
  container.style.padding = '36px 40px';
  container.style.background = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
      <div>
        <div style="color: #1e3a8a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">ZenSchool • Sri Sankara Vidhyasala</div>
        <div style="font-size: 13px; color: #64748b; line-height: 1.4;">Official Staff Salary Payslip</div>
        <div style="font-size: 12px; color: #64748b;">Month: ${salary.salaryMonth} ${salary.salaryYear}</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: ${salary.paymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2'}; color: ${salary.paymentStatus === 'Paid' ? '#15803d' : '#b91c1c'};">
          ${salary.paymentStatus}
        </span>
        <div style="margin-top: 8px; font-size: 14px; color: #475569;">
          Slip No: <strong style="color: #0f172a;">${salary.salarySlipNo}</strong>
        </div>
      </div>
    </div>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        <div>
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Employee Name</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">${salary.staffName}</div>
          <div style="font-size: 11px; color: #6366f1; font-weight: 600;">[${salary.staffType || 'Teaching Staff'}]</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Staff ID</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">${salary.staffId}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Designation</div>
          <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">${salary.designation}</div>
        </div>
        <div>
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700;">Department</div>
          <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">${salary.department}</div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
      <!-- Earnings -->
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #f1f5f9; padding: 10px 14px; font-size: 13px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e2e8f0;">
          EARNINGS
        </div>
        <div style="padding: 12px 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Basic Salary</span>
            <strong style="color: #0f172a;">₹${Number(salary.basicSalary || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">HRA</span>
            <strong style="color: #0f172a;">₹${Number(salary.hra || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Allowances</span>
            <strong style="color: #0f172a;">₹${Number(salary.allowances || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Bonus</span>
            <strong style="color: #0f172a;">₹${Number(salary.bonus || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Incentives</span>
            <strong style="color: #0f172a;">₹${Number(salary.incentives || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 8px; color: #1e3a8a;">
            <span>Gross Earnings</span>
            <span>₹${Number(salary.grossSalary || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Deductions -->
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #f1f5f9; padding: 10px 14px; font-size: 13px; font-weight: 700; color: #dc2626; border-bottom: 1px solid #e2e8f0;">
          DEDUCTIONS
        </div>
        <div style="padding: 12px 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Provident Fund (PF)</span>
            <strong style="color: #0f172a;">₹${Number(salary.pf || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">ESI</span>
            <strong style="color: #0f172a;">₹${Number(salary.esi || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Salary Advance</span>
            <strong style="color: #0f172a;">₹${Number(salary.salaryAdvance || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
            <span style="color: #475569;">Other Deductions</span>
            <strong style="color: #0f172a;">₹${Number(salary.otherDeductions || 0).toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; border-top: 1px solid #e2e8f0; padding-top: 8px; color: #dc2626;">
            <span>Total Deductions</span>
            <span>₹${Number(salary.totalDeductions || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Net Salary Box -->
    <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <div style="font-size: 12px; color: #166534; font-weight: 700; text-transform: uppercase;">Net Payable Salary</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Bank: <strong>${salary.bankAccountNo || 'Direct Bank Credit'}</strong> • Method: <strong>${salary.paymentMethod || 'Bank Transfer'}</strong></div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 24px; font-weight: 800; color: #15803d;">₹${Number(salary.netSalary || 0).toLocaleString()}</div>
        <div style="font-size: 12px; color: #166534;">Paid: ₹${Number(salary.paidAmount || 0).toLocaleString()} | Pending: ₹${Number(salary.pendingAmount || 0).toLocaleString()}</div>
      </div>
    </div>

    <div style="border-top: 1px dashed #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
      <div>ZenSchool ERP Human Resources & Payroll System</div>
      <div>Disbursed: ${salary.paymentDate || new Date().toLocaleDateString('en-GB')}</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const imgWidth = 595.28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    pdf.save(`SalarySlip_${salary.salarySlipNo || 'Slip'}.pdf`);
  } catch (err) {
    console.error('Salary Slip PDF error:', err);
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
}

