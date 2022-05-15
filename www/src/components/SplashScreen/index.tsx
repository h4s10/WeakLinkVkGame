import React from 'react';
import type { ReactNode, FunctionComponent } from 'react';
import Pattern from '../../../assets/splashPattern.svg';
import Logo from '../../../assets/vk.svg';
import Smileys from '../../../assets/smileysSplash.svg';

const SplashScreen: FunctionComponent<{ caption?: string, content?: ReactNode }> = ({ caption = 'слабое звено', content  }) =>
  <div className="w-full h-full mx-auto bg-vk-blue">
    <Pattern className="w-auto h-full float-right"/>
    <Logo className="left-20 top-20 absolute"/>
    <Smileys className={`absolute ${ !content ? 'left-[47%] top-[33%]' : 'left-[60%] top-[20%]' }`}/>
    {
      !content &&
      <h1 className="text-h1 leading-none left-20 top-[45%] absolute max-w-[40%]"> { caption } </h1>
    }
    {
      content &&
      <div className="absolute left-20 my-[15rem] max-w-[60%]">
        { caption && <h2 className="text-h4 2xl:text-h2 leading-none">{ caption }</h2> }
        { content && <div className="pt-10">{ content }</div> }
      </div>
    }
  </div>;

export default SplashScreen;
