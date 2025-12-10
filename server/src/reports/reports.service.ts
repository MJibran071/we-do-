
import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { StorageService } from '../storage/storage.service';
import { OperationsService } from '../operations/operations.service';
import { Buffer } from 'buffer';

@Injectable()
export class ReportsService {
    constructor(
        private readonly storageService: StorageService,
        private readonly operationsService: OperationsService
    ) { }

    async generateFinancialPDF(startDate: Date, endDate: Date) {
        const bookings = await this.operationsService.getBookings();
        // Filter logic here...
        const filtered = bookings; // Simplified for demo

        const doc = new PDFDocument();
        const filename = `financial_report_${Date.now()}.pdf`;
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        // Document Content
        doc.fontSize(20).text('Financial Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        let total = 0;
        filtered.forEach(b => {
            doc.text(`${b.guestName} - ${b.platform}: $${b.totalPrice}`);
            total += Number(b.totalPrice);
        });

        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(`Total Revenue: $${total.toFixed(2)}`);
        doc.end();

        return new Promise<string>((resolve, reject) => {
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffers);
                const file = {
                    originalname: filename,
                    buffer: pdfBuffer
                };
                const url = await this.storageService.saveFile(file);
                resolve(url);
            });
            doc.on('error', reject);
        });
    }

    async generateBookingsCSV() {
        const bookings = await this.operationsService.getBookings();
        const filename = `bookings_${Date.now()}.csv`;
        const filePath = path.join('/tmp', filename); // Temp path

        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'guestName', title: 'Guest' },
                { id: 'totalPrice', title: 'Amount' },
                { id: 'platform', title: 'Platform' },
                { id: 'status', title: 'Status' },
            ]
        });

        await csvWriter.writeRecords(bookings);

        // Read back and save to StorageService
        const buffer = await fs.readFile(filePath);
        const url = await this.storageService.saveFile({
            originalname: filename,
            buffer: buffer
        });

        await fs.remove(filePath); // Cleanup
        return url;
    }
}
