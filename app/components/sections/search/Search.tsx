import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';

export default function Search() {
  return (
    <div className="search">
      <div className="search__input">
        <Input placeholder="Поиск" iconSrc="/icons/search.svg" />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" />
        <Button name={'Создать'} type="button" />
      </div>
    </div>
  );
}
