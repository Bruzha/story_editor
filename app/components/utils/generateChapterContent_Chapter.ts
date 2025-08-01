// utils/generateChapterContent.ts
import * as docx from 'docx';

const generateChapterContent_Chapter = (chapter: any): docx.Paragraph[] => {
  try {
    const chapterChildren: docx.Paragraph[] = [];

    // Add chapter title in the center of the page
    chapterChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: `${chapter.info?.order.value || 'X'}. ${chapter.info?.title?.value || 'Без названия'}`,
            bold: true,
          }),
        ],
      })
    );

    if (chapter.info?.content?.value) {
      const contentLines = chapter.info.content.value.split('\n');
      contentLines.forEach((line: any) => {
        chapterChildren.push(
          new docx.Paragraph({
            text: line,
            style: 'Normal',
            indent: { firstLine: 425 },
          })
        );
      });
    }

    return chapterChildren;
  } catch (error: any) {
    console.error('Error in generateChapterContent:', error);
    return [];
  }
};

export default generateChapterContent_Chapter;
