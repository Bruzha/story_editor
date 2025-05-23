export interface ItemsData {
  id: number;
  src?: string;
  data: string[];
  markColor?: string;
}

export interface CardsState {
  items: ItemsData[];
  isLoading: boolean;
  error: string | null;
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  typeCard: string;
  title: string;
  subtitle: string;
  createPageUrl: string;
  cachedData: {
    // Добавляем кэшированные данные
    [slug: string]: {
      // Ключ - slug страницы
      items: ItemsData[];
      typeSidebar: string;
      typeCard: string;
      title: string;
      subtitle: string;
      createPageUrl: string;
    } | null;
  };
}

export type RootState = any;
