// utils/generateChapterTXTContent.ts

const generateChapterTXTContent = (chapter: any): string => {
  let content = '';

  content += `${chapter.info.order.value || 'X'}\n`;
  content += `${chapter.info.title.value || 'Без названия'}\n`;
  content += `\n`;

  // Preserve line breaks in the content
  if (chapter.info.content.value) {
    content += `${chapter.info.content.value}\n`;
  }

  return content;
};

export default generateChapterTXTContent;
