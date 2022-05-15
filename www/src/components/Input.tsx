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

  const handlerCallback = useCallback(() => {
    const value = elementRef.current?.value;
    if (value) {
      submit(value);
    }

    if (elementRef.current) {
      elementRef.current.value = '';
      setInput('');
    }
  }, [submit]);

  const handlerInput = () => {
    const value = elementRef.current?.value;
    if (change) {
      change(value);
    }

    setInput(value);
  };

  const onSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    handlerCallback();
  }, []);

  return <form className="flex flex-row place-content-between gap-10" onSubmit={onSubmit}>
    <div className="group relative w-full h-full">
      <div className="bg-white absolute h-2 rounded inset-x-0 bottom-4 -z-10" />
      <input type="text" className="form-input w-full h-full border-0 text-h5 2xl:text-h4 p-3 appearance-none bg-transparent text-center text-white caret-white" ref={elementRef}
             onChange={() => {handlerInput();}}
             style={{ 'background': 'transparent', 'WebkitTextFillColor': 'white', 'WebkitTextStroke': '0.2rem white', 'textShadow': '#000 0px 4px 5px' }} />
      <input type="text"
             className="absolute inset-0 pointer-events-none form-input w-full h-full border-0 text-h5 2xl:text-h4 p-3 appearance-none bg-transparent text-center text-dark group-hover:text-vk-blue group-focus:text-vk-blue"
             disabled={true} value={input} style={{ 'background': 'transparent' }} />
    </div>
    {buttonText ? <Button className="bg-vk-blue text-white max-w-xs rounded-md" handler={handlerCallback}>{buttonText}</Button> : null}
  </form>;
};

export default Input;
