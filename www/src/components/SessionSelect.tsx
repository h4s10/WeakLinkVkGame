import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { FunctionComponent } from 'react';
import { Session } from '../lib/api';
import Page from './Page';
import Throbber from './Throbber';
import Button from './Button';

interface Props {
  canCreate: boolean,
  sessions: Session[],
  refresh: () => Promise<any>,
  select: (id: Session) => void,
  createNew: (name: string) => void,
}

const SessionSelect: FunctionComponent<Props> = ({
   canCreate,
   sessions,
   refresh,
   select,
   createNew,
}) => {
  const [refreshing, setRefreshing] = useState(true);

  const doRefresh = useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  }, [refresh])

  useEffect(doRefresh, []);

  const newGameNameRef = useRef<HTMLInputElement>();
  const doCreate = useCallback(() => {
    const name = newGameNameRef.current?.value;
    if (name) {
      createNew(name);
    }
  }, [createNew]);

  return <Page>
    <h1 className="text-h4 mb-2">Выбор игры</h1>
      <div className="w-full h-max my-auto rounded bg-white p-10 min-h-[50%]">
        { refreshing && <div className="p-20 px-[50%]"><Throbber/></div> }
        {!refreshing && <>
          {
            canCreate && <>
              <h5 className="text-dark text-h5 mb-5">Новая</h5>
              <div className="flex place-content-between gap-3 mb-10">
                <input type="text" className="w-full border border-2 border-vk-blue rounded text-dark text-h5 p-3" ref={newGameNameRef}/>
                <Button className="bg-vk-blue max-w-xs" text="Создать" handler={doCreate} />
              </div>
            </>
          }
          {
            sessions.length && <>
            <h5 className="text-dark text-h5 mb-5">Игры в процессе</h5>
              <div className="overscroll-y-scroll flex gap-5 flex-wrap place-content-evenly">
                {
                  sessions.map(sessionId =>
                    <Button className="bg-vk-magenta max-w-max px-20" key={sessionId} text={String(sessionId)} handler={() => select(sessionId)}/>
                  )
                }
              </div>
            </>
          }
          {
            !canCreate && !sessions.length && <div className="flex gap-5 flex-col items-center text-center content-center">
              <h4 className="text-h4 text-dark">Нет доступных игр.</h4>
              <h4 className="text-h5 text-dark">Дождитесь когда Ведущий создаст игру.</h4>
              <Button className="bg-vk-magenta max-w-sm" text="Обновить" handler={doRefresh}/>
            </div>
          }
        </>}
      </div>
  </Page>
}

export default SessionSelect;

