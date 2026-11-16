# Monte Carlo Tree Search for Ultimate Tic-Tac-Toe

An individual course project by **Max Liu** for **CMPM 146: Game AI, Summer 2026**, at the University of California, Santa Cruz.

This project implements a baseline Monte Carlo Tree Search (MCTS) agent and compares it with a small rollout heuristic. It also explores the relationship between search budget, match results, and batch runtime.

## My contribution

I implemented the search logic: UCB-based selection, expansion of an untried legal action, rollout, and backpropagation of visit and win counts. The agent chooses the most-visited child of the root as its action.

For the modified agent, I added a rollout policy that checks whether a legal action immediately wins the **whole game** for the player to move. It takes such an action when available; otherwise, it samples a legal action at random. I also ran the course experiments and wrote the two reports included here.

The project uses a course-provided game environment and tree-node interfaces. I did not create the complete Ultimate Tic-Tac-Toe game or its framework. This is a search-based agent; it does not train a machine-learning model.

## Contents and source status

- [Baseline MCTS implementation](src/mcts_vanilla.py).
- [Modified rollout implementation](src/mcts_modified.py).
- [Experiment 1](reports/experiment-1.pdf): baseline agents with different search budgets.
- [Experiment 2](reports/experiment-2.pdf): baseline and modified agents at equal search budgets.
- [Original submission README](submission/README-original.md): the contemporaneous description and historical commands, preserved unchanged.

The two algorithm modules are unchanged copies of my submitted implementation files. They retain the course interfaces, function documentation, and instructional comments used by the assignment. My work is the MCTS implementation and modified rollout policy described above; the supplied interfaces and instructional text are not presented as my original framework. The separate course environment, tree-node implementation, and simulator are not included.

## Runtime requirements and execution limits

The submitted Python modules import `MCTSNode` from `mcts_node` and `Board` from `p2_t3`. They also use Python's standard-library `random` and `math` modules. Their type annotations require Python 3.10 or later. No package lockfile or complete framework dependency list was included in the submission.

The entry point in each algorithm is `think(board, current_state, previous_tree=None)`. The files in `src/` are agent modules, not standalone game executables.

The original submission README records these commands, run from the course environment's `src` directory:

```sh
python p2_sim.py vanilla_100 vanilla_200
python p2_sim.py vanilla_100 modified_100
```

These are **historical course commands**, not working installation instructions for this snapshot. The archive does not contain `p2_sim.py`, `mcts_node.py`, `p2_t3.py`, or the named budget variants. The archived baseline and modified modules also have different default `num_nodes` values: 1000 and 100, respectively. Running those defaults would not reproduce the equal-budget comparisons in the report.

A complete reproduction requires the authorized original course environment, runner, and the matching experiment configurations. There is no verified standalone run command for the materials currently available.

## Recorded experiments

The following values come from the submitted reports. They are historical results, not newly reproduced benchmarks. The reports use the term “tree size”; here it is described as the search budget rather than a measured exact tree-node count.

In Experiment 1, Player 1 used the baseline agent with budget 100. Player 2 used the baseline agent with the budgets below. Each setting contained 100 games.

| Player 2 budget | Player 1 wins | Player 2 wins | Draws | Time for the entire 100-game batch (s) |
| ---: | ---: | ---: | ---: | ---: |
| 50 | 74 | 26 | 0 | 65.74 |
| 100 | 53 | 47 | 0 | 88.04 |
| 150 | 38 | 62 | 0 | 106.58 |
| 200 | 35 | 65 | 0 | 123.88 |

In Experiment 2, both agents used the same budget within each setting. Each setting contained 100 games.

| Budget for each agent | Baseline wins | Modified wins | Draws | Time for the entire 100-game batch (s) |
| ---: | ---: | ---: | ---: | ---: |
| 50 | 29 | 70 | 1 | 84.42 |
| 100 | 42 | 58 | 0 | 162.78 |
| 200 | 39 | 60 | 1 | 314.68 |

The modified agent won more games in each of these three recorded batches. This does not establish a universal or statistically significant improvement. The reports do not document random seeds, repeated batches, or whether player order was swapped. Raw per-game logs and exact experiment configurations are unavailable. The reported times are batch runtimes, not per-move latency or per-game timing measurements.

## Validation of the archived materials

Both submitted algorithm files were parsed successfully with Python's syntax parser during this portfolio review. This was a syntax-only check: the code was not executed, no games were played, and the reported experiments were not rerun. The two source files, two report files, and original submission README in this candidate are byte-for-byte copies from the submission archive.
