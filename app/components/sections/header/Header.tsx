import Link from '../../ui/link/Link';
import './style.scss';

export default function Header() {
  return (
    <header className="header">
      <div className="header__name">
        <img src="1" alt="Логотип" />
        <h1>РЕДАКТОР ИСТОРИЙ</h1>
      </div>
      <div className="header__links">
        <Link href="../../autorisation" name="Войти" className="white-link">
          {''}
        </Link>
        <Link href="../../registration" name="Зарегистрироваться" className="white-link">
          {''}
        </Link>
      </div>
    </header>
  );
}
