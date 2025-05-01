import React from 'react';

// Интерфейс для определения типа данных, которые будут в списке
interface ListItem {
  id: number; // Уникальный идентификатор элемента (обязательно)
  [key: string]: any; // Позволяет добавлять другие произвольные свойства (опционально)
}

// Интерфейс для свойств компонента List
interface ListProps {
  items: ListItem[]; // Массив элементов списка.  Обязательное свойство.
  onItemClick?: (itemId: number) => void; // Callback функция для обработки клика по элементу списка.  Опционально.
  className?: string; // CSS класс для всего списка. Опционально.
  itemClassName?: string; // CSS класс для каждого элемента списка. Опционально.
  renderItem?: (item: ListItem) => React.ReactNode; // Функция для отрисовки каждого элемента.  Опционально.
}

// Компонент List
const List: React.FC<ListProps> = ({ items, onItemClick, className, itemClassName, renderItem }) => {
  if (!items || items.length === 0) {
    return <p className={className}>Список пуст</p>; // Или что-то другое, что вы хотите отобразить, когда список пуст
  }

  return (
    <ul className={className}>
      {items.map((item) => (
        <li
          key={item.id} // Важно для корректной работы React (ключ должен быть уникальным)
          className={itemClassName}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined} // Вызываем onItemClick, если он передан
          style={{ cursor: onItemClick ? 'pointer' : 'default' }} // Меняем курсор, если можно кликать
        >
          {renderItem ? renderItem(item) : item.text}
        </li>
      ))}
    </ul>
  );
};

export default List;
