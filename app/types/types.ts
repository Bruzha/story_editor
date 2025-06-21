export interface ItemsData {
  info_personality?: any;
  info_social?: any;
  info_appearance?: any;
  info?: any;
  markerColor?: any;
  id: number;
  src?: string | null;
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
  displayFields?: string[];
  cachedData: {
    [slug: string]: {
      items?: ItemsData[];
      isLoading?: boolean;
      error?: string | null;
      typeSidebar?: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
      typeCard?: string;
      title?: string;
      subtitle?: string;
      createPageUrl?: string;
      displayFields?: string[];
    };
  };
}

export type RootState = any;
