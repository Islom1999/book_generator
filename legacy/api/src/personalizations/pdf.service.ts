import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';
import { Personalization } from '../entities/personalization.entity';

@Injectable()
export class PdfService {
  private readonly pageW = 480;
  private readonly pageH = 640;
  private readonly fontReg = join(process.cwd(), 'assets/fonts/NotoSans-Regular.ttf');
  private readonly fontBold = join(process.cwd(), 'assets/fonts/NotoSans-Bold.ttf');

  build(row: Personalization): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [this.pageW, this.pageH],
        margin: 0,
        info: {
          Title: row.generatedTitle || `${row.childName} — Ertaklar`,
          Author: 'Ertaklar.uz',
        },
      });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pages = row.pages || [];
      if (!pages.length) {
        this.fullPage(doc, null, row.generatedTitle || row.book.titleUz, row.dedication || '');
      }
      pages.forEach((page, i) => {
        if (i > 0) doc.addPage({ size: [this.pageW, this.pageH], margin: 0 });
        const heading = i === 0 ? row.generatedTitle || row.book.titleUz : undefined;
        this.fullPage(doc, page.imageUrl, heading, page.text);
      });
      doc.end();
    });
  }

  private fullPage(
    doc: PDFKit.PDFDocument,
    imageUrl: string | null | undefined,
    heading: string | undefined,
    text: string,
  ) {
    const imgPath = this.localPath(imageUrl);
    if (imgPath) {
      this.drawImage(doc, imgPath);
    } else {
      doc.rect(0, 0, this.pageW, this.pageH).fill('#f3ecde');
    }

    const tx = 28;
    const tw = this.pageW - 56;

    if (heading) {
      doc.save();
      doc.rect(0, 0, this.pageW, 92).fillOpacity(0.35).fill('#1a1230');
      doc.restore();
      this.useBold(doc);
      doc.fontSize(18).fillColor('#ffffff').text(heading, tx, 22, {
        width: tw,
        align: 'center',
        lineGap: 2,
      });
    }

    const bandH = heading ? 96 : 118;
    doc.save();
    doc.rect(0, this.pageH - bandH, this.pageW, bandH).fillOpacity(0.42).fill('#140e28');
    doc.restore();
    this.useReg(doc);
    doc.fontSize(12).fillColor('#ffffff').text(text || '', tx, this.pageH - bandH + 18, {
      width: tw,
      align: 'left',
      lineGap: 3,
    });
  }

  /** Fill the page, keep the top of the illustration (crop sides/bottom if needed). */
  private drawImage(doc: PDFKit.PDFDocument, imgPath: string) {
    try {
      const size = this.rasterSize(imgPath);
      const scale = size
        ? Math.max(this.pageW / size.width, this.pageH / size.height)
        : 1;
      const w = size ? size.width * scale : this.pageW;
      const h = size ? size.height * scale : this.pageH;
      const x = (this.pageW - w) / 2;
      doc.save();
      doc.rect(0, 0, this.pageW, this.pageH).clip();
      doc.image(imgPath, x, 0, { width: w, height: h });
      doc.restore();
    } catch {
      doc.rect(0, 0, this.pageW, this.pageH).fill('#f3ecde');
    }
  }

  private rasterSize(path: string): { width: number; height: number } | null {
    const buf = readFileSync(path);
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    let i = 2;
    while (i + 8 < buf.length && buf[i] === 0xff) {
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
    return null;
  }

  private useReg(doc: PDFKit.PDFDocument) {
    if (existsSync(this.fontReg)) doc.font(this.fontReg);
  }

  private useBold(doc: PDFKit.PDFDocument) {
    if (existsSync(this.fontBold)) doc.font(this.fontBold);
    else this.useReg(doc);
  }

  private localPath(url: string | null | undefined) {
    if (!url) return null;
    const idx = url.indexOf('/uploads/');
    if (idx < 0) return null;
    const abs = join(process.cwd(), 'uploads', url.slice(idx + '/uploads/'.length));
    return existsSync(abs) ? abs : null;
  }
}
