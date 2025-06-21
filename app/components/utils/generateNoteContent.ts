// utils/generateNoteContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generateNoteContent = (note: any): docx.Paragraph[] => {
  try {
    const masTitleNote = createPageData.find((item) => item.type === 'notes')?.masTitle || [];
    const noteChildren: docx.Paragraph[] = [];
    console.log('masTitleNote: ', masTitleNote);
    noteChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: note.info?.title?.value || 'Заметка без названия',
            bold: true,
          }),
        ],
      })
    );

    noteChildren.push(
      ...masTitleNote.map((item) => {
        const value = note.info && note.info[item.key]?.value ? note.info[item.key]?.value : ''; // Add null check
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

    noteChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания заметки: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(note.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    noteChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления заметки: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(note.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    noteChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: note.markerColor,
            color: note.markerColor,
          }),
        ],
      })
    );

    return noteChildren;
  } catch (error: any) {
    console.error('Error in generateNoteContent:', error);
    return []; // Return an empty array to avoid crashing the entire export
  }
};

export default generateNoteContent;
