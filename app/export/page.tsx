import Maket from '../components/sections/maket/Maket';
import Button from '../components/ui/button/Button';
import './style.scss';

export default function Export() {
  return (
    <Maket typeSidebar="project" title="ЭКСПОРТ" subtitle="Проект 1">
      <div className="export">
        <Button name="Экспорт в TXT" />
        <Button name="Экспорт в DOCX" />
        <Button name="Экспорт в PDF" />
      </div>
    </Maket>
  );
}
