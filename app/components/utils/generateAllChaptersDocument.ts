import * as docx from 'docx';

const generateAllChaptersDocument = (project: any, chapters: any[]): docx.Paragraph[] => {
  try {
    const allChaptersContent: docx.Paragraph[] = [];

    // 1. Title Page
    allChaptersContent.push(
      new docx.Paragraph({
        text: project.info.author.value || 'Автор не указан',
        alignment: docx.AlignmentType.CENTER,
        style: 'AuthorStyle',
      })
    );
    allChaptersContent.push(
      new docx.Paragraph({
        text: project.info.name.value.toUpperCase() || 'НАЗВАНИЕ ПРОЕКТА НЕ УКАЗАНО',
        alignment: docx.AlignmentType.CENTER,
        style: 'ProjectNameStyle',
      })
    );
    //Add page break
    allChaptersContent.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // 2. Table of Contents (ToC)
    allChaptersContent.push(
      new docx.Paragraph({
        text: 'СОДЕРЖАНИЕ',
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'SectionHeader',
      })
    );
    allChaptersContent.push(
      new docx.Paragraph({
        text: 'Аннотация',
        style: 'ToCItem',
      })
    );
    chapters.forEach((chapter) => {
      allChaptersContent.push(
        new docx.Paragraph({
          text: `${chapter.info?.order || 'X'}. ${chapter.info?.title?.value || 'Без названия'}`,
          style: 'ToCItem',
        })
      );
    });

    //Add page break
    allChaptersContent.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));

    // 3. Annotation
    allChaptersContent.push(
      new docx.Paragraph({
        text: 'АННОТАЦИЯ',
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'SectionHeader',
      })
    );
    allChaptersContent.push(
      new docx.Paragraph({
        text: project.info.annotation.value || 'Аннотация отсутствует',
        style: 'AnnotationText',
      })
    );

    return allChaptersContent;
  } catch (error: any) {
    console.error('Error in generateAllChaptersDocument:', error);
    return [];
  }
};

// Function to generate chapters content
const generateChaptersContent = (chapters: any[]): docx.Paragraph[] => {
  const chaptersContent: docx.Paragraph[] = [];
  chapters.forEach((chapter) => {
    //Chapter title
    chaptersContent.push(
      new docx.Paragraph({
        text: chapter.info?.order || 'X',
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'ChapterHeading',
      })
    );
    chaptersContent.push(
      new docx.Paragraph({
        text: chapter.info?.title?.value || 'Без названия',
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        style: 'ChapterHeading',
      })
    );
    //Chapter content
    const contentLines = (chapter.info?.content?.value || '').split('\n');
    contentLines.forEach((line: any) => {
      chaptersContent.push(
        new docx.Paragraph({
          text: line,
          style: 'ChapterText',
        })
      );
    });

    //Add page break
    chaptersContent.push(new docx.Paragraph({ children: [new docx.PageBreak()] }));
  });
  //Remove page break after last chapter

  return chaptersContent;
};

export { generateAllChaptersDocument, generateChaptersContent };
