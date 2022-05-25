import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import type { Key } from 'react';
import Button from './Button';
import { ReactComponent as Sync } from '../../assets/syncOutline.svg';
import Input from './Input';
import cn from 'classnames';

export interface Props<T> {
  header: string,
  items: T[],
  selected?: T[],
  emptyList?: ReactNode,

  refresh(): Promise<unknown>,
  select(v: T): unknown,
  itemKey(v: T): Key,
  serialize(v: T): string,
}

const List = <T extends any>({ header, items, selected = [], refresh, serialize, itemKey, select, emptyList = null }: Props<T>) => {
  const [refreshing, setRefreshing] = useState(true);
  const [filter, setFilter] = useState('');

  const doRefresh = useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => setRefreshing(false));
  }, [refresh]);

  useEffect(doRefresh, []);

  const filterChangeCallback = (value) => {
    setFilter(value);
  };

  const clearFilterCallback = () => {
    setFilter('');
  };

  if (refreshing) {
    return null;
  }

  return <>
    <div className="flex gap-5 items-center">
      <div className="flex gap-5 items-center">
        <Button className="bg-white w-12 h-12 rounded-full shadow" ignoreInnerStyle={true} handler={refresh}>
          <Sync />
        </Button>
        <div className="text-h7 2xl:text-h5">{header}</div>
      </div>
      <div className="flex-auto" />
      {items?.length ? <>
        <div className="text-h7 2xl:text-h5">Фильтр:</div>
        <div className="">
          <Input change={filterChangeCallback} submit={clearFilterCallback} />
        </div>
      </> : null}
    </div>
    {
      items?.length ? <>
        <div className="overscroll-y-scroll flex flex-wrap place-content-between gap-5 mt-10">
          {
            items.filter(item => !filter.length || serialize(item).toLowerCase().includes(filter.toLowerCase())).map(item =>
              <Button className={cn('px-20 rounded bg-white/70 border border-white w-1/3 hover:bg-white text-black', {
                '!bg-white border-2 border-vk-blue shadow-lg': selected.includes(item),
              })} key={itemKey(item)} handler={() => select(item)}>{serialize(item)}</Button>,
            )
          }
        </div>
      </> : emptyList
    }

  </>;
};

export default List;
