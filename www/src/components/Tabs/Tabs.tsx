import React, {FC, ReactNode} from 'react';

const Tabs: FC<{ children?: ReactNode }> = ({ children  }) =>
  <div className="flex bg-dark border-2 border-white h-12 2xl:h-16 rounded-lg mb-2 shadow-inner box-content">
    {children}
  </div>;

export {
  Tabs
};
