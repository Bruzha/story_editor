// utils/generateCharacterContent.ts
import * as docx from 'docx';
import createPageData from '@/backend/src/data/createPageData';
import moment from 'moment';

const generateCharacterContent = (character: any): docx.Paragraph[] => {
  try {
    const masTitleCharacter =
      createPageData.find((item) => item.type === 'characters' && item.typePage === 'characters')?.masTitle || [];
    const masTitleCharacterAppearance =
      createPageData.find((item) => item.type === 'characters' && item.typePage === 'appearance')?.masTitle || [];
    const masTitleCharacterPersonality =
      createPageData.find((item) => item.type === 'characters' && item.typePage === 'personality')?.masTitle || [];
    const masTitleCharacterSocial =
      createPageData.find((item) => item.type === 'characters' && item.typePage === 'social')?.masTitle || [];

    const characterChildren: docx.Paragraph[] = [];

    characterChildren.push(
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'Heading1',
        children: [
          new docx.TextRun({
            text: character.info.name.value || 'Project Name',
            bold: true,
            underline: {
              type: docx.UnderlineType.SINGLE,
              color: character.markerColor || '000000',
            },
          }),
        ],
      })
    );

    // Add creation date, update date, and marker color on the first page
    characterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата создания персонажа: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(character.createdAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    characterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Дата обновления персонажа: ',
            bold: true,
          }),
          new docx.TextRun({
            text: moment(character.updatedAt).format('DD.MM.YYYY, HH:mm'),
          }),
        ],
      })
    );

    characterChildren.push(
      new docx.Paragraph({
        style: 'Normal',
        indent: { firstLine: 425 },
        children: [
          new docx.TextRun({
            text: 'Маркерный цвет: ',
            bold: true,
          }),
          new docx.TextRun({
            text: character.markerColor,
            color: character.markerColor,
          }),
        ],
      })
    );

    // Add page break
    characterChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // Add "ОСНОВНАЯ ИНФОРМАЦИЯ" section
    characterChildren.push(
      new docx.Paragraph({
        text: 'ОСНОВНАЯ ИНФОРМАЦИЯ',
        style: 'SectionHeader',
        alignment: docx.AlignmentType.CENTER,
      })
    );

    characterChildren.push(
      ...masTitleCharacter.map((item) => {
        const value = character.info && character.info[item.key]?.value ? character.info[item.key]?.value : ''; // Add null check
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

    // Add page break
    characterChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // Add "ВНЕШНОСТЬ" section
    characterChildren.push(
      new docx.Paragraph({
        text: 'ВНЕШНОСТЬ',
        style: 'SectionHeader',
        alignment: docx.AlignmentType.CENTER,
      })
    );

    characterChildren.push(
      ...masTitleCharacterAppearance.map((item) => {
        const value =
          character.info_appearance && character.info_appearance[item.key]?.value
            ? character.info_appearance[item.key]?.value
            : ''; // Add null check
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

    // Add page break
    characterChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // Add "ЛИЧНОСТЬ" section
    characterChildren.push(
      new docx.Paragraph({
        text: 'ЛИЧНОСТЬ',
        style: 'SectionHeader',
        alignment: docx.AlignmentType.CENTER,
      })
    );

    characterChildren.push(
      ...masTitleCharacterPersonality.map((item) => {
        const value =
          character.info_personality && character.info_personality[item.key]?.value
            ? character.info_personality[item.key]?.value
            : ''; // Add null check
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
    characterChildren.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // Add "СОЦИАЛЬНЫЕ СВЯЗИ" section
    characterChildren.push(
      new docx.Paragraph({
        text: 'СОЦИАЛЬНЫЕ СВЯЗИ',
        style: 'SectionHeader',
        alignment: docx.AlignmentType.CENTER,
      })
    );

    characterChildren.push(
      ...masTitleCharacterSocial.map((item) => {
        const value =
          character.info_social && character.info_social[item.key]?.value ? character.info_social[item.key]?.value : '';
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

    return characterChildren;
  } catch (error: any) {
    console.error('Error in generateCharacterContent:', error);
    return [];
  }
};

export default generateCharacterContent;
