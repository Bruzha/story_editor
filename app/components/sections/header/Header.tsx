import Link from '../../ui/link/Link';
import './style.scss';

export default function Header() {
  return (
    <header className="header__container">
      <div className="header__name">
        <img src="1" alt="Логотип" />
        <p>РЕДАКТОР ИСТОРИЙ</p>
      </div>
      <div>
        <Link href="путь1" name="Войти" className="white-link" />
        <Link href="путь2" name="Зарегистрироваться" className="white-link" />
      </div>
    </header>
  );
}
