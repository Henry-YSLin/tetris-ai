/**
 * Width of the grid/playfield
 */
export const GRID_WIDTH = 10;

/**
 * Full height of the grid
 */
export const GRID_HEIGHT = 40;

/**
 * Height of the visible playfield
 */
export const PLAYFIELD_HEIGHT = 20;

/**
 * Number of game ticks per second
 */
export const TICK_RATE = 60;

/**
 * Number of ticks from contact to locking the piece
 */
export const LOCK_DELAY = 60;

/**
 * Number of ticks between each drop by gravity
 */
export const DROP_INTERVAL = 15;

/**
 * Number of visible pieces in the queue
 */
export const QUEUE_LENGTH = 6;

/**
 * The least number of ticks to wait between AI actions
 */
export const AI_ACTION_DELAY = 10;

/**
 * Size of a block in pixels
 */
export const BLOCK_SIZE = 20;

/**
 * Number of frames to wait before repeating input
 */
export const DAS_DELAY = 10;

/**
 * Number of frames to wait between repeated inputs
 */
export const DAS_INTERVAL = 3;

/**
 * Number of frames a normal animation lasts for
 */
export const ANIMATION_DURATION = 20;

/**
 * Master volume for all sounds
 */
export const SOUND_VOLUME = 0.5;

/**
 * Number of ticks to wait in the garbage meter before garbage lines are
 * actually created
 */
export const GARBAGE_DELAY = 4 * 60;
