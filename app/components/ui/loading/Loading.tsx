import React from 'react';
import Title from '../title/Title';
import './style.scss';

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      <Title text={'ЗАГРУЗКА...'} />
    </div>
  );
};

export default Loading;
