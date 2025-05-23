'use client';

import './style.scss';
import Sidebar from '../sidebar/Sidebar';
import Title from '../../ui/title/Title';
import React from 'react'; // Removed useEffect and useRouter
// import { useRouter } from 'next/navigation'; // Removed
// import { parseCookies } from 'nookies'; // Removed

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  title: string;
  children: React.ReactNode;
  subtitle: string;
  lineColor?: string;
  projectId: string;
}

export default function Maket({ typeSidebar, title, subtitle, children, lineColor, projectId }: IProps) {
  return (
    <div className="maket">
      <Sidebar projectId={projectId} type={typeSidebar} />
      <div className="maket__window">
        <Title text={title} />
        <div className="maket__subtitle-container">
          <h3>{subtitle}</h3>
          <div className="maket__line" style={{ backgroundColor: lineColor }}></div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
