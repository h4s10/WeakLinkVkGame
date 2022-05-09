import React, { ReactNode } from 'react';
import type { FunctionComponent } from 'react';
import SplashBackground from '../assets/splash.svg';
import './styles.css';

const SplashScreen: FunctionComponent<{ caption?: string, content?: ReactNode }> = ({ caption = 'слабое звено', content  }) => <div className='SplashScreen__outer'>
  <SplashBackground className="SplashScreen__background"/>
  <div className="SplashScreen__inner">
    { caption && <h1 className={`SplashScreen__caption SplashScreen__caption${ content ? '_small' : '_large' }`}>{ caption }</h1> }
    { content && <div className="SplashScreen__content">{ content }</div> }
  </div>
</div>;

export default SplashScreen;
