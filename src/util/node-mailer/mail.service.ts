import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    sendMail(email, authenticationCdoe): boolean {
        this.mailerService
            .sendMail({
                to: email,
                from: 'noreplyhomeparty@gmail.com',
                subject: '홈파티 인증번호',
                text: '홈파티 인증번호 입력해',
                html: `<b>인증번호 ${authenticationCdoe}</b>`,
            })
            .then((result) => {
            })
            .catch((error) => {
                new ConflictException(error.message);
            });
        return true;
    }
}
