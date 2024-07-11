const handleMessage = (message: any) => {
  const handlerMap = {
    ["ingame"]: handleInGame,
  };
  Object.entries(message).forEach(([key, value]) => {
    handlerMap[key]?.(value);
  });
};

const handleInGame = (ingame: any) => {
  console.log(ingame);
};
