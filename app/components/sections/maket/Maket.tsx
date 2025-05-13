'use client';

import './style.scss';
import Sidebar from '../sidebar/Sidebar';
import Title from '../../ui/title/Title';
import React from 'react';

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character';
  title: string;
  children: React.ReactNode;
  subtitle: string;
}

export default function Maket({ typeSidebar, title, subtitle, children }: IProps) {
  return (
    <div className="maket">
      <Sidebar type={typeSidebar} />
      <div className="maket__window">
        <Title text={title} />
        <div className="maket__subtitle-container">
          <h3>{subtitle}</h3>
          <div className="maket__line"></div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
