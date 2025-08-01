// utils/generateProjectContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generateProjectContent = (projectData: any): docx.Paragraph[] => {
  const masTitleProject = createPageData.find((item) => item.type === 'projects')?.masTitle || [];
  const projectChildren: docx.Paragraph[] = [];

  projectChildren.push(
    new docx.Paragraph({
      heading: docx.HeadingLevel.HEADING_1,
      alignment: docx.AlignmentType.CENTER,
      style: 'Heading1',
      children: [
        new docx.TextRun({
          text: projectData.info.name.value || 'Проект без названия',
          bold: true,
          underline: {
            type: docx.UnderlineType.SINGLE,
            color: projectData.markerColor || '000000',
          },
        }),
      ],
    })
  );

  projectChildren.push(
    ...masTitleProject.map((item) => {
      const value = projectData.info[item.key]?.value || '';
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

  projectChildren.push(
    new docx.Paragraph({
      style: 'Normal',
      indent: { firstLine: 425 },
      children: [
        new docx.TextRun({
          text: 'Статус: ',
          bold: true,
        }),
        new docx.TextRun({
          text: projectData.status,
        }),
      ],
    })
  );

  projectChildren.push(
    new docx.Paragraph({
      style: 'Normal',
      indent: { firstLine: 425 },
      children: [
        new docx.TextRun({
          text: 'Маркерный цвет: ',
          bold: true,
        }),
        new docx.TextRun({
          text: projectData.markerColor,
          color: projectData.markerColor,
        }),
      ],
    })
  );

  projectChildren.push(
    new docx.Paragraph({
      style: 'Normal',
      indent: { firstLine: 425 },
      children: [
        new docx.TextRun({
          text: 'Дата создания проекта: ',
          bold: true,
        }),
        new docx.TextRun({
          text: moment(projectData.createdAt).format('DD.MM.YYYY, HH:mm'),
        }),
      ],
    })
  );

  projectChildren.push(
    new docx.Paragraph({
      style: 'Normal',
      indent: { firstLine: 425 },
      children: [
        new docx.TextRun({
          text: 'Дата обновления проекта: ',
          bold: true,
        }),
        new docx.TextRun({
          text: moment(projectData.updatedAt).format('DD.MM.YYYY, HH:mm'),
        }),
      ],
    })
  );

  return projectChildren;
};

export default generateProjectContent;
