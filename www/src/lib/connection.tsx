import { useCallback, useEffect, useRef, useState } from 'react';
import type { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { createEvent } from 'effector-logger';

let instance: HubConnection | null = null;

export const setConnectionInstance = (newConnection) => instance = newConnection;

export const getConnectionInstance = (): HubConnection => {
  if (instance) {
    return instance;
  }

  throw new ReferenceError('Connection is not created');
}

export const useConnection = (url): [HubConnection, HubConnectionState, Error] => {
  const connection = useRef<HubConnection>();
  const [state, setState] = useState<HubConnectionState>();
  const [error, setError] = useState<Error>();
  const updateConnectionState = useCallback(() => {
    console.log('Signal R connection state', connection.current?.state);
    setState(connection.current?.state);

    if (connection.current?.state === HubConnectionState.Connected) {
      setError(undefined);
    }
  }, [connection.current]);

  useEffect(() => {
    connection.current = new HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    connection.current.onreconnected(updateConnectionState);
    connection.current.onreconnecting(updateConnectionState);
    connection.current.onclose(updateConnectionState);

    setConnectionInstance(connection.current);
    updateConnectionState();
    connectionEstablished();

    connection.current.start()
      .then(
        updateConnectionState,
        (error) => {
          setError(error);
          updateConnectionState();
        }
    );

    return () => {
      void connection.current?.stop();
      updateConnectionState();
      setConnectionInstance(null);
    }
  }, []);

  return [connection.current, state, error];
}

export const connectionEstablished = createEvent('Connection established');

(window as any).debug = {
  ...(window as any).debug ?? {},
  getSignalR: getConnectionInstance,
}
