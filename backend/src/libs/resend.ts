import {type CreateEmailResponse, Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API!);

export function emailTest():Promise<CreateEmailResponse> {
    return resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [process.env.RESEND_DEV_EMAIL!],
        subject: 'hello world',
        html: '<p>it works!</p>',
    });
}