import React from 'react';

const Error = () => {
  return (
    <div className={'text-book__wrapper'}>
      <div className="text-book_spinner-wrapper">
        <span className={"text-book__error"}>😬 Ой, кажется что-то пошло не так, попробуйте обновить позже...</span>
      </div>
    </div>
  )
}

export default Error;
