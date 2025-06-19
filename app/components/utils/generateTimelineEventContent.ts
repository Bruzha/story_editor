// utils/generateTimelineEventContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData'; // Adjust the path
import moment from 'moment';

const generateTimelineEventContent = (timelineEvent: any): docx.Paragraph[] => {
  try {
    const masTitleTimelineEvent = createPageData.find((item) => item.type === 'time_events')?.masTitle || [];
    console.log('masTitleTimelineEvent: ', masTitleTimelineEvent);
    const timelineEventChildren: docx.Paragraph[] = [];

    timelineEventChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: timelineEvent.info?.name?.value || 'Timeline Event', // Add null check
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: timelineEvent.markerColor || '000000',
            },
          }),
        ],
      })
    );

    timelineEventChildren.push(
      ...masTitleTimelineEvent.map((item) => {
        const value =
          timelineEvent.info && timelineEvent.info[item.key]?.value ? timelineEvent.info[item.key]?.value : ''; // Add null check
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

    timelineEventChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата события: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(timelineEvent.eventDate).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    timelineEventChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания события: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(timelineEvent.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    timelineEventChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления события: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(timelineEvent.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    timelineEventChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: timelineEvent.markerColor,
            color: timelineEvent.markerColor,
          }),
        ],
      })
    );

    return timelineEventChildren;
  } catch (error: any) {
    console.error('Error in generateTimelineEventContent:', error);
    return [];
  }
};

export default generateTimelineEventContent;
