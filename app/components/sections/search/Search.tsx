// app/components/search/Search.tsx
import { useRouter } from 'next/navigation';
import { useState, useCallback, ChangeEvent } from 'react';
import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { clearCharacterData, setCharacterData } from '@/app/store/reducers/characterReducer';
import { AppDispatch } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import createPageData from '@/backend/src/data/createPageData';
import Select from '../../ui/select/Select';
import Modal from '../../ui/modal/Modal';
import Checkbox from '../../ui/checkbox/Checkbox';
import { fetchElementsForProject } from '@/app/store/thunks/fetchElementsForProject';
import { RootState } from '@/app/store';
import { useForm, useFormContext } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { createItem } from '@/app/store/thunks/createItem';

interface IProps {
  showCreateButton?: boolean;
  showCopyButton?: boolean;
  createPageUrl?: string;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
}

interface FormValues {
  selectedElements: {
    [projectId: number]: string[];
  };
}

// Хук для работы с checkbox
const useCheckbox = (projectId: number, element: any) => {
  const { setValue, getValues } = useFormContext<FormValues>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const fieldName = `selectedElements` as const;
    const elementId = element.id.toString();

    const currentValue = getValues(fieldName);

    let newValue: string[] = [];

    if (currentValue && currentValue[projectId]) {
      newValue = [...currentValue[projectId]];
    }

    if (checked) {
      newValue = [...newValue, elementId];
    } else {
      newValue = newValue.filter((item) => item !== elementId);
    }

    setValue(fieldName, {
      ...currentValue,
      [projectId]: newValue,
    });
  };

  return { handleChange };
};

interface CheckboxProps {
  label: string;
  value: string;
  projectId: number;
  element: any;
}

const ProjectCheckbox: React.FC<CheckboxProps> = ({ label, value, projectId, element }) => {
  const { handleChange } = useCheckbox(projectId, element);
  console.log('value', value);
  return <Checkbox label={label} value={value} onChange={handleChange} />;
};

export default function Search({
  showCreateButton = true,
  showCopyButton = true,
  createPageUrl = '/create_project',
  onSearch,
  onSort,
}: IProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [elementType, setElementType] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();
  const elements = useSelector((state: RootState) => state.elements.data);
  //const cards = useSelector((state: RootState) => state.cards.items); // Получаем cards из state
  const projectId = useSelector((state: RootState) => state.project.projectId); // Получаем projectId текущего проекта
  const elementsLoading = useSelector((state: RootState) => state.elements.loading);
  const elementsError = useSelector((state: RootState) => state.elements.error);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    // Указываем тип FormValues
    defaultValues: {
      selectedElements: {},
    }, // Инициализируем defaultValues
  });

  const handleCreateClick = () => {
    dispatch(clearCharacterData());
    if (createPageUrl === '/characters/create?typePage=characters') {
      const initialData = createPageData
        .filter((item) => item.type === 'characters')
        .reduce(
          (acc, item) => {
            const typePage = item.typePage || 'social';
            acc[typePage] = item.masTitle.reduce((pageAcc: { [key: string]: { value: string } }, field) => {
              pageAcc[field.key] = { value: '' };
              return pageAcc;
            }, {});
            return acc;
          },
          {
            characters: {},
            appearance: {},
            personality: {},
            social: {},
          }
        );

      dispatch(setCharacterData({ typePage: 'characters', data: initialData.characters }));
      dispatch(setCharacterData({ typePage: 'appearance', data: initialData.appearance }));
      dispatch(setCharacterData({ typePage: 'personality', data: initialData.personality }));
      dispatch(setCharacterData({ typePage: 'social', data: initialData.social }));
    }
    router.push(createPageUrl);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSortBy = event.target.value;
      console.log('selectedSortBy', selectedSortBy);
      setSortBy(selectedSortBy);
      onSort(selectedSortBy);
    },
    [onSort]
  );

  const openModal = () => {
    setIsModalOpen(true);
    let elementType: string | undefined;
    if (createPageUrl === '/characters/create?typePage=characters') {
      elementType = 'characters';
    } else if (createPageUrl === '/locations/create') {
      elementType = 'locations';
    } else if (createPageUrl === '/objects/create') {
      elementType = 'objects';
    } else if (createPageUrl === '/plotlines/create') {
      elementType = 'plotlines';
    } else if (createPageUrl === '/groups/create') {
      elementType = 'groups';
    } else if (createPageUrl === '/time_events/create') {
      elementType = 'time_events';
    } else if (createPageUrl === '/chapters/create') {
      elementType = 'chapters';
    } else if (createPageUrl === '/notes/create') {
      elementType = 'notes';
    }
    setElementType(elementType || ''); // Сохраняем elementType
    if (elementType) {
      dispatch(fetchElementsForProject({ type: elementType }));
    }
    reset();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: FormValues) => {
    console.log('Form Data:', data);
    const type = elementType;
    console.log('type:', type);

    let slug = '';
    if (type === 'projects') {
      slug = 'projects';
    } else if (type === 'ideas') {
      slug = 'ideas';
    } else if (type === 'time_events' || type === 'timelines') {
      slug = `projects/${projectId}/time_events`;
    } else if (type === 'advices') {
      slug = 'advices';
    } else if (type === 'terms') {
      slug = 'terms';
    } else {
      slug = `projects/${projectId}/${type}`;
    }
    console.log('slug:', slug);

    if (!projectId || !slug) {
      console.error('ProjectId or slug is missing');
      closeModal();
      return;
    }

    const selectedElementsData = data.selectedElements || {};
    console.log('selectedElementsData:', selectedElementsData);

    // Итерируем по проектам и выбранным элементам
    for (const projectKey in selectedElementsData) {
      const selectedElementIds = selectedElementsData[projectKey];
      console.log('selectedElementIds:', selectedElementIds);
      if (selectedElementIds && selectedElementIds.length > 0) {
        const projectElements = elements.find((p) => p.projectId === parseInt(projectKey));
        console.log('projectElements:', projectElements);
        if (projectElements) {
          selectedElementIds.forEach((elementId) => {
            const elementToCopy = projectElements.elements.find((e: any) => e.id.toString() === elementId);
            console.log('elementToCopy:', elementToCopy);
            if (elementToCopy) {
              dispatch(
                createItem({
                  type: type,
                  payload: {
                    ...elementToCopy,
                    projectId: projectId,
                  },
                })
              );
            }
          });
        }
      }
    }

    closeModal();
  };

  let options;
  if (createPageUrl === '/chapters/create') {
    options = [
      { value: 'order', label: 'По номеру' },
      { value: 'name', label: 'По названию' },
      { value: 'date', label: 'По дате создания' },
    ];
  } else if (createPageUrl === '/time_events/create') {
    options = [
      { value: 'event', label: 'По дате события' },
      { value: 'name', label: 'По названию' },
      { value: 'date', label: 'По дате создания' },
    ];
  } else {
    options = [
      { value: 'date', label: 'По дате создания' },
      { value: 'name', label: 'По названию' },
    ];
  }

  console.log('elements2: ', elements);
  return (
    <div className="search">
      <div className="search__select">
        <Select title="Сортировка карточек" options={options} onChange={handleSortChange} value={sortBy} />
      </div>
      <div className="search__input">
        <Input
          title="Поле для ввода значения поиска"
          placeholder="Поиск"
          iconSrc="/icons/search.svg"
          onChange={handleSearchChange}
          value={searchQuery}
        />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" onClick={handleSearchClick} />
        {showCreateButton && <Button name={'Создать'} type="button" onClick={handleCreateClick} />}
        {showCopyButton && <Button name={'Добавить из проекта'} type="button" onClick={openModal} />}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="ДОБАВЛЕНИЕ ИЗ ПРОЕКТА"
        message={
          !elementsLoading
            ? elements && elements.some((project) => project.elements.length > 0)
              ? 'Выберите элементы, которые хотите добавить в проект.'
              : 'У вас нет элементов, которые можно было бы добавить из проектов.'
            : ''
        }
        onConfirm={handleSubmit(onSubmit)} // Подключаем handleSubmit
        onCancel={closeModal}
        titleButtonYes="Добавить выбранные"
      >
        {elementsLoading && <p>Загрузка...</p>}
        {elementsError && <p>Ошибка: {elementsError}</p>}
        <FormProvider {...{ register, handleSubmit, setValue, getValues, formState: { errors } }}>
          {elements &&
            !elementsLoading &&
            elements.map((project: any) => {
              if (project.elements.length === 0) {
                return null; // Пропускаем проект, если нет элементов
              }

              return (
                <div key={project.projectId}>
                  <h3>{project.projectName}</h3>
                  {project.elements.map((element: any) => (
                    <ProjectCheckbox
                      key={element.id}
                      label={
                        elementType === 'chapters'
                          ? element.info.order.value + '. ' + element.info.title.value
                          : element.info.name.value
                      }
                      value={element.id.toString()}
                      projectId={project.projectId}
                      element={element}
                    />
                  ))}
                </div>
              );
            })}
        </FormProvider>
      </Modal>
    </div>
  );
}
