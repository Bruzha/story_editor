// utils/generateObjectContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData'; // Adjust the path
import moment from 'moment';

const generateObjectContent = (object: any): docx.Paragraph[] => {
  try {
    const masTitleObject = createPageData.find((item) => item.type === 'objects')?.masTitle || [];
    const objectChildren: docx.Paragraph[] = [];

    objectChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: object.info?.name?.value || 'Объект без названия',
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: object.markerColor || '000000',
            },
          }),
        ],
      })
    );

    objectChildren.push(
      ...masTitleObject.map((item) => {
        const value = object.info && object.info[item.key]?.value ? object.info[item.key]?.value : '';
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

    objectChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания объекта: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(object.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    objectChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления объекта: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(object.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    objectChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: object.markerColor,
            color: object.markerColor,
          }),
        ],
      })
    );

    return objectChildren;
  } catch (error: any) {
    console.error('Error in generateObjectContent:', error);
    return [];
  }
};

export default generateObjectContent;
