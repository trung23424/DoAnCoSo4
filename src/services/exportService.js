/**
 * Dịch vụ Xuất Biên bản Cuộc họp (Meeting Export Service)
 * Đồ án Cơ sở 4 - Hệ thống AI SmartMeet (VKU)
 * 
 * Hỗ trợ 2 định dạng xuất chuẩn văn bản hành chính Việt Nam:
 * 1. Microsoft Word (.doc / .docx): UTF-8 BOM, bảng biểu, quy chuẩn quốc hiệu, định dạng trang A4
 * 2. Tài liệu PDF (A4 Print Preview): Vector fonts sắc nét, chuẩn in ấn, ngắt trang thông minh
 */

/**
 * Tạo nội dung HTML hoàn chỉnh cho biên bản họp theo thể thức văn bản hành chính
 * @param {Object} meetingData - Dữ liệu chi tiết cuộc họp
 * @returns {string} - Chuỗi HTML chuẩn hoá
 */
export function generateMeetingHTML(meetingData) {
  if (!meetingData) return '';

  const {
    id = 'ASM-ROOM',
    title = 'Cuộc họp trực tuyến',
    date = new Date().toLocaleDateString('vi-VN'),
    time = '09:00',
    duration = '35 phút',
    host = 'Đỗ Quang Trung',
    attendees = [],
    aiSummary = {},
    transcript = [],
  } = meetingData;

  const executive =
    aiSummary?.executive ||
    aiSummary?.overview ||
    'Biên bản tóm tắt cuộc họp do AI SmartMeet tự động tổng hợp.';

  const keyPoints =
    aiSummary?.keyPoints && aiSummary.keyPoints.length > 0
      ? aiSummary.keyPoints
      : [
          'Khởi tạo phòng họp trực tuyến và kết nối WebRTC P2P thành công.',
          'Kích hoạt bộ thu âm đa kênh và nhận dạng giọng nói tiếng Việt bằng OpenAI Whisper.',
        ];

  const decisions =
    aiSummary?.decisions && aiSummary.decisions.length > 0
      ? aiSummary.decisions
      : ['Thống nhất tiếp tục hoàn thiện các phân hệ theo đề cương Đồ án Cơ sở 4.'];

  const actionItems = aiSummary?.actionItems || [];

  const attendeeNames =
    attendees.length > 0
      ? attendees.map((a) => (typeof a === 'string' ? a : a.name || host)).join(', ')
      : `${host}, Thành viên dự họp`;

  // Tạo hàng bảng Action Items
  const actionItemsRows =
    actionItems.length > 0
      ? actionItems
          .map(
            (item, index) => `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #cbd5e1; font-size: 13px;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 13px;">${item.text || 'Hoàn thiện nhiệm vụ'}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 13px; text-align: center;">${item.assignee || host}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 13px; text-align: center;">${item.deadline || 'Hôm nay'}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 13px; text-align: center; color: ${item.completed ? '#166534' : '#b45309'}; font-weight: 600;">
            ${item.completed ? '✓ Đã xong' : '⏳ Đang làm'}
          </td>
        </tr>
      `
          )
          .join('')
      : `
      <tr>
        <td colspan="5" style="text-align: center; padding: 12px; border: 1px solid #cbd5e1; color: #64748b; font-style: italic;">
          Không có phân công nhiệm vụ mới phát sinh trong cuộc họp.
        </td>
      </tr>
    `;

  // Tạo danh sách lời thoại Transcript
  const transcriptRows =
    transcript.length > 0
      ? transcript
          .map(
            (tr) => `
        <div style="margin-bottom: 8px; line-height: 1.5; font-size: 13px;">
          <strong style="color: #1e3a8a;">[${tr.time || '00:00'}] ${tr.speaker || 'Thành viên'}:</strong>
          <span style="color: #334155;">${tr.text || ''}</span>
        </div>
      `
          )
          .join('')
      : '<p style="color: #64748b; font-style: italic; font-size: 13px;">Không có bản ghi lời thoại chi tiết.</p>';

  return `
    <div class="meeting-document" style="font-family: 'Times New Roman', Times, serif; color: #0f172a; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 30px 40px; background: #ffffff;">
      
      <!-- 1. QUỐC HIỆU VÀ CƠ QUAN CHỦ QUẢN THEO THỂ THỨC VĂN BẢN HÀNH CHÍNH -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: none;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #1e293b;">TRƯỜNG ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</div>
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #1e3a8a;">KHOA KHOA HỌC MÁY TÍNH</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Hệ thống Trợ lý Phòng họp AI SmartMeet</div>
            <div style="width: 80px; height: 1px; background: #cbd5e1; margin: 6px auto 0;"></div>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #1e293b;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style="font-size: 12px; font-weight: bold; color: #1e293b;">Độc lập - Tự do - Hạnh phúc</div>
            <div style="width: 120px; height: 1px; background: #0f172a; margin: 6px auto 0;"></div>
            <div style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 6px;">Đà Nẵng, ngày ${date}</div>
          </td>
        </tr>
      </table>

      <!-- 2. TIÊU ĐỀ BIÊN BẢN -->
      <div style="text-align: center; margin: 25px 0 30px;">
        <h1 style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 0; color: #0f172a; letter-spacing: 0.5px;">
          BIÊN BẢN CUỘC HỌP THÔNG MINH
        </h1>
        <div style="font-size: 13px; font-weight: bold; color: #2563eb; margin-top: 6px;">
          Mã biên bản: ${id} / BB-AI-SMARTMEET
        </div>
        <div style="font-size: 15px; font-weight: bold; color: #1e3a8a; margin-top: 4px;">
          V/v: ${title}
        </div>
      </div>

      <!-- 3. THÔNG TIN CHUNG CUỘC HỌP -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          I. THÔNG TIN CHUNG CUỘC HỌP
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: none;">
          <tr>
            <td style="width: 25%; padding: 4px 0; font-weight: bold; border: none;">• Thời gian bắt đầu:</td>
            <td style="width: 75%; padding: 4px 0; border: none;">${date} lúc ${time}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold; border: none;">• Thời lượng họp:</td>
            <td style="padding: 4px 0; border: none;">${duration}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold; border: none;">• Chủ trì cuộc họp:</td>
            <td style="padding: 4px 0; border: none;">${host}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold; border: none;">• Thành phần tham dự:</td>
            <td style="padding: 4px 0; border: none;">${attendeeNames}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-weight: bold; border: none;">• Công nghệ hỗ trợ:</td>
            <td style="padding: 4px 0; border: none;">OpenAI Whisper (STT) & Google Gemini 1.5 Pro (LLM)</td>
          </tr>
        </table>
      </div>

      <!-- 4. TÓM TẮT ĐIỀU HÀNH -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          II. TÓM TẮT TỔNG QUAN (EXECUTIVE SUMMARY)
        </h2>
        <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 12px 16px; font-size: 13px; text-align: justify; line-height: 1.7; border-radius: 4px;">
          ${executive}
        </div>
      </div>

      <!-- 5. CÁC NỘI DUNG THẢO LUẬN CỐT LÕI -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          III. NỘI DUNG THẢO LUẬN TRỌNG TÂM (KEY POINTS)
        </h2>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
          ${keyPoints.map((kp) => `<li style="margin-bottom: 6px; text-align: justify;">${kp}</li>`).join('')}
        </ul>
      </div>

      <!-- 6. CÁC QUYẾT ĐỊNH ĐÃ THỐNG NHẤT -->
      <div style="margin-bottom: 22px;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          IV. CÁC QUYẾT ĐỊNH ĐÃ THỐNG NHẤT (KEY DECISIONS)
        </h2>
        <ol style="margin: 0; padding-left: 20px; font-size: 13px;">
          ${decisions.map((dec) => `<li style="margin-bottom: 6px; text-align: justify; font-weight: 500;">${dec}</li>`).join('')}
        </ol>
      </div>

      <!-- 7. BẢNG PHÂN CÔNG NHIỆM VỤ (ACTION ITEMS) -->
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          V. DANH SÁCH CÔNG VIỆC CẦN THỰC HIỆN (ACTION ITEMS)
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
          <thead>
            <tr style="background: #f1f5f9; color: #1e293b;">
              <th style="width: 8%; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: bold;">STT</th>
              <th style="width: 48%; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: bold;">Nội dung công việc</th>
              <th style="width: 18%; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: bold;">Người thực hiện</th>
              <th style="width: 14%; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: bold;">Thời hạn</th>
              <th style="width: 12%; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: bold;">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            ${actionItemsRows}
          </tbody>
        </table>
      </div>

      <!-- 8. TOÀN VĂN LỜI THOẠI (TRANSCRIPT) -->
      <div style="margin-bottom: 28px; page-break-inside: avoid;">
        <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px;">
          VI. BẢN GHI LỜI THOẠI HỘI THOẠI (WHISPER STT TRANSCRIPT)
        </h2>
        <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; max-height: 400px; overflow-y: auto;">
          ${transcriptRows}
        </div>
      </div>

      <!-- 9. PHẦN KÝ XÁC NHẬN -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 35px; page-break-inside: avoid; border: none;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
            <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #1e293b;">TRỢ LÝ AI SECRETARY</div>
            <div style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 2px;">(Ký điện tử & Chứng thực)</div>
            <div style="height: 60px; display: flex; align-items: center; justify-content: center; color: #2563eb; font-weight: bold; font-family: monospace; font-size: 14px;">
              [AI SmartMeet Verified]
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #1e3a8a;">AI Secretary Core 2.0</div>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
            <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #1e293b;">CHỦ TRÌ CUỘC HỌP</div>
            <div style="font-size: 11px; font-style: italic; color: #64748b; margin-top: 2px;">(Ký và ghi rõ họ tên)</div>
            <div style="height: 60px;"></div>
            <div style="font-size: 13px; font-weight: bold; color: #0f172a;">${host}</div>
          </td>
        </tr>
      </table>

    </div>
  `;
}

/**
 * Xuất biên bản cuộc họp ra tệp tin Microsoft Word (.doc / .docx)
 * Sử dụng định dạng HTML wrapper tương thích Word có bảng mã UTF-8 BOM
 * @param {Object} meetingData - Dữ liệu chi tiết cuộc họp
 * @returns {boolean} - Kết quả xuất file
 */
export function exportMeetingToWord(meetingData) {
  try {
    if (!meetingData) {
      console.warn('[ExportWord] Thiếu dữ liệu cuộc họp để xuất.');
      return false;
    }

    const meetingContent = generateMeetingHTML(meetingData);
    const fileName = `${meetingData.id || 'Meeting'}_BienBanHop_${Date.now()}.doc`;

    // Khởi tạo tài liệu XML Word hoàn chỉnh với cấu hình lề A4
    const wordDocument = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${meetingData.title || 'Biên bản cuộc họp'}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 21.0cm 29.7cm;
            margin: 2.0cm 2.0cm 2.0cm 2.0cm;
            mso-page-orientation: portrait;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
          }
          div.Section1 {
            page: Section1;
          }
          body {
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.5;
            color: #000000;
          }
          table {
            border-collapse: collapse;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${meetingContent}
        </div>
      </body>
      </html>
    `;

    // Sử dụng ký tự \ufeff (UTF-8 Byte Order Mark) để Word hiển thị tiếng Việt có dấu 100% không bị lỗi font
    const blob = new Blob(['\ufeff', wordDocument], {
      type: 'application/msword;charset=utf-8',
    });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);

    console.log(`[ExportWord] Đã xuất thành công tệp: ${fileName}`);
    return true;
  } catch (err) {
    console.error('[ExportWord] Lỗi khi tạo tệp Word:', err);
    return false;
  }
}

/**
 * Xuất biên bản cuộc họp ra tệp tin PDF chuẩn in ấn A4
 * Mở cửa sổ in chuyên nghiệp giữ nguyên định dạng vector sắc nét
 * @param {Object} meetingData - Dữ liệu chi tiết cuộc họp
 * @returns {boolean} - Kết quả mở cửa sổ in PDF
 */
export function exportMeetingToPDF(meetingData) {
  try {
    if (!meetingData) {
      console.warn('[ExportPDF] Thiếu dữ liệu cuộc họp để xuất.');
      return false;
    }

    const meetingContent = generateMeetingHTML(meetingData);
    const printWindow = window.open('', '_blank', 'width=900,height=800');

    if (!printWindow) {
      alert('Vui lòng cho phép mở popup trên trình duyệt để xuất tệp PDF.');
      return false;
    }

    const printDocument = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>Biên bản cuộc họp - ${meetingData.title || ''}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 20mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Times New Roman', Times, serif;
            color: #0f172a;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            body {
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
          table {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        ${meetingContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printDocument);
    printWindow.document.close();

    console.log('[ExportPDF] Đã mở cửa sổ in ấn tạo PDF.');
    return true;
  } catch (err) {
    console.error('[ExportPDF] Lỗi khi tạo PDF:', err);
    return false;
  }
}

export default {
  generateMeetingHTML,
  exportMeetingToWord,
  exportMeetingToPDF,
};
