import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
    users: {
        accounts: r.many.accounts(),
        sessions: r.many.sessions(),
        members: r.many.members(),
        invitations: r.many.invitations(),
    },

    sessions: {
        user: r.one.users({
            from: r.sessions.userId,
            to: r.users.id,
        }),
    },

    accounts: {
        user: r.one.users({
            from: r.accounts.userId,
            to: r.users.id,
        }),
    },

    organizations: {
        members: r.many.members(),
        invitations: r.many.invitations(),
        organizationRoles: r.many.organizationRoles(),
        students: r.many.students(),
        tasks: r.many.tasks(),
        typingCertificates: r.many.typingCertificates(),
        designCertificates: r.many.designCertificates(),
    },

    organizationRoles: {
        organization: r.one.organizations({
            from: r.organizationRoles.organizationId,
            to: r.organizations.id,
        }),
    },
    members: {
        organization: r.one.organizations({
            from: r.members.organizationId,
            to: r.organizations.id,
        }),

        user: r.one.users({
            from: r.members.userId,
            to: r.users.id,
        }),
    },

    invitations: {
        organization: r.one.organizations({
            from: r.invitations.organizationId,
            to: r.organizations.id,
        }),

        user: r.one.users({
            from: r.invitations.inviterId,
            to: r.users.id,
        }),
    },

    courses: {
        enrollments: r.many.enrollments(),
    },
    students: {
        qualifications:
            r.many.studentAcademicQualifications(),
        enrollments: r.many.enrollments(),
        organization: r.one.organizations({
            from: r.students.organizationId,
            to: r.organizations.id,
        }),
    },

    enrollments: {
        student: r.one.students({
            from: r.enrollments.studentId,
            to: r.students.id,
        }),
        course: r.one.courses({
            from: r.enrollments.courseId,
            to: r.courses.id,
        }),
        transections: r.many.transactions(),
        enrollmentNotes: r.many.enrollmentNotes(),
    },
    branchApplications: {
        transections: r.many.transactions(),
    },
    transactions: {
        enrollment: r.one.enrollments({
            from: r.transactions.enrollmentId,
            to: r.enrollments.id,
        }),
        branchApplication: r.one.branchApplications({
            from: r.transactions.enrollmentId,
            to: r.branchApplications.id,
        }),
    },
    enrollmentNotes: {
        enrollment: r.one.enrollments({
            from: r.enrollmentNotes.enrollmentId,
            to: r.enrollments.id,
        }),
    },
    studentAcademicQualifications: {
        student: r.one.students({
            from: r.studentAcademicQualifications.studentId,
            to: r.students.id,
        }),
    },
    tasks: {
        organization: r.one.organizations({
            from: r.tasks.organizationId,
            to: r.organizations.id,
        }),
    },
    typingCertificates: {
        organization: r.one.organizations({
            from: r.typingCertificates.userId,
            to: r.organizations.id,
        }),
    },

    designCertificates: {
        organization: r.one.organizations({
            from: r.designCertificates.userId,
            to: r.organizations.id,
        }),
    },
}))
