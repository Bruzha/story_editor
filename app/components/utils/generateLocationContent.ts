// utils/generateLocationContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generateLocationContent = (location: any): docx.Paragraph[] => {
  try {
    const masTitleLocation = createPageData.find((item) => item.type === 'locations')?.masTitle || [];
    const locationChildren: docx.Paragraph[] = [];

    locationChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: location.info?.name?.value || 'Location Name',
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: location.markerColor || '000000',
            },
          }),
        ],
      })
    );

    locationChildren.push(
      ...masTitleLocation.map((item) => {
        const value = location.info && location.info[item.key]?.value ? location.info[item.key]?.value : '';
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

    locationChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания локации: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(location.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    locationChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления локации: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(location.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    locationChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: location.markerColor,
            color: location.markerColor,
          }),
        ],
      })
    );

    return locationChildren;
  } catch (error: any) {
    console.error('Error in generateLocationContent:', error);
    return [];
  }
};

export default generateLocationContent;
