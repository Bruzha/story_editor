'use client';

import './style.scss';
import Sidebar from '../sidebar/Sidebar';
import Title from '../../ui/title/Title';
import React from 'react';

interface IProps {
  typeSidebar: 'profile' | 'project';
  title: string;
  children: React.ReactNode;
}

export default function Maket({ typeSidebar, title, children }: IProps) {
  return (
    <div className="maket">
      <Sidebar type={typeSidebar} />
      <div className="maket__window">
        <Title text={title} />
        <h3>Ruzhastik</h3>
        <div className="maket__line"></div>
        <div>{children}</div>
      </div>
    </div>
  );
}
