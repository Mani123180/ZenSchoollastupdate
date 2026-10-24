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
