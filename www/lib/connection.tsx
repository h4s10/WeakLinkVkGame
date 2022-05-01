import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';

let instance: HubConnection | null = null;

export const setConnection = (newConnection) => instance = newConnection;

export const getConnection = (): HubConnection => {
  if (instance) {
    return instance;
  }

  throw new ReferenceError('Connection is not created');
}

export const useConnection = (url) => {
  const [connection, setConnection] = useState();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    setConnection(connection);

    return () => connection.stop()
  }, []);

  return connection;
}
