// utils/generateChapterContent.ts

import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generateChapterContent = (chapter: any): docx.Paragraph[] => {
  try {
    const masTitleChapter = createPageData.find((item) => item.type === 'chapters')?.masTitle || [];
    const chapterChildren: docx.Paragraph[] = [];

    chapterChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: `${chapter.info?.order.value || 'X'}. ${chapter.info?.title?.value || 'Без названия'}`,
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: chapter.markerColor || '000000',
            },
          }),
        ],
      })
    );

    chapterChildren.push(
      ...masTitleChapter.map((item) => {
        const value = chapter.info && chapter.info[item.key]?.value ? chapter.info[item.key]?.value : '';
        return new docx.Paragraph({
          style: 'Normal',
          indent: { firstLine: 425 },
          children: [
            new docx.TextRun({
              text: `${item.title}: `,
              bold: true,
            }),
            new docx.TextRun({
              text: value,
            }),
          ],
        });
      })
    );

    chapterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания главы: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(chapter.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    chapterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления главы: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(chapter.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    chapterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Статус: ',
            bold: true,
          }),
          new docx.TextRun({
            text: chapter.status,
          }),
        ],
      })
    );

    chapterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: chapter.markerColor,
            color: chapter.markerColor,
          }),
        ],
      })
    );

    return chapterChildren;
  } catch (error: any) {
    console.error('Error in generateChapterContent:', error);
    return [];
  }
};

export default generateChapterContent;
