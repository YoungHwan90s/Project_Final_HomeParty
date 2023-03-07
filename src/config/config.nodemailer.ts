import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        return {
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: this.configService.get<string>('USEREMAIL'),
                    pass: this.configService.get<string>('PASSWORD'),
                },
            },
            defaults: {
                from: '"homeparty" <noreply@home-party.com>',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new EjsAdapter(),
                options: {
                    strict: true,
                },
            },
        };
    }
}
