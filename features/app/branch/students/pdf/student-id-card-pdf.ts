import { jsPDF } from "jspdf"

export type StudentIdCardData = {
    student: {
        name: string
        idNumber: string
        email: string
        social: string
        phone: string
        imageUrl: string
        institutionName: string
    }
}

const PAGE = {
    width: 210,
    height: 297,
}

const CARD = {
    width: 54,
    height: 85,
    gap: 5,
    columns: 3,
    rows: 3,
    marginX: 19,
    marginY: 16,
}

const CARDS_PER_PAGE = CARD.columns * CARD.rows

/**
 * Loads an image from a URL.
 */
const loadImage = (
    src: string,
): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()

        image.onload = () => resolve(image)
        image.onerror = () =>
            reject(
                new Error(`Failed to load image: ${src}`),
            )

        image.crossOrigin = "anonymous"
        image.src = src
    })

/**
 * Converts an image into a PNG data URL.
 */
const imageToDataURL = (
    image: HTMLImageElement,
): string => {
    const canvas = document.createElement("canvas")

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const context = canvas.getContext("2d")

    if (!context) {
        throw new Error("Could not create image canvas")
    }

    context.drawImage(image, 0, 0)

    return canvas.toDataURL("image/png")
}

/**
 * Crops a profile image into a circular PNG.
 */
const createCircularProfileImage = (
    image: HTMLImageElement,
    size = 400,
): string => {
    const canvas = document.createElement("canvas")

    canvas.width = size
    canvas.height = size

    const context = canvas.getContext("2d")

    if (!context) {
        throw new Error(
            "Could not create profile image canvas",
        )
    }

    const sourceSize = Math.min(
        image.naturalWidth,
        image.naturalHeight,
    )

    const sourceX = (image.naturalWidth - sourceSize) / 2
    const sourceY = (image.naturalHeight - sourceSize) / 2

    context.beginPath()
    context.arc(
        size / 2,
        size / 2,
        size / 2,
        0,
        Math.PI * 2,
    )
    context.clip()

    context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size,
    )

    return canvas.toDataURL("image/png")
}

/**
 * Draws a single-line value without overflowing its available width.
 * Very long values are shortened with an ellipsis if necessary.
 */
const drawFittedText = (
    doc: jsPDF,
    value: string,
    x: number,
    y: number,
    maxWidth: number,
    initialFontSize = 8,
) => {
    let text = value?.trim() || "N/A"
    let fontSize = initialFontSize

    doc.setFont("helvetica", "bold")
    doc.setFontSize(fontSize)

    while (
        doc.getTextWidth(text) > maxWidth &&
        fontSize > 4.5
    ) {
        fontSize -= 0.25
        doc.setFontSize(fontSize)
    }

    if (doc.getTextWidth(text) > maxWidth) {
        while (
            text.length > 0 &&
            doc.getTextWidth(`${text}...`) > maxWidth
        ) {
            text = text.slice(0, -1)
        }

        text = text ? `${text}...` : "..."
    }

    doc.text(text, x, y)
}

/**
 * Adds small cutting marks outside the card corners.
 */
const drawCropMarks = (
    doc: jsPDF,
    x: number,
    y: number,
) => {
    const { width, height } = CARD
    const offset = 0.6
    const length = 1.8

    doc.setDrawColor(90, 90, 90)
    doc.setLineWidth(0.12)

    // Top-left
    doc.line(x - offset - length, y, x - offset, y)
    doc.line(x, y - offset - length, x, y - offset)

    // Top-right
    doc.line(
        x + width + offset,
        y,
        x + width + offset + length,
        y,
    )
    doc.line(
        x + width,
        y - offset - length,
        x + width,
        y - offset,
    )

    // Bottom-left
    doc.line(
        x - offset - length,
        y + height,
        x - offset,
        y + height,
    )
    doc.line(
        x,
        y + height + offset,
        x,
        y + height + offset + length,
    )

    // Bottom-right
    doc.line(
        x + width + offset,
        y + height,
        x + width + offset + length,
        y + height,
    )
    doc.line(
        x + width,
        y + height + offset,
        x + width,
        y + height + offset + length,
    )
}

/**
 * Draws one portrait ID card.
 *
 * The template should be located at:
 * public/student-id-card.png
 *
 * Template layout must match the supplied screenshot:
 * - Orange header and footer
 * - Blue circular photo border
 * - "Student Id Card" title
 * - ID No, Email, Social and Phone labels
 */
const drawStudentCard = (
    doc: jsPDF,
    templateData: string,
    student: StudentIdCardData["student"],
    profileImageData: string | null,
    x: number,
    y: number,
) => {
    // 1. Draw the background template at the exact card size.
    doc.addImage(
        templateData,
        "PNG",
        x,
        y,
        CARD.width,
        CARD.height,
    )

    // 2. Cover the sample profile photo inside the existing ring.
    // The white circle preserves the surrounding blue/yellow border.
    const photoX = x + 14.7
    const photoY = y + 8.8
    const photoSize = 24.4

    doc.setFillColor(255, 255, 255)
    doc.circle(
        photoX + photoSize / 2,
        photoY + photoSize / 2,
        photoSize / 2,
        "F",
    )

    // Draw the actual student's circular photo.
    if (profileImageData) {
        doc.addImage(
            profileImageData,
            "PNG",
            photoX,
            photoY,
            photoSize,
            photoSize,
        )
    }

    // 3. Clear the template's sample field VALUES only.
    // The existing labels remain visible.
    doc.setFillColor(255, 255, 255)

    doc.rect(x + 18.7, y + 49.3, 34.3, 18, "F")

    // 4. Draw the new student information.
    // Coordinates are relative to the top-left of the card.
    const fields = [
        {
            value: student.idNumber,
            y: 51.7,
            fontSize: 8,
        },
        {
            value: student.email,
            y: 55.6,
            fontSize: 8,
        },
        {
            value: student.social,
            y: 59.5,
            fontSize: 8,
        },
        {
            value: student.phone,
            y: 63.4,
            fontSize: 8,
        },
    ]

    fields.forEach(({ value, y: textY, fontSize }) => {
        drawFittedText(
            doc,
            value,
            x + 19.5,
            y + textY,
            31.5,
            fontSize,
        )
    })

    // 5. Replace the sample institution name in the footer.
    // Retain the orange background.
    doc.setFillColor(255, 190, 87)

    doc.rect(x + 0.5, y + 72.5, 53, 12, "F")

    doc.setTextColor(22, 39, 63)

    drawFittedText(
        doc,
        student.institutionName,
        x + 4,
        y + 79.7,
        46,
        11,
    )

    // 6. Add cutting marks.
    drawCropMarks(doc, x, y)
}

/**
 * Generates a multi-page, A4 portrait PDF containing student ID cards.
 *
 * Layout:
 * - Paper: A4 (210 × 297 mm)
 * - Card: 54 × 85 mm
 * - Grid: 3 columns × 3 rows
 * - Gap: 5 mm
 * - Left/right margins: 19 mm
 * - Top/bottom margins: 16 mm
 *
 * Cards are filled from top-left to right, then downward.
 */
export const studentIdCardsPDF = async (
    students: StudentIdCardData[],
): Promise<void> => {
    if (students.length === 0) {
        throw new Error(
            "Cannot generate ID cards: no students were provided.",
        )
    }

    // Validate the exact requested geometry.
    const gridWidth =
        CARD.columns * CARD.width +
        (CARD.columns - 1) * CARD.gap

    const gridHeight =
        CARD.rows * CARD.height + (CARD.rows - 1) * CARD.gap

    const horizontalMargin = (PAGE.width - gridWidth) / 2
    const verticalMargin = (PAGE.height - gridHeight) / 2

    if (
        horizontalMargin !== CARD.marginX ||
        verticalMargin !== CARD.marginY
    ) {
        throw new Error(
            "The ID card dimensions do not match the specified A4 layout.",
        )
    }

    // A4 portrait PDF.
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
    })

    // Load the template once.
    const template = await loadImage("/student-id-card.png")
    const templateData = imageToDataURL(template)

    // Load profile images concurrently.
    // If an individual profile image fails, that card is still generated.
    const profileImages = await Promise.all(
        students.map(async ({ student }) => {
            if (!student.imageUrl) {
                return null
            }

            try {
                const image = await loadImage(
                    student.imageUrl,
                )

                return createCircularProfileImage(image)
            } catch (error) {
                console.warn(
                    `Could not load profile photo for "${student.name}".`,
                    error,
                )

                return null
            }
        }),
    )

    const pageCount = Math.ceil(
        students.length / CARDS_PER_PAGE,
    )

    for (let page = 0; page < pageCount; page++) {
        if (page > 0) {
            doc.addPage("a4", "portrait")
        }

        const firstIndex = page * CARDS_PER_PAGE

        const lastIndex = Math.min(
            firstIndex + CARDS_PER_PAGE,
            students.length,
        )

        for (
            let index = firstIndex;
            index < lastIndex;
            index++
        ) {
            const slot = index - firstIndex

            const column = slot % CARD.columns
            const row = Math.floor(slot / CARD.columns)

            // Fixed top-left anchor.
            // X: 19, 78, 137 mm
            // Y: 16, 106, 196 mm
            const x =
                CARD.marginX +
                column * (CARD.width + CARD.gap)

            const y =
                CARD.marginY +
                row * (CARD.height + CARD.gap)

            drawStudentCard(
                doc,
                templateData,
                students[index].student,
                profileImages[index],
                x,
                y,
            )
        }
    }

    // Generate a safe output filename.
    const institutionName =
        students[0].student.institutionName || "students"

    const safeName =
        institutionName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "") || "students"

    doc.save(`${safeName}_student_id_cards.pdf`)
}
