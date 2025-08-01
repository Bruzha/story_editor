import React from 'react';
import Title from '../title/Title';
import '../form/style.scss';
import './style.scss';

interface IProps {
  title: string;
  message: string;
}

const Message: React.FC<IProps> = ({ message, title }) => {
  return (
    <div className="message">
      <section className="message__form form">
        <Title text={title} />
        <p className="message__text">{message}</p>
      </section>
    </div>
  );
};

export default Message;
