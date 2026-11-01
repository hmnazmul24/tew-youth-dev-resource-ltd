import {
    BLOOD_GROUPS,
    ENROLLMENT_STATUS,
    GENDER,
} from "@/features/app/branch/students/constants"
import {
    date,
    index,
    integer,
    jsonb,
    pgEnum,
    pgSequence,
    snakeCase,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import {
    createdAt,
    id,
    paymentStatusEnum,
    updatedAt,
} from "../helpers"
import { UploadedFileType } from "../types"
import { organizations } from "./auth"
import { courses } from "./courses"

export const genderEnum = pgEnum("gender", GENDER)

export const bloodGroupEnum = pgEnum(
    "blood_group",
    BLOOD_GROUPS,
)

export const students = snakeCase.table(
    "students",
    {
        id,

        image: jsonb().$type<UploadedFileType>().notNull(),

        name: varchar("name", {
            length: 150,
        }).notNull(),

        fatherName: varchar("father_name", {
            length: 150,
        }).notNull(),

        motherName: varchar("mother_name", {
            length: 150,
        }).notNull(),

        mobile: varchar("mobile", {
            length: 20,
        })
            .notNull()
            .unique(),

        email: varchar("email", {
            length: 255,
        }),

        religion: varchar("religion", {
            length: 50,
        }).notNull(),

        bloodGroup: bloodGroupEnum("blood_group").notNull(),

        nationality: varchar("nationality", {
            length: 100,
        }).notNull(),

        gender: genderEnum("gender").notNull(),

        dateOfBirth: date("date_of_birth", {
            mode: "date",
        }).notNull(),
        organizationId: text("organization_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "set null",
            }),

        createdAt,
        updatedAt,
    },
    (table) => [
        index("students_mobile_idx").on(table.mobile),
        index("students_name_idx").on(table.name),
    ],
)

export const studentAcademicQualifications =
    snakeCase.table(
        "student_academic_qualifications",
        {
            id,

            studentId: uuid("student_id")
                .notNull()
                .references(() => students.id, {
                    onDelete: "cascade",
                }),

            level: varchar("level", {
                length: 100,
            }).notNull(),

            institution: varchar("institution", {
                length: 200,
            }).notNull(),

            passingYear: integer("passing_year").notNull(),

            rollId: varchar("roll_id", {
                length: 50,
            }).notNull(),

            result: varchar("result", {
                length: 50,
            }).notNull(),

            createdAt,
            updatedAt,
        },
        (table) => [
            index(
                "student_academic_qualifications_student_id_idx",
            ).on(table.studentId),
        ],
    )

export const enrollmentRollNumberSeq = pgSequence(
    "enrollment_roll_number_seq",
    {
        startWith: 246200,
        increment: 1,
        minValue: 246200,
    },
)

export const enrollmentRegistrationNumberSeq = pgSequence(
    "enrollment_registration_number_seq",
    {
        startWith: 1293330100,
        increment: 1,
        minValue: 1293330100,
    },
)

export const enrollmentSerialNoSeq = pgSequence(
    "enrollment_serial_no_seq",
    {
        startWith: 28810,
        increment: 1,
        minValue: 28810,
    },
)
export const enrollmentStatusEnum = pgEnum(
    "enrollment_status",
    ENROLLMENT_STATUS,
)

export const enrollments = snakeCase.table(
    "enrollments",

    {
        id,

        studentId: uuid("student_id")
            .notNull()
            .references(() => students.id, {
                onDelete: "cascade",
            }),

        courseId: uuid("course_id")
            .notNull()
            .references(() => courses.id, {
                onDelete: "restrict",
            }),

        registrationNumber: varchar("registration_number", {
            length: 40,
        }).notNull(),

        rollNumber: varchar("roll_number", {
            length: 30,
        }).notNull(),
        serialNo: varchar("serial_no", {
            length: 20,
        })
            .notNull()
            .unique(),

        courseDuration: varchar("course_duration", {
            length: 100,
        }).notNull(),

        courseRange: varchar("course_range", {
            length: 100,
        }).notNull(),

        medium: varchar("medium", {
            length: 50,
        }).notNull(),

        status: enrollmentStatusEnum("status")
            .notNull()
            .default("active"),

        paymentStatus: paymentStatusEnum("payment_status")
            .notNull()
            .default("unpaid"),

        result: varchar(),

        createdAt,
        updatedAt,
    },
    (table) => [
        uniqueIndex(
            "enrollments_registration_number_unique",
        ).on(table.registrationNumber),
        uniqueIndex("enrollments_roll_number_unique").on(
            table.rollNumber,
        ),
        uniqueIndex("enrollments_serial_no_unique").on(
            table.serialNo,
        ),
        index("enrollments_student_id_idx").on(
            table.studentId,
        ),

        index("enrollments_course_id_idx").on(
            table.courseId,
        ),
        index("enrollments_status_idx").on(table.status),
    ],
)
export const enrollmentNotes = snakeCase.table(
    "enrollment_notes",

    {
        id,
        enrollmentId: uuid()
            .notNull()
            .references(() => enrollments.id, {
                onDelete: "cascade",
            }),

        note: text().notNull(),
        timeStamp: timestamp().defaultNow().notNull(),
    },
)

export const typingCertificates = snakeCase.table(
    "typing_certificates",
    {
        id,

        name: varchar("name", {
            length: 150,
        }).notNull(),

        roll: varchar("roll", {
            length: 30,
        }).notNull(),

        userId: text("user_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),

        wpm: integer("wpm").notNull(),

        createdAt,
        updatedAt,
    },
    (table) => [
        index("typing_certificates_user_id_idx").on(
            table.userId,
        ),
        index("typing_certificates_roll_idx").on(
            table.roll,
        ),
    ],
)

export const designCertificates = snakeCase.table(
    "design_certificates",
    {
        id,

        name: varchar("name", {
            length: 150,
        }).notNull(),

        roll: varchar("roll", {
            length: 30,
        }).notNull(),

        userId: text("user_id")
            .notNull()
            .references(() => organizations.id, {
                onDelete: "cascade",
            }),

        session: varchar("session", {
            length: 100,
        }).notNull(),

        createdAt,
        updatedAt,
    },
    (table) => [
        index("design_certificates_user_id_idx").on(
            table.userId,
        ),
        index("design_certificates_roll_idx").on(
            table.roll,
        ),
    ],
)
