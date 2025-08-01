// utils/generateTXTContent.ts

import moment from 'moment';

interface Field {
  key: string;
  title: string;
}

const generateTXTContent = (data: any, fields: Field[]): string => {
  let content = '';

  const processInfo = (info: any, prefix = '') => {
    if (info) {
      fields.forEach((field) => {
        if (info.hasOwnProperty(field.key)) {
          const value = info[field.key]?.value || '';
          content += `${prefix}${field.title}: ${value}\n`;
        }
      });
    }
  };

  processInfo(data.info);
  processInfo(data.info_appearance);
  processInfo(data.info_personality);
  processInfo(data.info_social);

  if (data.type) {
    content += `Тип: ${data.type}\n`;
  }
  if (data.status) {
    content += `Статус: ${data.status}\n`;
  }
  if (data.eventDate) {
    content += `Дата события: ${data.eventDate}\n`;
  }

  content += `Дата создания: ${moment(data.createdAt).format('DD.MM.YYYY, HH:mm')}\n`;
  content += `Дата обновления: ${moment(data.updatedAt).format('DD.MM.YYYY, HH:mm')}\n`;
  content += `Маркерный цвет: ${data.markerColor}\n`;

  return content;
};

export default generateTXTContent;
