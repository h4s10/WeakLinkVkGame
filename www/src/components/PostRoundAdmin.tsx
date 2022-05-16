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
      <img className="absolute inset-0 -z-10" src="../../assets/splashPattern.svg" />
      <div className="flex flex-col h-full w-full justify-between">
        <div className="text-h4 2xl:text-h3 mb-5">«{roundName}» окончен</div>
        <div className="text-h5 2xl:text-h4">{roundEndReason === 'bank' && 'Достигли максимального количества очков!'} </div>
        <div className="ttext-h5 2xl:ext-h4">{roundEndReason === 'time' && 'Время вышло!'} </div>
        {stake === 0 ? <div className="text-h5 2xl:text-h4 mt-10">Успели положить все очки в банк</div> :
          <div className="text-h5 2xl:text-h4 mt-10"> Не успели положить <span className="text-incorrect">{stake}</span> очков в банк</div>}
        <div className="text-h5 2xl:text-h3">В банке <span className="text-neutral font-bold">{bank}</span> очков!</div>

        <Button className="bg-muted rounded text-vk-blue" handler={() => setShowEntryPopup(false)}>К статистике и голосованию</Button>
      </div>
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
        <Button className="bg-vk-blue rounded-md" handler={onRoundEndClick}>{weakUser.name}, <span className="text-muted/70">Вы - Слабое звено! Прощайте!</span></Button>
      </div>}
    </div>
  </Page>;
};

export default PostRoundAdmin;
