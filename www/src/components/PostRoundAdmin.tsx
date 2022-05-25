import React, { FunctionComponent, useCallback, useState } from 'react';
import Page from './Page';
import { useStore } from 'effector-react';
import splashPattern from '../../assets/splashPattern.svg';
import {
  currentRound as currentRoundStore,
  nextRound,
  roundEndReason as roundEndReasonStore,
  roundName as roundNameStore,
  allRounds as allRoundsStore,
} from '../lib/store/round';
import { bank as bankStore, currentPlayer as currentPlayerStore, players as playersStore, stake as stakeStore } from '../lib/store/game';
import Button from './Button';
import { PlayersGrid } from './PlayersGrid';
import { RoundState as ServerRoundState, User } from '../lib/api';
import { TabButton } from './Tabs/TabButton';
import { Tabs } from './Tabs/Tabs';

const pluralizeScore = (score) => ({
    one: 'очко',
    few: 'очка',
}[new Intl.PluralRules('ru').select(score)] ?? 'очков' ) ;

const PostRoundAdmin: FunctionComponent = () => {
  const currentRound = useStore(currentRoundStore);
  const allRounds = useStore(allRoundsStore);
  const currentRoundName = useStore(roundNameStore);
  const roundEndReason = useStore(roundEndReasonStore);
  const currentPlayer = useStore(currentPlayerStore);
  const currentRoundPlayers = useStore(playersStore);
  const bank = useStore(bankStore);
  const stake = useStore(stakeStore);

  const [showEntryPopup, setShowEntryPopup] = useState(true);
  const [weakId, setWeakId] = useState<User['id']>();
  const [displayedRound, setDisplayedRound] = useState(currentRound);

  const weakUser = weakId !== undefined && currentRoundPlayers.find(({ id }) => id === weakId);

  const onPlayerClick = useCallback((clicked: User['id']) => {
    if (clicked === weakId) {
      setWeakId(undefined);
      return;
    }

    const player = currentRoundPlayers.find(({ id }) => id === clicked);
    if (player && player.isWeak) {
      return;
    }

    setWeakId(clicked);
  }, [weakId, currentRoundPlayers]);

  const onRoundEndClick = useCallback(() => {
    if (weakId) {
      void nextRound({ roundId: currentRound, weakUserId: weakId });
    }
  }, [weakId, currentRound, nextRound]);

  const generatePastRoundName = (round: ServerRoundState): string => `Раунд ${round.users.filter(u => u.isWeak).length}`;

  if (showEntryPopup) {
    return <Page>
      <img className="absolute inset-0 -z-10" src={splashPattern} />
      <div className="flex flex-col h-full w-full justify-between">
        <div className="text-h4 2xl:text-h3 mb-5">«{currentRoundName}» окончен</div>
        <div className="text-h5 2xl:text-h4">{roundEndReason === 'bank' && 'Достигли максимального количества очков!'} </div>
        <div className="text-h5 2xl:ext-h4">{roundEndReason === 'time' && 'Время вышло!'} </div>
        <div className="text-h5 2xl:ext-h4">{roundEndReason === 'noMoreQuestions' && 'Закончились вопросы!'} </div>
        { bank === 0 && <div className="text-h5 2xl:text-h3">Ничего не заработали!</div> }
        { bank > 0 && <>
          {
            stake === 0  ?
              <div className="text-h5 2xl:text-h4 mt-10">Успели положить все очки в банк</div> :
              <div className="text-h5 2xl:text-h4 mt-10"> Не успели положить <span className="text-incorrect">{stake}</span> {pluralizeScore(stake)} в банк</div>
          }
          <div className="text-h5 2xl:text-h3">В банке <span className="text-neutral font-bold">{bank}</span> {pluralizeScore(bank)}!</div>
        </> }
        <Button focused className="bg-muted rounded text-vk-blue" handler={() => setShowEntryPopup(false)}>К статистике и голосованию</Button>
      </div>
    </Page>;
  }

  return <Page>
    <div className="flex flex-col h-full box-content">
      <div className="flex gap-5 items-center justify-between">
        <h1 className="text-h5 2xl:text-h4 mb-2">Статистика</h1>
        <Tabs> {
          Object.values(allRounds).map(round => <TabButton
            key={round.roundId}
            active={round.roundId === displayedRound}
            handler={() => setDisplayedRound(round.roundId)}
          >
            {round.roundId === currentRound ? currentRoundName : generatePastRoundName(round)}
          </TabButton>)
        } </Tabs>
      </div>
      <div className="py-6">
        { displayedRound === currentRound &&
          <PlayersGrid players={currentRoundPlayers} currentPlayer={currentPlayer} weakPlayer={weakId} onPlayerClick={onPlayerClick} />
        }
        { displayedRound !== currentRound &&
          <PlayersGrid players={allRounds[displayedRound]?.users}/>
        }
      </div>
      {weakUser && displayedRound === currentRound && <div>
        <Button focused className="bg-vk-blue rounded-md" handler={onRoundEndClick}>{weakUser.name}, <span className="text-muted/70">Вы – Слабое звено! Прощайте!</span></Button>
      </div>}
    </div>
  </Page>;
};

export default PostRoundAdmin;
