import {type CreateEmailResponse, Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API!);

export function sendEmailCode(email:string, code:string):Promise<CreateEmailResponse> {
    return resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Auxonia Email Verification',
        html: `<p>Your verification code is: ${code}</p>`,
    });
}