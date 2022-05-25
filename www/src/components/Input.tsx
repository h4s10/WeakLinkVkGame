import React, { FormEventHandler, useCallback, useRef, useState } from 'react';
import type { FunctionComponent } from 'react';
import Button from './Button';

export interface Props {
  buttonText?: string,

  submit?(value: string): void;
  change?(value: string): void;
}

const Input: FunctionComponent<Props> = ({ submit, change, buttonText }) => {
  const [input, setInput] = useState('');

  const elementRef = useRef<HTMLInputElement>();

  const handlerInput = () => {
    const value = elementRef.current?.value;
    if (change) {
      change(value);
    }

    setInput(value);
  };

  const onSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    const value = elementRef.current?.value;
    if (value) {
      submit(value);
    }

    if (elementRef.current) {
      elementRef.current.value = '';
      setInput('');
    }
  }, [submit]);

  return <form className="flex flex-row place-content-between gap-10" onSubmit={onSubmit}>
    <div className="group relative w-full h-full">
      <div className="bg-white absolute h-3 2xl:h-4 rounded inset-x-0 bottom-3 2xl:bottom-4 -z-10" />
      <input type="text" className="form-input text-stroke w-full h-full border-0 text-h5 2xl:text-h4 p-3 appearance-none bg-transparent text-center text-white caret-white" ref={elementRef}
             onChange={() => {handlerInput();}}
             style={{ 'background': 'transparent', 'WebkitTextFillColor': 'white', 'WebkitTextStroke': '0.3rem white' }} />
      <input type="text"
             className="absolute inset-0 pointer-events-none form-input w-full h-full border-0 text-h5 2xl:text-h4 p-3 appearance-none bg-transparent text-center text-vk-blue"
             disabled={true} value={input} style={{ 'background': 'transparent' }} />
    </div>
    {buttonText ? <Button className="bg-vk-blue text-white max-w-xs rounded-md">{buttonText}</Button> : null}
  </form>;
};

export default Input;
