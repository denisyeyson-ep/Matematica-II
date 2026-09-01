"""Generate the student-facing PDF manual from docs/MANUAL_DESPLIEGUE.md."""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "MANUAL_DESPLIEGUE.md"
OUTPUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "Manual_Portafolio_Astro_Matematica.pdf"
NAVY = colors.HexColor("#101b32")
MIDNIGHT = colors.HexColor("#17243d")
ACCENT = colors.HexColor("#087e97")
MUTED = colors.HexColor("#52627d")
PALE = colors.HexColor("#edf7fa")
LINE = colors.HexColor("#dce5ef")


def register_fonts() -> None:
    directory = Path("/usr/share/fonts/truetype/dejavu")
    pdfmetrics.registerFont(TTFont("GuideSans", str(directory / "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont("GuideBold", str(directory / "DejaVuSans-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("GuideMono", str(directory / "DejaVuSansMono.ttf")))
    pdfmetrics.registerFontFamily("GuideSans", normal="GuideSans", bold="GuideBold")


def stylebook() -> dict[str, ParagraphStyle]:
    styles = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "GuideCoverKicker", fontName="GuideBold", fontSize=10, leading=15,
            textColor=ACCENT, spaceAfter=19, alignment=TA_CENTER,
        ),
        "cover_title": ParagraphStyle(
            "GuideCoverTitle", fontName="GuideBold", fontSize=31, leading=39,
            textColor=NAVY, alignment=TA_CENTER, spaceAfter=17,
        ),
        "cover_subtitle": ParagraphStyle(
            "GuideCoverSubtitle", fontName="GuideSans", fontSize=12, leading=19,
            textColor=MUTED, alignment=TA_CENTER, spaceAfter=22,
        ),
        "section": ParagraphStyle(
            "GuideSection", fontName="GuideBold", fontSize=15, leading=21,
            textColor=NAVY, spaceBefore=18, spaceAfter=8, keepWithNext=True,
        ),
        "subsection": ParagraphStyle(
            "GuideSubsection", fontName="GuideBold", fontSize=10.5, leading=15,
            textColor=ACCENT, spaceBefore=12, spaceAfter=5, keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "GuideBody", parent=styles["BodyText"], fontName="GuideSans",
            fontSize=9.1, leading=14.2, textColor=MUTED, spaceAfter=7,
            allowWidows=0, allowOrphans=0,
        ),
        "bullet": ParagraphStyle(
            "GuideBullet", fontName="GuideSans", fontSize=8.8, leading=13.8,
            textColor=MUTED, leftIndent=16, firstLineIndent=-10, spaceAfter=3,
        ),
        "code": ParagraphStyle(
            "GuideCode", fontName="GuideMono", fontSize=7.0, leading=10.5,
            textColor=NAVY, spaceAfter=0,
        ),
        "pill": ParagraphStyle(
            "GuidePill", fontName="GuideBold", fontSize=9, leading=14,
            alignment=TA_CENTER, textColor=ACCENT,
        ),
    }


def markup(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
    return escaped


def page_canvas(canvas, document) -> None:
    page_width, page_height = A4
    if document.page == 1:
        canvas.setFillColor(NAVY)
        canvas.roundRect(18 * mm, page_height - 32 * mm, page_width - 36 * mm, 2.2 * mm, 1 * mm, fill=1, stroke=0)
        return
    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, page_height - 18 * mm, page_width - 20 * mm, page_height - 18 * mm)
    canvas.setFont("GuideBold", 7.5)
    canvas.setFillColor(NAVY)
    canvas.drawString(20 * mm, page_height - 14.5 * mm, "PORTAFOLIO ACADÉMICO DE MATEMÁTICA")
    canvas.setFont("GuideSans", 7.1)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(page_width - 20 * mm, page_height - 14.5 * mm, "Manual de instalación y despliegue")
    canvas.line(20 * mm, 17 * mm, page_width - 20 * mm, 17 * mm)
    canvas.drawString(20 * mm, 12 * mm, "Denis Espinoza  |  Ingeniería de Software  |  UTP")
    canvas.drawRightString(page_width - 20 * mm, 12 * mm, "Página " + str(document.page - 1))


def code_block(lines: list[str], styles: dict[str, ParagraphStyle]) -> Table:
    content = "\n".join(lines) or " "
    pre = Preformatted(content, styles["code"], maxLineLength=83, splitChars=" /,-_.")
    table = Table([[pre]], colWidths=[168 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return table


def cover(styles: dict[str, ParagraphStyle]) -> list:
    items = [
        Spacer(1, 56 * mm),
        Paragraph("UNIVERSIDAD TECNOLÓGICA DEL PERÚ", styles["cover_kicker"]),
        Paragraph("Portafolio Académico<br/>de Matemática", styles["cover_title"]),
        Paragraph(
            "Manual completo para instalar, personalizar,<br/>editar y publicar tu proyecto Astro.",
            styles["cover_subtitle"],
        ),
        Spacer(1, 8 * mm),
    ]
    cells = [
        [Paragraph("18 semanas", styles["pill"]), Paragraph("36 sesiones", styles["pill"]), Paragraph("180 ejercicios", styles["pill"])],
    ]
    stats = Table(cells, colWidths=[51 * mm, 51 * mm, 51 * mm])
    stats.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    items.extend([
        stats,
        Spacer(1, 23 * mm),
        Paragraph("<b>Denis Espinoza</b><br/>Ingeniería de Software<br/>2026-II", styles["cover_subtitle"]),
        PageBreak(),
    ])
    return items


def parse_markdown(styles: dict[str, ParagraphStyle]) -> list:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    story = cover(styles)
    fence = chr(96) * 3
    index = 0
    while index < len(lines):
        raw = lines[index]
        stripped = raw.strip()
        if not stripped:
            index += 1
            continue
        if stripped.startswith(fence):
            index += 1
            captured: list[str] = []
            while index < len(lines) and not lines[index].strip().startswith(fence):
                captured.append(lines[index])
                index += 1
            story.append(KeepTogether([code_block(captured, styles), Spacer(1, 7)]))
            index += 1
            continue
        if stripped.startswith("# "):
            index += 1
            continue
        if stripped.startswith("## "):
            story.append(Paragraph(markup(stripped[3:]), styles["section"]))
            story.append(HRFlowable(width="100%", thickness=0.55, color=LINE, spaceAfter=7))
            index += 1
            continue
        if stripped.startswith("### "):
            story.append(Paragraph(markup(stripped[4:]), styles["subsection"]))
            index += 1
            continue
        if stripped.startswith("- "):
            story.append(Paragraph("• " + markup(stripped[2:]), styles["bullet"]))
            index += 1
            continue
        numbered = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        if numbered:
            story.append(Paragraph(numbered.group(1) + ".  " + markup(numbered.group(2)), styles["bullet"]))
            index += 1
            continue
        paragraph = [stripped]
        index += 1
        while index < len(lines):
            following = lines[index].strip()
            if (
                not following
                or following.startswith(("#", "- ", fence))
                or re.match(r"^\d+\.\s+", following)
            ):
                break
            paragraph.append(following)
            index += 1
        story.append(Paragraph(markup(" ".join(paragraph)), styles["body"]))
    return story


def main() -> None:
    register_fonts()
    styles = stylebook()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        title="Manual del Portafolio Académico de Matemática",
        author="Denis Espinoza",
        subject="Instalación, edición semanal y despliegue de un proyecto Astro",
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=25 * mm,
        bottomMargin=23 * mm,
    )
    document.build(parse_markdown(styles), onFirstPage=page_canvas, onLaterPages=page_canvas)
    print("PDF generado: " + str(OUTPUT))


if __name__ == "__main__":
    main()
