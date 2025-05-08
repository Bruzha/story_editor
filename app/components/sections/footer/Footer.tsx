import Link from '../../ui/link/Link';
import './style.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__name">
        <img src="1" alt="Логотип" />
        <p>РЕДАКТОР ИСТОРИЙ</p>
      </div>
      <div className="footer__links">
        <Link href="путь1" name="Войти" className="white-link">
          {''}
        </Link>
        <Link href="путь2" name="Зарегистрироваться" className="white-link">
          {''}
        </Link>
      </div>
    </footer>
  );
}
