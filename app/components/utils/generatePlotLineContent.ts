// utils/generatePlotLineContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generatePlotLineContent = (plotLine: any): docx.Paragraph[] => {
  try {
    const masTitlePlotLine = createPageData.find((item) => item.type === 'plotlines')?.masTitle || [];
    console.log('masTitlePlotLine: ', masTitlePlotLine);
    const plotLineChildren: docx.Paragraph[] = [];

    plotLineChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: plotLine.info?.name?.value || 'Сюжетная линиия без названия', // Add null check
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: plotLine.markerColor || '000000',
            },
          }),
        ],
      })
    );

    plotLineChildren.push(
      ...masTitlePlotLine.map((item) => {
        const value = plotLine.info && plotLine.info[item.key]?.value ? plotLine.info[item.key]?.value : ''; // Add null check
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

    plotLineChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Тип: ',
            bold: true,
          }),
          new docx.TextRun({
            text: plotLine.type,
          }),
        ],
      })
    );

    plotLineChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания локации: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(plotLine.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    plotLineChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления локации: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(plotLine.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    plotLineChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: plotLine.markerColor,
            color: plotLine.markerColor,
          }),
        ],
      })
    );

    return plotLineChildren;
  } catch (error: any) {
    console.error('Error in generatePlotLineContent:', error);
    return []; // Return an empty array to avoid crashing the entire export
  }
};

export default generatePlotLineContent;
