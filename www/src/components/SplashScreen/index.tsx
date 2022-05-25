import React from 'react';
import type { ReactNode, FunctionComponent } from 'react';
import { ReactComponent as Logo } from '../../../assets/vk.svg';
import { ReactComponent as Smileys } from '../../../assets/smileysSplash.svg';
import splashPattern from '../../../assets/splashPattern.svg';

const SplashScreen: FunctionComponent<{ caption?: string, children?: ReactNode }> = ({ caption = 'слабое звено', children  }) =>
  <div className="w-full h-full mx-auto bg-vk-blue">
    <img className="absolute inset-0" src={splashPattern} />
    <Logo className="left-20 top-20 absolute"/>
    <Smileys className={`absolute ${ !children ? 'left-[47%] top-[33%]' : 'left-[60%] top-[20%]' }`}/>
    {
      !children &&
      <h1 className="text-h3 2xl:text-h1 leading-none left-20 top-[45%] absolute max-w-[40%]"> { caption } </h1>
    }
    {
      children &&
      <div className="absolute left-20 my-[15rem] max-w-[60%]">
        { caption && <h2 className="text-h4 2xl:text-h2 leading-none">{ caption }</h2> }
        { children && <div className="pt-10">{ children }</div> }
      </div>
    }
  </div>;

export default SplashScreen;
