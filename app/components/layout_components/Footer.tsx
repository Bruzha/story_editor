import Link from '../ui_components/Link';
import '../style_components/footer.css';

export default function Footer() {
  return (
    <footer className="footer__container">
      <img src="1" alt="Логотип" />
      <div>
        <Link href="путь1" name="Войти" />
        <Link href="путь2" name="Зарегистрироваться" />
      </div>
    </footer>
  );
}
