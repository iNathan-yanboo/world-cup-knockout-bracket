export const sourceMeta = {
  snapshotDate: '2026-06-29',
  timezone: 'Asia/Shanghai',
  note: 'Static snapshot of the 2026 FIFA World Cup Round of 32 bracket. Match 73 had already finished at snapshot time.',
  links: [
    {
      label: 'FIFA match schedule',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums'
    },
    {
      label: 'ESPN bracket',
      url: 'https://www.espn.com/soccer/bracket'
    },
    {
      label: 'FOX Sports bracket',
      url: 'https://www.foxsports.com/soccer/2026-fifa-world-cup/bracket'
    },
    {
      label: 'Al Jazeera Round of 32 schedule',
      url: 'https://www.aljazeera.com/sports/2026/6/28/which-teams-are-in-world-cup-last-32-knockouts-and-what-is-the-schedule'
    },
    {
      label: 'SB Nation bracket route summary',
      url: 'https://www.sbnation.com/fifa-world-cup/1120327/2026-world-cup-round-of-32-full-list-of-matches-potential-round-of-16-games'
    }
  ]
};

export const teams = {
  RSA: { id: 'RSA', name: 'South Africa', seed: 'Runner-up Group A' },
  CAN: { id: 'CAN', name: 'Canada', seed: 'Runner-up Group B' },
  GER: { id: 'GER', name: 'Germany', seed: 'Winner Group E' },
  PAR: { id: 'PAR', name: 'Paraguay', seed: 'Third place Group D' },
  NED: { id: 'NED', name: 'Netherlands', seed: 'Winner Group F' },
  MAR: { id: 'MAR', name: 'Morocco', seed: 'Runner-up Group C' },
  BRA: { id: 'BRA', name: 'Brazil', seed: 'Winner Group C' },
  JPN: { id: 'JPN', name: 'Japan', seed: 'Runner-up Group F' },
  FRA: { id: 'FRA', name: 'France', seed: 'Winner Group I' },
  SWE: { id: 'SWE', name: 'Sweden', seed: 'Third place Group F' },
  CIV: { id: 'CIV', name: 'Ivory Coast', seed: 'Runner-up Group E' },
  NOR: { id: 'NOR', name: 'Norway', seed: 'Runner-up Group I' },
  MEX: { id: 'MEX', name: 'Mexico', seed: 'Winner Group A' },
  ECU: { id: 'ECU', name: 'Ecuador', seed: 'Third place Group C' },
  ENG: { id: 'ENG', name: 'England', seed: 'Winner Group L' },
  COD: { id: 'COD', name: 'DR Congo', seed: 'Third place Group K' },
  USA: { id: 'USA', name: 'USA', seed: 'Winner Group D' },
  BIH: { id: 'BIH', name: 'Bosnia and Herzegovina', seed: 'Third place Group B' },
  BEL: { id: 'BEL', name: 'Belgium', seed: 'Winner Group G' },
  SEN: { id: 'SEN', name: 'Senegal', seed: 'Third place Group A' },
  POR: { id: 'POR', name: 'Portugal', seed: 'Runner-up Group K' },
  CRO: { id: 'CRO', name: 'Croatia', seed: 'Runner-up Group L' },
  ESP: { id: 'ESP', name: 'Spain', seed: 'Winner Group H' },
  AUT: { id: 'AUT', name: 'Austria', seed: 'Runner-up Group J' },
  SUI: { id: 'SUI', name: 'Switzerland', seed: 'Winner Group B' },
  ALG: { id: 'ALG', name: 'Algeria', seed: 'Third place Group J' },
  ARG: { id: 'ARG', name: 'Argentina', seed: 'Winner Group J' },
  CPV: { id: 'CPV', name: 'Cape Verde', seed: 'Runner-up Group H' },
  COL: { id: 'COL', name: 'Colombia', seed: 'Winner Group K' },
  GHA: { id: 'GHA', name: 'Ghana', seed: 'Third place Group L' },
  AUS: { id: 'AUS', name: 'Australia', seed: 'Runner-up Group D' },
  EGY: { id: 'EGY', name: 'Egypt', seed: 'Runner-up Group G' }
};

export const roundOrder = [
  'round32',
  'round16',
  'quarterfinal',
  'semifinal',
  'final'
];

export const roundLabels = {
  round32: 'Round of 32',
  round16: 'Round of 16',
  quarterfinal: 'Quarterfinals',
  semifinal: 'Semifinals',
  final: 'Final'
};

export const defaultPicks = {
  '73': 'CAN'
};

export const championMatchId = '104';

export const matches = [
  {
    id: '73',
    round: 'round32',
    date: 'Jun 28',
    status: 'Canada won 1-0',
    slots: [{ teamId: 'RSA' }, { teamId: 'CAN' }]
  },
  {
    id: '74',
    round: 'round32',
    date: 'Jun 29',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'GER' }, { teamId: 'PAR' }]
  },
  {
    id: '75',
    round: 'round32',
    date: 'Jun 29',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'NED' }, { teamId: 'MAR' }]
  },
  {
    id: '76',
    round: 'round32',
    date: 'Jun 29',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'BRA' }, { teamId: 'JPN' }]
  },
  {
    id: '77',
    round: 'round32',
    date: 'Jun 30',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'FRA' }, { teamId: 'SWE' }]
  },
  {
    id: '78',
    round: 'round32',
    date: 'Jun 30',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'CIV' }, { teamId: 'NOR' }]
  },
  {
    id: '79',
    round: 'round32',
    date: 'Jun 30',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'MEX' }, { teamId: 'ECU' }]
  },
  {
    id: '80',
    round: 'round32',
    date: 'Jun 30',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'ENG' }, { teamId: 'COD' }]
  },
  {
    id: '81',
    round: 'round32',
    date: 'Jul 1',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'USA' }, { teamId: 'BIH' }]
  },
  {
    id: '82',
    round: 'round32',
    date: 'Jul 1',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'BEL' }, { teamId: 'SEN' }]
  },
  {
    id: '83',
    round: 'round32',
    date: 'Jul 1',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'POR' }, { teamId: 'CRO' }]
  },
  {
    id: '84',
    round: 'round32',
    date: 'Jul 1',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'ESP' }, { teamId: 'AUT' }]
  },
  {
    id: '85',
    round: 'round32',
    date: 'Jul 2',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'SUI' }, { teamId: 'ALG' }]
  },
  {
    id: '86',
    round: 'round32',
    date: 'Jul 2',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'ARG' }, { teamId: 'CPV' }]
  },
  {
    id: '87',
    round: 'round32',
    date: 'Jul 2',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'COL' }, { teamId: 'GHA' }]
  },
  {
    id: '88',
    round: 'round32',
    date: 'Jul 3',
    status: 'Not played at snapshot time',
    slots: [{ teamId: 'AUS' }, { teamId: 'EGY' }]
  },
  {
    id: '89',
    round: 'round16',
    date: 'Jul 4',
    status: 'Winner M74 vs Winner M77',
    slots: [{ winnerOf: '74' }, { winnerOf: '77' }]
  },
  {
    id: '90',
    round: 'round16',
    date: 'Jul 4',
    status: 'Winner M73 vs Winner M75',
    slots: [{ winnerOf: '73' }, { winnerOf: '75' }]
  },
  {
    id: '91',
    round: 'round16',
    date: 'Jul 5',
    status: 'Winner M76 vs Winner M78',
    slots: [{ winnerOf: '76' }, { winnerOf: '78' }]
  },
  {
    id: '92',
    round: 'round16',
    date: 'Jul 5',
    status: 'Winner M79 vs Winner M80',
    slots: [{ winnerOf: '79' }, { winnerOf: '80' }]
  },
  {
    id: '93',
    round: 'round16',
    date: 'Jul 6',
    status: 'Winner M83 vs Winner M84',
    slots: [{ winnerOf: '83' }, { winnerOf: '84' }]
  },
  {
    id: '94',
    round: 'round16',
    date: 'Jul 6',
    status: 'Winner M81 vs Winner M82',
    slots: [{ winnerOf: '81' }, { winnerOf: '82' }]
  },
  {
    id: '95',
    round: 'round16',
    date: 'Jul 7',
    status: 'Winner M86 vs Winner M88',
    slots: [{ winnerOf: '86' }, { winnerOf: '88' }]
  },
  {
    id: '96',
    round: 'round16',
    date: 'Jul 7',
    status: 'Winner M85 vs Winner M87',
    slots: [{ winnerOf: '85' }, { winnerOf: '87' }]
  },
  {
    id: '97',
    round: 'quarterfinal',
    date: 'Jul 9',
    status: 'Winner M89 vs Winner M90',
    slots: [{ winnerOf: '89' }, { winnerOf: '90' }]
  },
  {
    id: '98',
    round: 'quarterfinal',
    date: 'Jul 9',
    status: 'Winner M93 vs Winner M94',
    slots: [{ winnerOf: '93' }, { winnerOf: '94' }]
  },
  {
    id: '99',
    round: 'quarterfinal',
    date: 'Jul 10',
    status: 'Winner M91 vs Winner M92',
    slots: [{ winnerOf: '91' }, { winnerOf: '92' }]
  },
  {
    id: '100',
    round: 'quarterfinal',
    date: 'Jul 10',
    status: 'Winner M95 vs Winner M96',
    slots: [{ winnerOf: '95' }, { winnerOf: '96' }]
  },
  {
    id: '101',
    round: 'semifinal',
    date: 'Jul 14',
    status: 'Winner M97 vs Winner M98',
    slots: [{ winnerOf: '97' }, { winnerOf: '98' }]
  },
  {
    id: '102',
    round: 'semifinal',
    date: 'Jul 15',
    status: 'Winner M99 vs Winner M100',
    slots: [{ winnerOf: '99' }, { winnerOf: '100' }]
  },
  {
    id: '104',
    round: 'final',
    date: 'Jul 19',
    status: 'Winner M101 vs Winner M102',
    slots: [{ winnerOf: '101' }, { winnerOf: '102' }]
  }
];
