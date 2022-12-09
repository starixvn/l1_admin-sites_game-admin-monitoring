const ranks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const suits = ["♥", "♦", "♣", "♠"];

const straights = [
  [11, 12, 0],
  [10, 11, 12],
  [9, 10, 11],
  [8, 9, 10],
  [7, 8, 9],
  [6, 7, 8],
  [5, 6, 7],
  [4, 5, 6],
  [3, 4, 5],
  [2, 3, 4],
  [1, 2, 3],
  [0, 1, 2],
];

const handRanks = {
  killer235: 7,
  threeOfAKind: 6,
  straightFlush: 5,
  flush: 4,
  straight: 3,
  onePair: 2,
  highCard: 1,
};

export type Win3CardsSettlementResult = {
  dragon: boolean;
  phoenix: boolean;
  pair8Plus: boolean;
  straight: boolean;
  flush: boolean;
  straightFlush: boolean;
  threeOfAKind: boolean;
  killer235: boolean;
};
type Hand = {
  cards: Card[];
  handRankId: number;
};

type Card = {
  rank: number;
  suit: number;
};

export const generateResult = (settlementResult: Win3CardsSettlementResult) => {
  const result = { dragon: {}, phoenix: {} };
  const winningHand = getWinningHand(settlementResult);
  const losingHand = getLosingHand(winningHand);
  if (settlementResult.dragon) {
    result.dragon = winningHand.cards;
    result.phoenix = losingHand.cards;
  } else {
    result.dragon = losingHand.cards;
    result.phoenix = winningHand.cards;
  }
  return result;
};

const getWinningHand = (settlementResult: Win3CardsSettlementResult): Hand => {
  if (settlementResult.killer235) {
    return getHand(handRanks.killer235);
  }
  if (settlementResult.threeOfAKind) {
    return getHand(handRanks.threeOfAKind);
  }
  if (settlementResult.straightFlush) {
    return getHand(handRanks.straightFlush);
  }
  if (settlementResult.flush) {
    return getHand(handRanks.flush);
  }
  if (settlementResult.straight) {
    return getHand(handRanks.straight);
  }
  if (settlementResult.pair8Plus) {
    return getHand(handRanks.onePair, 8);
  }
  return getHand(Math.floor(Math.random() * 7) + 1);
};

const getLosingHand = (winningHand: Hand): Hand => {
  let handRank = 0;
  if (winningHand.handRankId === handRanks.killer235) {
    handRank = handRanks.threeOfAKind;
  } else {
    handRank = Math.floor(Math.random() * winningHand.handRankId);

    handRank === 0 && (handRank = 1);
  }
  let losingHand = getHand(handRank);
  while (isExistSameCards(winningHand, losingHand)) {
    losingHand = getHand(handRank);
  }
  return losingHand;
};

const getHand = (handRank: number, cardRank?: number): Hand => {
  switch (handRank) {
    case handRanks.killer235:
      return get235Hand();
    case handRanks.threeOfAKind:
      return getThreeOfAKindHand();
    case handRanks.straightFlush:
      return getStraightFlushHand();
    case handRanks.flush:
      return getFlushHand();
    case handRanks.straight:
      return getStraightHand();
    case handRanks.onePair:
      return getPairHand(cardRank);
    default:
      return getHighCard();
  }
};

const isExistSameCards = (hand1: Hand, hand2: Hand): boolean => {
  for (let i = 0; i < 3; i++) {
    if (
      hand2.cards.find(
        (card) =>
          card.rank === hand1.cards[i].rank && card.suit === hand1.cards[i].suit
      )
    ) {
      return true;
    }
  }
  return false;
};

const getOtherSuit = (suit?: number) => {
  let result = Math.floor(Math.random() * suits.length);
  while (result === suit && result !== undefined) {
    result = Math.floor(Math.random() * suits.length);
  }
  return result;
};

const getOtherRank = (rank?: number, isSame = false) => {
  if (isSame) {
    return rank;
  }
  let result = Math.floor(Math.random() * ranks.length);
  while (result === rank && result !== undefined) {
    result = Math.floor(Math.random() * ranks.length);
  }
  return result;
};

const sequence = (ranks: number[]) => {
  ranks.sort((a, b) => a - b);
  return ranks[2] - ranks[0] === 2 || ranks[2] - ranks[0] === 12;
};

const get235Hand = (): Hand => {
  const cards = [
    { rank: 1, suit: getOtherSuit() },
    { rank: 2, suit: getOtherSuit() },
  ];
  const remainCard = { rank: 4, suit: getOtherSuit(cards[0].suit) };
  return {
    cards: [...cards, remainCard],
    handRankId: handRanks.killer235,
  };
};

const getThreeOfAKindHand = (): Hand => {
  const cardRank = getOtherRank();
  return {
    cards: [
      { rank: cardRank, suit: 0 },
      { rank: cardRank, suit: 1 },
      { rank: cardRank, suit: 2 },
    ],
    handRankId: handRanks.threeOfAKind,
  };
};

const getStraightFlushHand = (): Hand => {
  const straightIndex = Math.floor(Math.random() * straights.length);
  const suit = getOtherSuit();
  return {
    cards: [
      { rank: straights[straightIndex][0], suit },
      { rank: straights[straightIndex][1], suit },
      { rank: straights[straightIndex][2], suit },
    ],
    handRankId: handRanks.straightFlush,
  };
};

const getFlushHand = (): Hand => {
  const highCardHand = getHighCard();
  const cards = [...highCardHand.cards];
  const suit = getOtherSuit();
  return {
    cards: [
      { rank: cards[0].rank, suit },
      { rank: cards[1].rank, suit },
      { rank: cards[2].rank, suit },
    ],
    handRankId: handRanks.flush,
  };
};

const getStraightHand = (): Hand => {
  const straightIndex = Math.floor(Math.random() * straights.length);
  const suit = getOtherSuit();
  return {
    cards: [
      { rank: straights[straightIndex][0], suit },
      { rank: straights[straightIndex][1], suit: getOtherSuit(suit) },
      { rank: straights[straightIndex][2], suit: getOtherSuit(suit) },
    ],
    handRankId: handRanks.straightFlush,
  };
};

const getPairHand = (cardRank?: number): Hand => {
  let rank = getOtherRank();
  if (cardRank) {
    while (rank < cardRank) {
      rank = getOtherRank();
    }
  }
  const otherRank = getOtherRank(rank);
  const suit = getOtherSuit();
  return {
    cards: [
      { rank, suit },
      { rank, suit: getOtherSuit(suit) },
      { rank: otherRank, suit: getOtherSuit(suit) },
    ],
    handRankId: handRanks.onePair,
  };
};

const getHighCard = (): Hand => {
  const suit = getOtherSuit();
  const rank1 = getOtherRank();
  const rank2 = getOtherRank(rank1);
  let rank3 = getOtherRank(rank1);
  while (rank2 === rank3 || sequence([rank1, rank2, rank3])) {
    rank3 = getOtherRank(rank1);
  }

  return {
    cards: [
      { rank: rank1, suit },
      { rank: rank2, suit: getOtherSuit(suit) },
      { rank: rank3, suit: getOtherSuit(suit) },
    ],
    handRankId: handRanks.highCard,
  };
};
