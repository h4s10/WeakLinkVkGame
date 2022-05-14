import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Key } from 'react';
import Button from './components/Button';
import Throbber from './components/Throbber';

export interface Props<T> {
  header: string,
  items: T[],
  refresh(): Promise<unknown>,
  select(v: T): unknown,
  itemKey(v: T): Key,
  serialize(v: T): string,
}

const List = <T extends any> ({ header, items, refresh, serialize, itemKey, select }: Props<T>) => {
  const [refreshing, setRefreshing] = useState(true);
  const [filter, setFilter] = useState('');

  const doRefresh = useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  }, [refresh]);

  useEffect(doRefresh, []);

  const filterElementRef = useRef<HTMLInputElement>();
  const filterChangeCallback = useCallback(() => {
    setFilter(filterElementRef.current?.value);
  }, [filterElementRef]);
  const clearFilterCallback = useCallback(() => {
    if (filterElementRef.current) {
      filterElementRef.current.value = '';
    }
    setFilter('');
  }, [filterElementRef]);

  if (refreshing) {
    return <Throbber/>
  }

  return <>
    <div className='flex gap-5'>
      <h5 className="text-dark text-h5 mb-5">{ header }</h5>
      <Button className="bg-inactive max-w-max px-10 h-12" handler={refresh}>Обновить</Button>
    </div>
    {
      items?.length && <>
        <div className="flex">
          <span className="text-h5 text-dark">Фильтр:</span>
          <input ref={filterElementRef} type="text" className="w-full border border-2 border-vk-blue rounded text-dark text-h5 p-3" onChange={filterChangeCallback} />
          <Button className="bg-dark" handler={clearFilterCallback}>Очистить</Button>
        </div>
        <div className="overscroll-y-scroll flex gap-5 flex-wrap place-content-evenly">
          {
            items.filter(item => !filter.length || serialize(item).toLowerCase().includes(filter.toLowerCase())).map(item =>
              <Button className="bg-vk-magenta max-w-max px-20" key={itemKey(item)} handler={() => select(item)}>{serialize(item)}</Button>
            )
          }
        </div>
      </>
    }

  </>
}


export default List;
