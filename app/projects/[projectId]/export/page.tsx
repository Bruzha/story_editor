'use client';

import { useSelector } from 'react-redux';
import Maket from '../../../components/sections/maket/Maket';
import Button from '../../../components/ui/button/Button';
import './style.scss';
import { RootState } from '@/app/store';

export default function Export() {
  const subtitle = useSelector((state: RootState) => state.posts.subtitle);
  return (
    <Maket typeSidebar="project" title="ЭКСПОРТ" subtitle={subtitle}>
      <div className="export">
        <Button name="Экспорт в TXT" />
        <Button name="Экспорт в DOCX" />
        <Button name="Экспорт в PDF" />
      </div>
    </Maket>
  );
}
