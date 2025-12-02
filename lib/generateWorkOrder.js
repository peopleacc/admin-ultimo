import { supabase } from "@/lib/supabaseClient";

export async function generateWorkOrderPDF(orderData) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Header: company block and title
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('PT. Contoh Jasa Teknologi', 14, 12);
    doc.setFontSize(10);
    doc.text('Jl. Contoh No.1, Jakarta • 021-123456', 14, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('SURAT PERINTAH KERJA', 105, 40, { align: 'center' });

    // Order/info box
    doc.setDrawColor(200);
    doc.rect(14, 46, 182, 40); // box
    doc.setFontSize(11);
    doc.text(`No. Pesanan: ${orderData.pesanan_id}`, 16, 56);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 16, 64);
    doc.text(`Nama: ${orderData.m_customers?.nama || '-'}`, 110, 56);
    doc.text(`No. HP: ${orderData.m_customers?.no_hp || '-'}`, 110, 64);

    // Service details
    doc.setFontSize(12);
    doc.text('Detail Layanan', 14, 98);
    doc.setLineWidth(0.5);
    doc.line(14, 100, 196, 100);

    const startY = 106;
    doc.setFontSize(11);
    const service = orderData.m_product_layanan?.nama_layanan || '-';
    const desc = orderData.m_product_layanan?.deskripsi || orderData.keterangan || '-';
    doc.text(`Layanan: ${service}`, 16, startY);
    doc.text(`Estimasi Harga: Rp ${Number(orderData.total_estimasi_harga || 0).toLocaleString('id-ID')}`, 16, startY + 8);

    // Description box
    doc.setFontSize(10);
    doc.rect(14, startY + 12, 182, 40);
    const splitDesc = doc.splitTextToSize(desc, 178);
    doc.text(splitDesc, 16, startY + 18);

    // Progress / teknisi area
    const bottomY = startY + 60;
    doc.text('Teknisi:', 16, bottomY + 8);
    doc.text(orderData.m_teknisi?.nama || '-', 40, bottomY + 8);

    // Signature area
    doc.text('Dibuat oleh,', 16, bottomY + 28);
    doc.text('_____________________', 16, bottomY + 48);

    const pdfBlob = doc.output('blob');
    const filename = `work_order_${orderData.pesanan_id}_${Date.now()}.pdf`;

    // Try upload to Supabase Storage (bucket: work_orders)
    try {
      const { error: uploadErr } = await supabase.storage
        .from('work_orders')
        .upload(filename, pdfBlob, { contentType: 'application/pdf', upsert: false });

      if (uploadErr) {
        console.warn('Upload PDF to storage failed:', uploadErr.message || uploadErr);
        // fallback: trigger client download
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        console.info('Work order PDF uploaded to storage as', filename);
      }
    } catch (upEx) {
      console.warn('Error uploading or downloading PDF fallback:', upEx);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  } catch (e) {
    console.warn('jspdf not available or failed to generate PDF:', e);
    // fallback: create a simple text file and download as .pdf
    try {
      const content = `SURAT PERINTAH KERJA\n\nNo. Pesanan: ${orderData.pesanan_id}\nNama: ${orderData.m_customers?.nama || '-'}\nLayanan: ${orderData.m_product_layanan?.nama_layanan || '-'}\nTotal: Rp ${Number(orderData.total_estimasi_harga || 0).toLocaleString('id-ID')}`;
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `work_order_${orderData.pesanan_id}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (ex2) {
      console.warn('Failed fallback download:', ex2);
    }
  }
}
