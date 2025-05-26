'use client';
import { useRouter } from 'next/navigation';
import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';

interface IProps {
  showCreateButton?: boolean;
  createPageUrl?: string;
}

export default function Search({ showCreateButton = true, createPageUrl = '/create_project' }: IProps) {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push(createPageUrl);
  };

  return (
    <div className="search">
      <div className="search__input">
        <Input placeholder="Поиск" iconSrc="/icons/search.svg" />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" />
        {showCreateButton && <Button name={'Создать'} type="button" onClick={handleCreateClick} />}
      </div>
    </div>
  );
}
