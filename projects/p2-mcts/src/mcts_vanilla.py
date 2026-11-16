
from mcts_node import MCTSNode
from p2_t3 import Board
from random import choice
from math import sqrt, log

num_nodes = 1000
explore_faction = 2.

def traverse_nodes(node: MCTSNode, board: Board, state, bot_identity: int):
    """ Traverses the tree until the end criterion are met.
    e.g. find the best expandable node (node with untried action) if it exist,
    or else a terminal node

    Args:
        node:       A tree node from which the search is traversing.
        board:      The game setup.
        state:      The state of the game.
        identity:   The bot's identity, either 1 or 2

    Returns:
        node: A node from which the next stage of the search can proceed.
        state: The state associated with that node

    """
    while not board.is_ended(state):

        if len(node.untried_actions) > 0:
            return node, state

        if len(node.child_nodes) == 0:
            return node, state

        is_opponent = board.current_player(state) != bot_identity

        best_action = None
        best_child = None
        best_score = None

        for action in node.child_nodes:
            child = node.child_nodes[action]
            score = ucb(child, is_opponent)

            if best_score is None or score > best_score:
                best_score = score
                best_action = action
                best_child = child

        state = board.next_state(state, best_action)
        node = best_child

    return node, state

def expand_leaf(node: MCTSNode, board: Board, state):
    """ Adds a new leaf to the tree by creating a new child node for the given node (if it is non-terminal).

    Args:
        node:   The node for which a child will be added.
        board:  The game setup.
        state:  The state of the game.

    Returns:
        node: The added child node
        state: The state associated with that node

    """
    if board.is_ended(state):
        return node, state

    if len(node.untried_actions) == 0:
        return node, state

    action = choice(node.untried_actions)
    node.untried_actions.remove(action)

    new_state = board.next_state(state, action)

    new_node = MCTSNode(
        parent=node,
        parent_action=action,
        action_list=list(board.legal_actions(new_state))
    )

    node.child_nodes[action] = new_node

    return new_node, new_state


def rollout(board: Board, state):
    """ Given the state of the game, the rollout plays out the remainder randomly.

    Args:
        board:  The game setup.
        state:  The state of the game.
    
    Returns:
        state: The terminal game state

    """
    while not board.is_ended(state):
        actions = list(board.legal_actions(state))
        action = choice(actions)
        state = board.next_state(state, action)

    return state


def backpropagate(node: MCTSNode|None, won: bool):
    """ Navigates the tree from a leaf node to the root, updating the win and visit count of each node along the path.

    Args:
        node:   A leaf node.
        won:    An indicator of whether the bot won or lost the game.

    """
    while node is not None:
        node.visits += 1

        if won:
            node.wins += 1

        node = node.parent

def ucb(node: MCTSNode, is_opponent: bool):
    """ Calcualtes the UCB value for the given node from the perspective of the bot

    Args:
        node:   A node.
        is_opponent: A boolean indicating whether or not the last action was performed by the MCTS bot
    Returns:
        The value of the UCB function for the given node
    """
    if node.visits == 0:
        return float("inf")

    win_rate = node.wins / node.visits

    if is_opponent:
        win_rate = 1 - win_rate

    parent_visits = node.parent.visits

    if parent_visits < 1:
        parent_visits = 1

    explore = explore_faction * sqrt(log(parent_visits) / node.visits)

    return win_rate + explore

def get_best_action(root_node: MCTSNode):
    """ Selects the best action from the root node in the MCTS tree

    Args:
        root_node:   The root node
    Returns:
        action: The best action from the root node
    
    """
    best_action = None
    best_visits = -1

    for action in root_node.child_nodes:
        child = root_node.child_nodes[action]

        if child.visits > best_visits:
            best_visits = child.visits
            best_action = action

    return best_action

def is_win(board: Board, state, identity_of_bot: int):
    # checks if state is a win state for identity_of_bot
    outcome = board.points_values(state)
    assert outcome is not None, "is_win was called on a non-terminal state"
    return outcome[identity_of_bot] == 1

def think(board: Board, current_state, previous_tree=None):
    """ Performs MCTS by sampling games and calling the appropriate functions to construct the game tree.

    Args:
        board:  The game setup.
        current_state:  The current state of the game.
        previous_tree: The previous MCTS tree (if any)
    Returns:    The action to be taken from the current state

    """
    bot_identity = board.current_player(current_state) # 1 or 2

    if previous_tree is None:
        root_node = MCTSNode(
            parent=None,
            parent_action=None,
            action_list=list(board.legal_actions(current_state))
        )
    else:
        root_node = previous_tree
        root_node.parent = None


    for _ in range(num_nodes):
        state = current_state
        node = root_node

        # Do MCTS - This is all you!
        # ...

        node, state = traverse_nodes(node, board, state, bot_identity)

        node, state = expand_leaf(node, board, state)

        end_state = rollout(board, state)

        won = is_win(board, end_state, bot_identity)
        backpropagate(node, won)

    # Return an action, typically the most frequently used action (from the root) or the action with the best
    # estimated win rate.
    best_action = get_best_action(root_node)
    
    #print(f"Action chosen: {best_action}")
    return best_action
