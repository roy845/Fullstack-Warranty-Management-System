import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OCRService {
  private readonly MINDEE_API_KEY: string;
  private readonly MINDEE_URL: string;

  constructor(private readonly configService: ConfigService) {
    this.MINDEE_API_KEY = configService.get<string>('MINDEE_API_KEY') as string;
    this.MINDEE_URL = configService.get<string>('MINDEE_URL') as string;
  }

  private parseMindeeInvoiceResponse(data: any): Date | null {
    try {
      const prediction = data.document?.inference?.prediction;
      const invoiceDate = prediction?.date?.value;

      if (invoiceDate) {
        return new Date(invoiceDate);
      }
      return null;
    } catch (e) {
      console.error('Error parsing Mindee response:', e);
      throw new Error('Failed to parse Mindee invoice response');
    }
  }

  async parseInvoiceDate(file: Express.Multer.File): Promise<Date | null> {
    const formData = new FormData();
    formData.append('document', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const { data: mindeeResponse } = await axios.post(
        this.MINDEE_URL,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Token ${this.MINDEE_API_KEY}`,
          },
        },
      );

      return this.parseMindeeInvoiceResponse(mindeeResponse);
    } catch (error) {
      console.error(
        'Error processing invoice with Mindee:',
        error.response?.data || error,
      );
      return null;
    }
  }
}
