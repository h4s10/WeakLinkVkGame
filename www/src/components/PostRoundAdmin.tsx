import React, { FunctionComponent, useCallback, useState } from 'react';
import Page from './Page';
import { useStore } from 'effector-react';
import {
  rounds as roundsStore,
  currentRound as currentRoundStore,
  roundName as roundNameStore,
  roundEndReason as roundEndReasonStore,
  nextRound,
} from '../lib/store/round';
import { bank as bankStore, currentPlayer as currentPlayerStore, players as playersStore, stake as stakeStore } from '../lib/store/game';
import Button from './Button';
import { PlayersGrid } from './PlayersGrid';
import { User } from '../lib/api';
import { TabButton } from './Tabs/TabButton';
import { Tabs } from './Tabs/Tabs';

const PostRoundAdmin: FunctionComponent = () => {
  const currentRound = useStore(currentRoundStore);
  const rounds = useStore(roundsStore);
  const roundName = useStore(roundNameStore);
  const roundEndReason = useStore(roundEndReasonStore);
  const currentPlayer = useStore(currentPlayerStore);
  const players = useStore(playersStore);
  const bank = useStore(bankStore);
  const stake = useStore(stakeStore);

  const [showEntryPopup, setShowEntryPopup] = useState(true);
  const [weakId, setWeakId] = useState<User['id']>();
  const [displayedRound, setDisplayedRound] = useState(currentRound);

  const weakUser = weakId !== undefined && players.find(({ id }) => id === weakId);

  const onPlayerClick = useCallback((clicked: User['id']) => {
    if (clicked === weakId) {
      setWeakId(undefined);
      return;
    }

    const player = players.find(({ id }) => id === clicked);
    if (player && player.isWeak) {
      return;
    }

    setWeakId(clicked);
  }, [weakId, players]);

  const onRoundEndClick = useCallback(() => {
    if (weakId) {
      nextRound({ roundId: currentRound, weakUserId: weakId });
    }
  }, [weakId, currentRound, nextRound]);

  if (showEntryPopup) {
    return <Page>
      <h1>«{roundName}» окончен</h1>
      <h2>{roundEndReason === 'bank' && 'Достигли максимального количества очков!'} </h2>
      <h2>{roundEndReason === 'time' && 'Время вышло!'} </h2>
      <h2>{stake === 0 ? 'Успели положить все очки в банк' : `Не успели положить ${stake} очков в банк`}</h2>
      <h2>{`В банке ${bank} очков!`} </h2>

      <Button handler={() => setShowEntryPopup(false)}>К статистике и голосованию</Button>
    </Page>;
  }

  return <Page>
    <div className="flex flex-col h-full box-content">
      <div className="flex gap-5 items-center justify-between">
        <h1 className="text-h5 2xl:text-h4 mb-2">Статистика</h1>
        <Tabs> {
          rounds.map(round => <TabButton key={round} active={round === displayedRound} handler={() => setDisplayedRound(displayedRound)}>Раунд #{round}</TabButton>)
        } </Tabs>
      </div>
      <div className="py-6">
        <PlayersGrid players={players} currentPlayer={currentPlayer} weakPlayer={weakId} onPlayerClick={onPlayerClick} />
      </div>
      {weakUser && <div>
        <Button className="bg-vk-blue rounded-md" handler={onRoundEndClick}>{weakUser.name} – Слабое звено!</Button>
      </div>}
    </div>
  </Page>;
};

export default PostRoundAdmin;
