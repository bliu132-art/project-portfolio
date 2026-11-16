P2: Monte Carlo Tree Search for Ultimate Tic-Tac-Toe

Name:
Max Liu

Teammates:
I worked on this assignment by myself.


Files Included:
mcts_vanilla.py
mcts_modified.py
experiment1.pdf
experiment2.pdf
README.txt


About mcts_vanilla.py:

In mcts_vanilla.py, I made the basic MCTS bot. I used the normal MCTS steps, which are selection, expansion, rollout, and backpropagation.

For selection, I used UCB to choose a child node. For expansion, I added one new child node from the actions that were not tried yet. For rollout, the bot just plays random legal moves until the game ends. After the rollout, I update the visits and wins from the leaf node back to the root node.

This is the basic version, so I tried to keep it simple and close to the normal MCTS idea.


About mcts_modified.py:

For mcts_modified.py, I started from my vanilla MCTS code and changed the rollout part a little.

In the vanilla version, the rollout only chooses random moves. In my modified version, during rollout, the bot first checks if there is a legal move that can immediately win the whole game. If there is one, it chooses that move. If there is no move like that, it chooses a random move like the vanilla bot.

I made this change because I thought a fully random rollout may miss a very obvious winning move. My heuristic is still simple, but it gives the bot a little more information during rollout.


Experiments:

For Experiment 1, I tested different tree sizes for the vanilla MCTS bot. Player 1 always used 100 nodes. Player 2 used different tree sizes. I ran 100 games for each setting and recorded the wins.

For Experiment 2, I compared the vanilla MCTS bot and the modified MCTS bot. Both bots used the same tree size in each test. I tested 50, 100, and 200 nodes, and I ran 100 games for each one.

I used smaller tree sizes than 1000 because running 100 games with large tree sizes took a long time on my computer. Because of this, the result may not be perfectly exact, but I think it is still enough to see the trend from my tests.


How to Run:

I ran the simulations from the src folder.

Example commands:

python p2_sim.py vanilla_100 vanilla_200

python p2_sim.py vanilla_100 modified_100