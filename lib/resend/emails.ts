import "server-only"
import { Resend } from "resend"
import { ResetPasswordTemplate } from "./ui/reset-password-template"
import {
    ApproveBranchEmailTemplateProps,
    BranchApprovedTemplate,
} from "./ui/branch-approved-template"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailResetPassword(
    email: string,
    url: string,
    firstName: string,
) {
    const res = await resend.emails.send({
        from: "Acme <noreply@yourdomain.com>",
        to: [email],
        subject: "Reset your password",
        react: ResetPasswordTemplate({
            firstName,
            url,
            email,
        }),
    })

    console.log("mail-res=>", res)
}
export async function sendEmailBranchApproved(
    props: ApproveBranchEmailTemplateProps,
) {
    const res = await resend.emails.send({
        from: "Acme <noreply@yourdomain.com>",
        to: [props.email],
        subject: "Your Branch has been approved",
        react: BranchApprovedTemplate(props),
    })

    console.log("mail-res=>", res)
}
