export const sourceMeta = {
  snapshotDate: '2026-06-30',
  timezone: 'Asia/Shanghai',
  note: '2026 年世界杯 32 强淘汰赛静态快照。已确认 M73、M74、M76 赛果；M75 等待最终可信来源确认。',
  links: [
    {
      label: 'FIFA 赛程',
      url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums'
    },
    {
      label: 'ESPN 晋级图',
      url: 'https://www.espn.com/soccer/bracket'
    },
    {
      label: 'FOX Sports 晋级图',
      url: 'https://www.foxsports.com/soccer/2026-fifa-world-cup/bracket'
    },
    {
      label: 'Al Jazeera 32 强赛程',
      url: 'https://www.aljazeera.com/sports/2026/6/28/which-teams-are-in-world-cup-last-32-knockouts-and-what-is-the-schedule'
    },
    {
      label: 'SB Nation 晋级路径',
      url: 'https://www.sbnation.com/fifa-world-cup/1120327/2026-world-cup-round-of-32-full-list-of-matches-potential-round-of-16-games'
    }
  ]
};

export const teams = {
  RSA: { id: 'RSA', name: 'South Africa', nameZh: '南非', seed: 'Runner-up Group A', flag: 'za' },
  CAN: { id: 'CAN', name: 'Canada', nameZh: '加拿大', seed: 'Runner-up Group B', flag: 'ca' },
  GER: { id: 'GER', name: 'Germany', nameZh: '德国', seed: 'Winner Group E', flag: 'de' },
  PAR: { id: 'PAR', name: 'Paraguay', nameZh: '巴拉圭', seed: 'Third place Group D', flag: 'py' },
  NED: { id: 'NED', name: 'Netherlands', nameZh: '荷兰', seed: 'Winner Group F', flag: 'nl' },
  MAR: { id: 'MAR', name: 'Morocco', nameZh: '摩洛哥', seed: 'Runner-up Group C', flag: 'ma' },
  BRA: { id: 'BRA', name: 'Brazil', nameZh: '巴西', seed: 'Winner Group C', flag: 'br' },
  JPN: { id: 'JPN', name: 'Japan', nameZh: '日本', seed: 'Runner-up Group F', flag: 'jp' },
  FRA: { id: 'FRA', name: 'France', nameZh: '法国', seed: 'Winner Group I', flag: 'fr' },
  SWE: { id: 'SWE', name: 'Sweden', nameZh: '瑞典', seed: 'Third place Group F', flag: 'se' },
  CIV: { id: 'CIV', name: 'Ivory Coast', nameZh: '科特迪瓦', seed: 'Runner-up Group E', flag: 'ci' },
  NOR: { id: 'NOR', name: 'Norway', nameZh: '挪威', seed: 'Runner-up Group I', flag: 'no' },
  MEX: { id: 'MEX', name: 'Mexico', nameZh: '墨西哥', seed: 'Winner Group A', flag: 'mx' },
  ECU: { id: 'ECU', name: 'Ecuador', nameZh: '厄瓜多尔', seed: 'Third place Group C', flag: 'ec' },
  ENG: { id: 'ENG', name: 'England', nameZh: '英格兰', seed: 'Winner Group L', flag: 'gb-eng' },
  COD: { id: 'COD', name: 'DR Congo', nameZh: '刚果（金）', seed: 'Third place Group K', flag: 'cd' },
  USA: { id: 'USA', name: 'USA', nameZh: '美国', seed: 'Winner Group D', flag: 'us' },
  BIH: { id: 'BIH', name: 'Bosnia and Herzegovina', nameZh: '波黑', seed: 'Third place Group B', flag: 'ba' },
  BEL: { id: 'BEL', name: 'Belgium', nameZh: '比利时', seed: 'Winner Group G', flag: 'be' },
  SEN: { id: 'SEN', name: 'Senegal', nameZh: '塞内加尔', seed: 'Third place Group A', flag: 'sn' },
  POR: { id: 'POR', name: 'Portugal', nameZh: '葡萄牙', seed: 'Runner-up Group K', flag: 'pt' },
  CRO: { id: 'CRO', name: 'Croatia', nameZh: '克罗地亚', seed: 'Runner-up Group L', flag: 'hr' },
  ESP: { id: 'ESP', name: 'Spain', nameZh: '西班牙', seed: 'Winner Group H', flag: 'es' },
  AUT: { id: 'AUT', name: 'Austria', nameZh: '奥地利', seed: 'Runner-up Group J', flag: 'at' },
  SUI: { id: 'SUI', name: 'Switzerland', nameZh: '瑞士', seed: 'Winner Group B', flag: 'ch' },
  ALG: { id: 'ALG', name: 'Algeria', nameZh: '阿尔及利亚', seed: 'Third place Group J', flag: 'dz' },
  ARG: { id: 'ARG', name: 'Argentina', nameZh: '阿根廷', seed: 'Winner Group J', flag: 'ar' },
  CPV: { id: 'CPV', name: 'Cape Verde', nameZh: '佛得角', seed: 'Runner-up Group H', flag: 'cv' },
  COL: { id: 'COL', name: 'Colombia', nameZh: '哥伦比亚', seed: 'Winner Group K', flag: 'co' },
  GHA: { id: 'GHA', name: 'Ghana', nameZh: '加纳', seed: 'Third place Group L', flag: 'gh' },
  AUS: { id: 'AUS', name: 'Australia', nameZh: '澳大利亚', seed: 'Runner-up Group D', flag: 'au' },
  EGY: { id: 'EGY', name: 'Egypt', nameZh: '埃及', seed: 'Runner-up Group G', flag: 'eg' }
};

export const roundOrder = [
  'round32',
  'round16',
  'quarterfinal',
  'semifinal',
  'final'
];

export const roundLabels = {
  round32: '32强',
  round16: '16强',
  quarterfinal: '8强',
  semifinal: '半决赛',
  final: '决赛'
};

export const lockedResults = {
  '73': {
    winnerId: 'CAN',
    score: '加拿大 1-0 南非',
    confirmedAt: '2026-06-29'
  },
  '74': {
    winnerId: 'PAR',
    score: '巴拉圭 1-1 德国，点球 4-3 晋级',
    confirmedAt: '2026-06-30'
  },
  '76': {
    winnerId: 'BRA',
    score: '巴西 2-1 日本',
    confirmedAt: '2026-06-30'
  }
};

export const defaultPicks = Object.fromEntries(
  Object.entries(lockedResults).map(([matchId, result]) => [matchId, result.winnerId])
);

export const championMatchId = '104';

export const matches = [
  {
    id: '73',
    round: 'round32',
    date: 'Jun 28',
    status: '加拿大 1-0 南非',
    slots: [{ teamId: 'RSA' }, { teamId: 'CAN' }]
  },
  {
    id: '74',
    round: 'round32',
    date: 'Jun 29',
    status: '巴拉圭 1-1 德国，点球 4-3 晋级',
    slots: [{ teamId: 'GER' }, { teamId: 'PAR' }]
  },
  {
    id: '75',
    round: 'round32',
    date: 'Jun 29',
    status: '90 分钟 1-1，待最终确认',
    slots: [{ teamId: 'NED' }, { teamId: 'MAR' }]
  },
  {
    id: '76',
    round: 'round32',
    date: 'Jun 29',
    status: '巴西 2-1 日本',
    slots: [{ teamId: 'BRA' }, { teamId: 'JPN' }]
  },
  {
    id: '77',
    round: 'round32',
    date: 'Jun 30',
    status: '待开赛',
    slots: [{ teamId: 'FRA' }, { teamId: 'SWE' }]
  },
  {
    id: '78',
    round: 'round32',
    date: 'Jun 30',
    status: '待开赛',
    slots: [{ teamId: 'CIV' }, { teamId: 'NOR' }]
  },
  {
    id: '79',
    round: 'round32',
    date: 'Jun 30',
    status: '待开赛',
    slots: [{ teamId: 'MEX' }, { teamId: 'ECU' }]
  },
  {
    id: '80',
    round: 'round32',
    date: 'Jun 30',
    status: '待开赛',
    slots: [{ teamId: 'ENG' }, { teamId: 'COD' }]
  },
  {
    id: '81',
    round: 'round32',
    date: 'Jul 1',
    status: '待开赛',
    slots: [{ teamId: 'USA' }, { teamId: 'BIH' }]
  },
  {
    id: '82',
    round: 'round32',
    date: 'Jul 1',
    status: '待开赛',
    slots: [{ teamId: 'BEL' }, { teamId: 'SEN' }]
  },
  {
    id: '83',
    round: 'round32',
    date: 'Jul 1',
    status: '待开赛',
    slots: [{ teamId: 'POR' }, { teamId: 'CRO' }]
  },
  {
    id: '84',
    round: 'round32',
    date: 'Jul 1',
    status: '待开赛',
    slots: [{ teamId: 'ESP' }, { teamId: 'AUT' }]
  },
  {
    id: '85',
    round: 'round32',
    date: 'Jul 2',
    status: '待开赛',
    slots: [{ teamId: 'SUI' }, { teamId: 'ALG' }]
  },
  {
    id: '86',
    round: 'round32',
    date: 'Jul 2',
    status: '待开赛',
    slots: [{ teamId: 'ARG' }, { teamId: 'CPV' }]
  },
  {
    id: '87',
    round: 'round32',
    date: 'Jul 2',
    status: '待开赛',
    slots: [{ teamId: 'COL' }, { teamId: 'GHA' }]
  },
  {
    id: '88',
    round: 'round32',
    date: 'Jul 3',
    status: '待开赛',
    slots: [{ teamId: 'AUS' }, { teamId: 'EGY' }]
  },
  {
    id: '89',
    round: 'round16',
    date: 'Jul 4',
    status: '胜者 M74 对阵 胜者 M77',
    slots: [{ winnerOf: '74' }, { winnerOf: '77' }]
  },
  {
    id: '90',
    round: 'round16',
    date: 'Jul 4',
    status: '胜者 M73 对阵 胜者 M75',
    slots: [{ winnerOf: '73' }, { winnerOf: '75' }]
  },
  {
    id: '91',
    round: 'round16',
    date: 'Jul 5',
    status: '胜者 M76 对阵 胜者 M78',
    slots: [{ winnerOf: '76' }, { winnerOf: '78' }]
  },
  {
    id: '92',
    round: 'round16',
    date: 'Jul 5',
    status: '胜者 M79 对阵 胜者 M80',
    slots: [{ winnerOf: '79' }, { winnerOf: '80' }]
  },
  {
    id: '93',
    round: 'round16',
    date: 'Jul 6',
    status: '胜者 M83 对阵 胜者 M84',
    slots: [{ winnerOf: '83' }, { winnerOf: '84' }]
  },
  {
    id: '94',
    round: 'round16',
    date: 'Jul 6',
    status: '胜者 M81 对阵 胜者 M82',
    slots: [{ winnerOf: '81' }, { winnerOf: '82' }]
  },
  {
    id: '95',
    round: 'round16',
    date: 'Jul 7',
    status: '胜者 M86 对阵 胜者 M88',
    slots: [{ winnerOf: '86' }, { winnerOf: '88' }]
  },
  {
    id: '96',
    round: 'round16',
    date: 'Jul 7',
    status: '胜者 M85 对阵 胜者 M87',
    slots: [{ winnerOf: '85' }, { winnerOf: '87' }]
  },
  {
    id: '97',
    round: 'quarterfinal',
    date: 'Jul 9',
    status: '胜者 M89 对阵 胜者 M90',
    slots: [{ winnerOf: '89' }, { winnerOf: '90' }]
  },
  {
    id: '98',
    round: 'quarterfinal',
    date: 'Jul 9',
    status: '胜者 M93 对阵 胜者 M94',
    slots: [{ winnerOf: '93' }, { winnerOf: '94' }]
  },
  {
    id: '99',
    round: 'quarterfinal',
    date: 'Jul 10',
    status: '胜者 M91 对阵 胜者 M92',
    slots: [{ winnerOf: '91' }, { winnerOf: '92' }]
  },
  {
    id: '100',
    round: 'quarterfinal',
    date: 'Jul 10',
    status: '胜者 M95 对阵 胜者 M96',
    slots: [{ winnerOf: '95' }, { winnerOf: '96' }]
  },
  {
    id: '101',
    round: 'semifinal',
    date: 'Jul 14',
    status: '胜者 M97 对阵 胜者 M98',
    slots: [{ winnerOf: '97' }, { winnerOf: '98' }]
  },
  {
    id: '102',
    round: 'semifinal',
    date: 'Jul 15',
    status: '胜者 M99 对阵 胜者 M100',
    slots: [{ winnerOf: '99' }, { winnerOf: '100' }]
  },
  {
    id: '104',
    round: 'final',
    date: 'Jul 19',
    status: '胜者 M101 对阵 胜者 M102',
    slots: [{ winnerOf: '101' }, { winnerOf: '102' }]
  }
];
