// Seven-day narrative data and designer-authored behavioral evidence.
// Evidence values range from -1 (evidence against a tendency) to 1 (strong
// evidence for it). A choice can support several dimensions at once, so these
// values describe trade-offs rather than MBTI-style answer keys.

function evidence(values) {

    const completeEvidence = {};

    for (const dimension of PLAYER_DIMENSIONS) {
        completeEvidence[dimension] = values[dimension] || 0;
    }

    return completeEvidence;
}


function morningActivity(id, title, description, values) {

    const behavioralEvidence = evidence(values);

    return {
        id: id,
        choiceId: id,
        category: "free-activity",
        title: title,
        description: description,
        behavioralEvidence: behavioralEvidence,
        importance: 0.7
    };
}


function storyChoice(id, text, values, importance = 1) {

    const behavioralEvidence = evidence(values);

    return {
        id: id,
        choiceId: id,
        text: text,
        behavioralEvidence: behavioralEvidence,
        importance: importance
    };
}


const gameData = {

    1: {
        morningActivities: [
            morningActivity(
                "day1_morning_read_book",
                "Read a Book",
                "Spend some quiet time reading and learning about the world.",
                evidence({ curiosity: 0.7, planning: 0.35, independence: 0.3, orderliness: 0.45, sociability: -0.25 })
            ),
            morningActivity(
                "day1_morning_explore_town",
                "Explore the Town",
                "Walk around and discover unfamiliar places in the town.",
                evidence({ curiosity: 0.75, riskTaking: 0.25, independence: 0.4, noveltySeeking: 0.7, orderliness: -0.2 })
            ),
            morningActivity(
                "day1_morning_help_resident",
                "Help a Resident",
                "Help someone in town with a small problem.",
                evidence({ empathy: 0.8, sociability: 0.65, independence: -0.2, planning: 0.15 })
            )
        ],
        afternoonEvent: {
            id: "day1_arrival",
            category: "investigation",
            title: "Day 1 - Arrival",
            description: "You arrive in the town and learn that an important item has disappeared.",
            choices: [
                storyChoice("day1_inspect_area", "Inspect the area carefully", evidence({ curiosity: 0.65, planning: 0.7, orderliness: 0.75, riskTaking: -0.2 })),
                storyChoice("day1_ask_residents", "Ask nearby residents what happened", evidence({ curiosity: 0.35, empathy: 0.55, sociability: 0.8, independence: -0.25 })),
                storyChoice("day1_explore_alone", "Explore the area on your own", evidence({ curiosity: 0.65, riskTaking: 0.3, independence: 0.8, noveltySeeking: 0.55, sociability: -0.3 }))
            ]
        }
    },

    2: {
        morningActivities: [
            morningActivity("day2_morning_market", "Visit the Market", "Walk through the local market and observe the people around you.", evidence({ curiosity: 0.4, empathy: 0.2, sociability: 0.65, noveltySeeking: 0.4 })),
            morningActivity("day2_morning_game", "Play a Game", "Relax and spend some time playing a game.", evidence({ curiosity: 0.2, riskTaking: 0.15, independence: 0.35, noveltySeeking: 0.55, planning: -0.15 })),
            morningActivity("day2_morning_walk", "Take a Walk", "Spend some quiet time walking through the town.", evidence({ curiosity: 0.3, empathy: 0.1, independence: 0.6, sociability: -0.25, orderliness: 0.15 }))
        ],
        afternoonEvent: {
            id: "day2_conflicting_testimony",
            category: "evidence",
            title: "Day 2 - Conflicting Testimony",
            description: "Two residents give you different stories about what happened.",
            choices: [
                storyChoice("day2_trust_first", "Trust the first resident", evidence({ empathy: 0.45, riskTaking: 0.35, planning: -0.45, orderliness: -0.25 })),
                storyChoice("day2_trust_second", "Trust the second resident", evidence({ empathy: 0.35, riskTaking: 0.4, independence: 0.2, planning: -0.4 })),
                storyChoice("day2_keep_investigating", "Keep investigating before deciding", evidence({ curiosity: 0.7, planning: 0.8, orderliness: 0.7, riskTaking: -0.35 }))
            ]
        }
    },

    3: {
        morningActivities: [
            morningActivity("day3_morning_exercise", "Exercise", "Spend the morning exercising and challenging yourself.", evidence({ riskTaking: 0.4, planning: 0.2, independence: 0.5, orderliness: 0.25 })),
            morningActivity("day3_morning_draw", "Draw", "Spend the morning creating something with your imagination.", evidence({ curiosity: 0.3, empathy: 0.15, independence: 0.45, orderliness: -0.2, noveltySeeking: 0.8 })),
            morningActivity("day3_morning_explore", "Explore", "Visit somewhere unfamiliar and see what you can discover.", evidence({ curiosity: 0.75, riskTaking: 0.55, independence: 0.35, noveltySeeking: 0.8, planning: -0.15 }))
        ],
        afternoonEvent: {
            id: "day3_restricted_area",
            category: "risk",
            title: "Day 3 - Restricted Area",
            description: "A clue leads toward an area that you are not supposed to enter.",
            choices: [
                storyChoice("day3_enter_anyway", "Enter the area anyway", evidence({ curiosity: 0.5, riskTaking: 0.9, independence: 0.7, orderliness: -0.75, planning: -0.25 })),
                storyChoice("day3_legal_entry", "Look for a legal way inside", evidence({ curiosity: 0.45, riskTaking: -0.35, planning: 0.85, orderliness: 0.8, independence: 0.15 })),
                storyChoice("day3_observe_outside", "Observe the area from outside", evidence({ curiosity: 0.65, riskTaking: -0.55, planning: 0.55, independence: 0.45, orderliness: 0.3 }))
            ]
        }
    },

    4: {
        morningActivities: [
            morningActivity("day4_morning_notes", "Organize Your Notes", "Review everything you have learned during the investigation.", evidence({ curiosity: 0.25, planning: 0.75, independence: 0.25, orderliness: 0.85, noveltySeeking: -0.3 })),
            morningActivity("day4_morning_residents", "Talk to Residents", "Spend time talking with the local residents.", evidence({ curiosity: 0.3, empathy: 0.5, sociability: 0.8, independence: -0.35 })),
            morningActivity("day4_morning_new_place", "Visit a New Place", "Explore another unfamiliar part of the town.", evidence({ curiosity: 0.7, riskTaking: 0.25, independence: 0.4, noveltySeeking: 0.75, orderliness: -0.2 }))
        ],
        afternoonEvent: {
            id: "day4_suspect",
            category: "conflict",
            title: "Day 4 - The Suspect",
            description: "The evidence points toward a suspicious resident, but you are not sure whether they are truly responsible.",
            choices: [
                storyChoice("day4_confront", "Confront the suspect directly", evidence({ empathy: -0.25, riskTaking: 0.75, sociability: 0.25, independence: 0.65, planning: -0.25 })),
                storyChoice("day4_observe", "Observe the suspect quietly", evidence({ curiosity: 0.6, riskTaking: -0.3, planning: 0.6, independence: 0.55, sociability: -0.3 })),
                storyChoice("day4_more_evidence", "Search for more evidence first", evidence({ curiosity: 0.7, empathy: 0.2, riskTaking: -0.4, planning: 0.75, orderliness: 0.7 }))
            ]
        }
    },

    5: {
        morningActivities: [
            morningActivity("day5_morning_puzzle", "Solve a Puzzle", "Spend some time solving a difficult puzzle.", evidence({ curiosity: 0.65, planning: 0.7, independence: 0.25, orderliness: 0.65, sociability: -0.2 })),
            morningActivity("day5_morning_help", "Help Someone", "Offer your help to someone nearby.", evidence({ empathy: 0.85, sociability: 0.7, independence: -0.25, planning: 0.15 })),
            morningActivity("day5_morning_creature", "Explore with Your Creature", "Explore the town together with your soul creature.", evidence({ curiosity: 0.65, empathy: 0.55, riskTaking: 0.2, noveltySeeking: 0.6 }))
        ],
        afternoonEvent: {
            id: "day5_creature_clue",
            category: "creature-clue",
            title: "Day 5 - Creature's Clue",
            description: "Your creature notices something important that you missed during the investigation.",
            choices: [
                storyChoice("day5_follow_immediately", "Follow your creature immediately", evidence({ empathy: 0.65, riskTaking: 0.65, planning: -0.35, noveltySeeking: 0.5 })),
                storyChoice("day5_study_clue", "Study the clue carefully", evidence({ curiosity: 0.65, riskTaking: -0.2, planning: 0.75, orderliness: 0.7 })),
                storyChoice("day5_ask_other", "Ask someone else about the clue", evidence({ curiosity: 0.3, empathy: 0.5, sociability: 0.8, independence: -0.35 }))
            ]
        }
    },

    6: {
        morningActivities: [
            morningActivity("day6_morning_think", "Think Alone", "Spend some quiet time thinking about everything you have discovered.", evidence({ curiosity: 0.2, planning: 0.65, sociability: -0.4, independence: 0.75, orderliness: 0.35 })),
            morningActivity("day6_morning_people", "Meet Other People", "Talk with other people and compare the information you have found.", evidence({ curiosity: 0.35, empathy: 0.5, sociability: 0.8, independence: -0.3, planning: 0.2 })),
            morningActivity("day6_morning_clues", "Search for More Clues", "Continue exploring and search for anything you may have missed.", evidence({ curiosity: 0.8, planning: 0.55, independence: 0.25, orderliness: 0.25, noveltySeeking: 0.5 }))
        ],
        afternoonEvent: {
            id: "day6_truth",
            category: "moral",
            title: "Day 6 - The Truth",
            description: "You discover that someone is trying to remove the differences between soul creatures and force them into one supposedly perfect form.",
            choices: [
                storyChoice("day6_stop_plan", "Focus on stopping the plan", evidence({ empathy: 0.25, riskTaking: 0.7, planning: 0.45, independence: 0.65 })),
                storyChoice("day6_understand_reason", "Try to understand the reason behind it", evidence({ curiosity: 0.5, empathy: 0.85, riskTaking: -0.3, sociability: 0.35 })),
                storyChoice("day6_another_solution", "Search for another solution", evidence({ curiosity: 0.65, empathy: 0.3, planning: 0.55, orderliness: -0.2, noveltySeeking: 0.75 }))
            ]
        }
    },

    7: {
        morningActivities: [
            morningActivity("day7_morning_prepare", "Prepare Carefully", "Create a careful plan before the final confrontation.", evidence({ riskTaking: -0.3, planning: 0.9, independence: 0.2, orderliness: 0.85 })),
            morningActivity("day7_morning_instincts", "Trust Your Instincts", "Prepare to act based on your feelings and instincts.", evidence({ riskTaking: 0.65, planning: -0.55, independence: 0.65, orderliness: -0.4, noveltySeeking: 0.25 })),
            morningActivity("day7_morning_creature", "Spend Time with Your Creature", "Spend a quiet moment with your soul creature before the final decision.", evidence({ empathy: 0.9, sociability: 0.25, independence: 0.25, noveltySeeking: -0.15 }))
        ],
        afternoonEvent: {
            id: "day7_final_choice",
            category: "final-moral-choice",
            title: "Day 7 - Final Choice",
            description: "You reach the end of the investigation and must decide what should happen to the soul creatures.",
            choices: [
                storyChoice("day7_protect_individuality", "Protect everyone's individuality", evidence({ empathy: 0.75, riskTaking: 0.25, independence: 0.8, orderliness: -0.2 }), 1.5),
                storyChoice("day7_compromise", "Seek a compromise", evidence({ empathy: 0.75, planning: 0.65, sociability: 0.8, independence: -0.25 }), 1.5),
                storyChoice("day7_self_determination", "Let everyone choose for themselves", evidence({ empathy: 0.6, riskTaking: 0.25, planning: -0.2, independence: 0.9, noveltySeeking: 0.45 }), 1.5)
            ]
        }
    }
};
