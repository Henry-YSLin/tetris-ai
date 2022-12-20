enum LoadState {
  /**
   * Dependency injection has not been completed.
   */
  NotLoaded,
  /**
   * Dependencies are injected, but setup has not been called.
   */
  Ready,
  /**
   * Setup has been called.
   */
  Loaded,
}
export default LoadState;
