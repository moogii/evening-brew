import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";


@Injectable()
export class MailService {
  client: SESClient = null;
  constructor(private config: ConfigService) {
    this.client = new SESClient({
      region: config.get('AWS_REGION'),
      credentials: {
        accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  // TODO: use aws-ses template
  // TODO: use redis queue
  async sendMail(to: string, subject: string, templateName: string, data?: ejs.Data): Promise<void> {
    try {

      const html = this.loadTemplate(templateName, data);

      this.client.send(new SendEmailCommand({
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: html,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: this.config.get('MAIL_SENDER'),
      }));
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
