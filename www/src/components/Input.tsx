import React, { FormEventHandler, useCallback, useRef } from 'react';
import type { FunctionComponent } from 'react';
import Button from './Button';

export interface Props {
  buttonText?: string,
  layout?: 'row' | 'col',

  submit?(value: string): void,
  change?(value: string): void,
}

const Input: FunctionComponent<Props> = ({ submit, change, layout = 'row', buttonText }) => {
  const elementRef = useRef<HTMLInputElement>();

  const handlerInput = () => {
    const value = elementRef.current?.value;
    if (change) {
      change(value);
    }
  };

  const onSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    const value = elementRef.current?.value;
    if (value) {
      submit(value);
    }

    if (elementRef.current) {
      elementRef.current.value = '';
    }
  }, [submit]);

  return <form className={`flex flex-${layout} place-content-between gap-10`} onSubmit={onSubmit}>
    <div className="group relative w-full h-full">
      <input type="text" className="form-input w-full h-full text-h7 2xl:text-h6 p-3 appearance-none bg-transparent text-center text-white caret-white border-0 border-b border-white" ref={elementRef}
             onChange={() => {handlerInput();}} style={{ 'background': 'transparent' }}/>
    </div>
    {buttonText ? <Button className={`bg-vk-blue text-white ${layout === 'row' ? 'max-w-xs' : ''} rounded-md`}>{buttonText}</Button> : null}
  </form>;
};

export default Input;
