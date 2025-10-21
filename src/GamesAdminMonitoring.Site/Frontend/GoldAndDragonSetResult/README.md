This project wil UI for admin get result:
Firstly, user can input information such as:

- Tumbles: can have many tumble. Each tumble contains many cluster win. Each cluster win will have symbol input (number) and cluster size (number).
- Multiplier (number)
- Rage Meter (number): we have a configure for rage meter [4, 5, 6, 7] if rage meter large than a value in config other feature with rage meter less will be triggered.
  After user input. We will send api request to server to get suggestion rounds. Server will return a list item as:
  {
  "roundInfoId": "68da36dd4e365bfe92b2e96d",
  "rageMeter": 16,
  "tumbles": [
  {
  "clusterWin": [
  {
  "symbol": 4,
  "size": 5,
  "multiplier": 1
  },
  {
  "symbol": 2,
  "size": 5,
  "multiplier": 1
  }
  ]
  },
  {
  "clusterWin": [
  {
  "symbol": 5,
  "size": 6,
  "multiplier": 1
  }
  ]
  }
  ],
  }
  With each item we will summary to 1 or 2 lines. User can pick any one to visualize it. Default, the first item will be visualize. To visualize we will call api with roundInfoId to get a round info. A data for round info contain:
  {"reelSet": 1,
  "stopIndex": [
  129,
  69,
  157,
  29,
  35,
  102
  ],
  "tumbles": [
  {
  "currentState": {
  "board": [
  [
  5,
  5,
  4,
  3,
  2,
  2
  ],
  [
  1,
  7,
  4,
  4,
  0,
  0
  ],
  [
  5,
  4,
  4,
  4,
  7,
  7
  ],
  [
  3,
  0,
  0,
  0,
  6,
  6
  ],
  [
  6,
  0,
  2,
  4,
  3,
  2
  ],
  [
  2,
  2,
  4,
  7,
  7,
  4
  ]
  ],
  "multiplier": [
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ]
  ],
  "rageMeter": 0
  },
  "detonateReason": {
  "clusterWin": [],
  "featureTriggerGrids": []
  }
  },
  {
  "currentState": {
  "board": [
  [
  5,
  5,
  5,
  3,
  2,
  2
  ],
  [
  7,
  5,
  1,
  7,
  0,
  0
  ],
  [
  5,
  5,
  5,
  5,
  7,
  7
  ],
  [
  3,
  0,
  0,
  0,
  6,
  6
  ],
  [
  6,
  0,
  2,
  4,
  3,
  2
  ],
  [
  2,
  2,
  4,
  7,
  7,
  4
  ]
  ],
  "multiplier": [
  [
  -1,
  -1,
  0,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  0,
  0,
  -1,
  -1
  ],
  [
  -1,
  0,
  0,
  0,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ]
  ],
  "rageMeter": 6
  },
  "detonateReason": {
  "clusterWin": [
  {
  "symbol": 4,
  "position": [
  {
  "x": 0,
  "y": 2
  },
  {
  "x": 1,
  "y": 2
  },
  {
  "x": 1,
  "y": 3
  },
  {
  "x": 2,
  "y": 3
  },
  {
  "x": 2,
  "y": 2
  },
  {
  "x": 2,
  "y": 1
  }
  ],
  "multiplier": 1
  }
  ],
  "featureTriggerGrids": []
  }
  },
  {
  "currentState": {
  "board": [
  [
  3,
  5,
  4,
  3,
  2,
  2
  ],
  [
  5,
  7,
  1,
  7,
  0,
  0
  ],
  [
  0,
  0,
  5,
  7,
  7,
  7
  ],
  [
  3,
  0,
  0,
  0,
  6,
  6
  ],
  [
  6,
  0,
  2,
  4,
  3,
  2
  ],
  [
  2,
  2,
  4,
  7,
  7,
  4
  ]
  ],
  "multiplier": [
  [
  0,
  0,
  20,
  -1,
  -1,
  -1
  ],
  [
  -1,
  0,
  0,
  0,
  -1,
  -1
  ],
  [
  0,
  20,
  20,
  20,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ]
  ],
  "rageMeter": 14
  },
  "detonateReason": {
  "clusterWin": [
  {
  "symbol": 5,
  "position": [
  {
  "x": 0,
  "y": 0
  },
  {
  "x": 0,
  "y": 1
  },
  {
  "x": 0,
  "y": 2
  },
  {
  "x": 1,
  "y": 1
  },
  {
  "x": 2,
  "y": 1
  },
  {
  "x": 2,
  "y": 2
  },
  {
  "x": 2,
  "y": 3
  },
  {
  "x": 2,
  "y": 0
  }
  ],
  "multiplier": 1
  }
  ],
  "featureTriggerGrids": []
  }
  },
  {
  "currentState": {
  "board": [
  [
  3,
  5,
  4,
  3,
  2,
  2
  ],
  [
  5,
  7,
  1,
  7,
  0,
  0
  ],
  [
  7,
  0,
  5,
  7,
  7,
  7
  ],
  [
  3,
  4,
  3,
  3,
  6,
  6
  ],
  [
  6,
  6,
  2,
  4,
  3,
  2
  ],
  [
  2,
  2,
  4,
  7,
  7,
  4
  ]
  ],
  "multiplier": [
  [
  0,
  0,
  20,
  -1,
  -1,
  -1
  ],
  [
  -1,
  0,
  0,
  0,
  -1,
  -1
  ],
  [
  20,
  20,
  20,
  20,
  -1,
  -1
  ],
  [
  -1,
  0,
  0,
  0,
  -1,
  -1
  ],
  [
  -1,
  0,
  -1,
  -1,
  -1,
  -1
  ],
  [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
  ]
  ],
  "rageMeter": 20
  },
  "detonateReason": {
  "clusterWin": [
  {
  "symbol": 0,
  "position": [
  {
  "x": 2,
  "y": 0
  },
  {
  "x": 2,
  "y": 1
  },
  {
  "x": 3,
  "y": 1
  },
  {
  "x": 3,
  "y": 2
  },
  {
  "x": 3,
  "y": 3
  },
  {
  "x": 4,
  "y": 1
  }
  ],
  "multiplier": 2
  }
  ],
  "featureTriggerGrids": []
  }
  },
  {
  "currentState": {
  "board": [
  [
  2,
  3,
  5,
  4,
  3,
  2
  ],
  [
  4,
  2,
  5,
  1,
  7,
  0
  ],
  [
  7,
  0,
  5,
  7,
  7,
  7
  ],
  [
  3,
  4,
  3,
  3,
  6,
  6
  ],
  [
  3,
  6,
  6,
  2,
  4,
  2
  ],
  [
  0,
  2,
  2,
  4,
  7,
  4
  ]
  ],
  "multiplier": [
  [
  0,
  0,
  20,
  -1,
  -1,
  0
  ],
  [
  -1,
  20,
  0,
  0,
  -1,
  0
  ],
  [
  20,
  20,
  20,
  20,
  -1,
  -1
  ],
  [
  -1,
  0,
  0,
  0,
  -1,
  -1
  ],
  [
  -1,
  0,
  -1,
  -1,
  20,
  -1
  ],
  [
  -1,
  -1,
  -1,
  0,
  -1,
  -1
  ]
  ],
  "rageMeter": 20
  },
  "detonateReason": {
  "clusterWin": [],
  "featureTriggerGrids": [
  {
  "x": 1,
  "y": 5
  },
  {
  "x": 5,
  "y": 3
  },
  {
  "x": 1,
  "y": 1
  },
  {
  "x": 4,
  "y": 4
  },
  {
  "x": 4,
  "y": 4
  },
  {
  "x": 0,
  "y": 5
  }
  ],
  "featureType": 0
  }
  }
  ],
  "totalWin": 3.5,
  "rageMeter": 20,}
