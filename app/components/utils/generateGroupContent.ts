// utils/generateGroupContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData'; // Исправьте путь, если необходимо
import moment from 'moment';

const generateGroupContent = (group: any): docx.Paragraph[] => {
  try {
    const masTitleGroup = createPageData.find((item) => item.type === 'groups')?.masTitle || [];
    const groupChildren: docx.Paragraph[] = [];

    // Заголовок группы
    groupChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: group.info?.name?.value || 'Группа без названия', // Проверка на null
            bold: true,
          }),
        ],
      })
    );

    // Данные из info
    groupChildren.push(
      ...masTitleGroup.map((item) => {
        const value = group.info && group.info[item.key]?.value ? group.info[item.key]?.value : ''; // Проверка на null
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

    groupChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания группы: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(group.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    groupChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления группы: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(group.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    groupChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: group.markerColor,
            color: group.markerColor,
          }),
        ],
      })
    );

    return groupChildren;
  } catch (error: any) {
    console.error('Error in generateGroupContent:', error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export default generateGroupContent;
