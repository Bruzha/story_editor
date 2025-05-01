import Link from '../ui_components/Link';
import '../style_components/header.css';

export default function Header() {
  return (
    <header className="header__container">
      <img src="1" alt="Логотип" />
      <div>
        <Link href="путь1" name="Войти" />
        <Link href="путь2" name="Зарегистрироваться" />
      </div>
    </header>
  );
}
