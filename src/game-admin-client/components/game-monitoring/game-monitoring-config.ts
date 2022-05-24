import configs from '../../configs.json';

const loadOrderFromConfigString = (config: string) => {
  if (config) {
    return config.split(',');
  }

  return null;
}

export const types = {
  taixiu: "taixiu",
  chanle: "chanle",
  clturbo: "clturbo"
};

export const gameMapping = {
  taixiu: loadOrderFromConfigString(configs.TaiXiuOrder) || ['tai', 'xiu'],
  chanle: loadOrderFromConfigString(configs.ChanLeOrder) || ['chan', 'le'],
  clturbo: loadOrderFromConfigString(configs.ChanLeOrder) || ['chan', 'le'],
};

export const gameFlagMapping = {
  taixiu: {
    0: 'xiu',
    1: 'tai',
  },
  chanle: {
    0: 'le',
    1: 'chan',
  },
  clturbo: {
    0: 'le',
    1: 'chan',
  },
};
