state owner = {},
  A: state
  B: state

root   = owner.state ''          # >>> RootState
stateA = owner.state 'A'         # >>> State 'A'
stateB = owner.state 'B'         # >>> State 'B'
