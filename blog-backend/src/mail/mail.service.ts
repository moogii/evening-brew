import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { SESClient } from "@aws-sdk/client-ses";


@Injectable()
export class MailService {
  client = null;
  constructor(private config: ConfigService) {
    this.client = new SESClient({
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendMail(to: string, subject: string, templateName: string, data?: ejs.Data): Promise<void> {
    try {

      const html = this.loadTemplate(templateName, data);

      const response = await this.client.sendEmail({
        Destination: {
          toAddresses: [to]
        },
        Message: {
          Body: {
            Html: {
              charset: "UTF-8",
              Data: html,
            },
          },
          Subject: {
            charset: "UTF-8",
            Data: subject,
          },
        },
        source: this.config.get('MAIL_SENDER'),
      });

    } catch (error) {
      throw error;
    }
    return;
  }


  // instead of this you can use aws-ses template.
  private loadTemplate(templateName: string, data?: ejs.Data) {
    try {
      const template = fs.readFileSync(path.resolve(__dirname, `./templates/${templateName}.ejs`), 'utf8');
      const html = ejs.render(template, data, { async: false })
      return html;
    } catch (error) {
      throw error;
    }
  }
}
