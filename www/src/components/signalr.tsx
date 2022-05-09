import React, { useState } from 'react';

import { HubConnectionBuilder } from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';

const HUB_URL = 'https://localhost:7089/game';

const methods = [
  'PrepareSession',
]

export default () => {
  const connection = useRef<HubConnection>(null);

  useEffect(() => {
    connection.current = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    for (const method of methods) {
      connection.current.on(method, message => setLastIncoming(message));
    }

    connection.current.start()
      .then(() => {
        setLastIncoming('[Connected]');
      })
      .catch(e => {
        setLastIncoming(String(e));
        console.error(e);
      });
  }, []);

  const [method, setMethod] = useState<string>('');
  const [param, setParam] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [lastIncoming, setLastIncoming] = useState<string>('[Not connected]');
  const responseElementRef = useRef();

  const send = async () => {
    if (!method || !connection.current) {
      return;
    }

    const response = await connection.current.send(method, param).catch(e => {
      setLastIncoming(String(e));
      console.error(e);
    });

    if (responseElementRef.current) {
      setResponse(response);
    }
  }

  return <>
    <h2>Hub: <code>{HUB_URL}</code></h2>

    <h3>Incoming message:</h3>
    <br/>
    <pre> {lastIncoming} </pre>

    <br/>
    <input type="text" onChange={ e => setMethod(e.target.value) }/>
    <input type="text" onChange={ e => setParam(e.target.value) }/>
    <button onClick={send}>Send</button>

    <h3>Response</h3>
    <br/>
    <pre ref={responseElementRef}> {response} </pre>
  </>
}
