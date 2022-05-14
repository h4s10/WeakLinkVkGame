import React, { FormEventHandler, useCallback, useRef } from 'react';
import type { FunctionComponent } from 'react';
import Button from './Button';

export interface Props {
  buttonText: string,
  handler(value: string): void;
}

const Input: FunctionComponent<Props> = ({ handler, buttonText }) => {
  const elementRef = useRef<HTMLInputElement>();

  const handlerCallback = useCallback(() => {
    const value = elementRef.current?.value;
    if (value) {
      handler(value);
    }

    if (elementRef.current) {
      elementRef.current.value = '';
    }
  }, [handler]);

  const onSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    handlerCallback();
  }, []);

  return <form className="flex place-content-between gap-3 mb-10" onSubmit={onSubmit}>
    <input type="text" className="w-full border border-2 border-vk-blue rounded text-dark text-h5 p-3" ref={elementRef}/>
    <Button className="bg-vk-blue max-w-xs" handler={handlerCallback}>{buttonText}</Button>
  </form>
}

export default Input;
