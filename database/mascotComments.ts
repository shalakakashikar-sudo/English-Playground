
// @/database/mascotComments.ts

export const mascotComments = {
  WELCOME: [
    "Let's get this brain party started!",
    "Ready to show those words who's boss?",
    "Alright, let's learn something awesome!",
    "Good luck! I'm rooting for you!",
    "Let the games begin!"
  ],
  MASCOT_CLICK: [
    "Hi there! Ready to play?",
    "You can do it!",
    "Let's learn something new!",
    "Boop!",
    "Click a game to start!"
  ],
  CORRECT_ANSWER: [
    "You're on fire! (Not literally, of course.)",
    "Wow, you're a genius!",
    "Nailed it!",
    "That's the one!",
    "Correctamundo!",
    "High five! (If I had hands...)",
    "Your brain is sparkling!",
    "Amazing!",
    "You've got this!"
  ],
  INCORRECT_ANSWER: [
    "Almost! The right answer was just around the corner.",
    "No worries! Every guess is a step forward.",
    "That was a tricky one!",
    "Don't give up! You're so close.",
    "Oops! Let's try the next one.",
    "My circuits got crossed on that one too.",
    "Shake it off! You've got the next one.",
    "So close! You'll get it next time."
  ],
  THINKING: [
    "Hmm... what's it going to be?",
    "I'm thinking... are you thinking?",
    "Take your time... but not *too* much time!",
    "The gears in your brain are turning!",
    "I believe in you!",
  ],
  TIME_RUNNING_OUT: [
    "Quick, quick, quick!",
    "The clock is ticking!",
    "Go, go, go!",
    "Don't let the timer win!"
  ],
  TIME_UP: [
    "Time's up!",
    "Aww, out of time!",
    "The clock beat us this time!"
  ],
  HIGH_SCORE: [
    "Are you a wizard? That was magical!",
    "Incredible score! You're a true champion.",
    "You aced it! Time for a victory dance!",
    "Top-notch performance!"
  ],
  MEDIUM_SCORE: [
    "Great effort! You're getting better and better.",
    "Awesome job! Ready for another round?",
    "That's a solid score! Keep it up!",
    "Nice work! Let's beat that score next time."
  ],
  LOW_SCORE: [
    "You're just warming up! The next round will be better.",
    "Practice makes perfect! You've got this.",
    "Every expert was once a beginner. Let's go again!",
    "Don't worry, we'll get 'em next time!"
  ],
  WOWED_SCORE: [
    "Unbelievable! Are you a vocabulary wizard?",
    "My circuits are blown! That's an amazing score!",
    "You're a legend! Absolutely legendary!",
    "Wow! Just... wow! Top-tier performance!"
  ],
  SAD_SCORE: [
    "Aww, that's okay. This was a tough one.",
    "Don't feel down! We can try again together.",
    "Learning is a journey, not a race. Let's keep going!",
    "Hey, every mistake is a lesson learned. No biggie!"
  ],
  HINT_USED: [
    "A little help never hurt anybody!",
    "Good call! Sometimes we all need a clue.",
    "Teamwork makes the dream work!"
  ],
  WORD_DETECTIVE: [
    "Aha! Let the investigation begin!",
    "The game is afoot, detective!",
    "Let's solve this mystery!"
  ]
};

/**
 * Gets a random comment from a specified category.
 * @param category The category of comment to retrieve.
 * @returns A random comment string.
 */
export const getRandomComment = (category: keyof typeof mascotComments): string => {
  const comments = mascotComments[category];
  if (!comments || comments.length === 0) {
    return ""; // Fallback for safety
  }
  return comments[Math.floor(Math.random() * comments.length)];
};
