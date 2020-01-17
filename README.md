# Never Completed Game

https://www.nevercompletedgame.com/

## Modellierung

```
neverCompletedGame              (Domain)
  playing                       (Bounded Context)
    game                        (Aggregate)
      commands
        open
        guess
      events
        opened
        guessed
        guessFailed
        levelCompleted
        completed
      state
        currentLevel
        isCompleted
```

## Links

- https://nodejs.org/
