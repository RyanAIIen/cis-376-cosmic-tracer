/**
 * Game API Service
 * Handles communication with the backend API for game-related functionality
 */

// Configuration
const DEBUG_MODE = false; // Set to false in production

/**
 * Log message only in debug mode
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
const debugLog = (message, data) => {
  if (DEBUG_MODE) {
    if (data !== undefined) {
      console.log(`[GameAPI] ${message}:`, data);
    } else {
      console.log(`[GameAPI] ${message}`);
    }
  }
};

/**
 * Submit the user's high score to the server
 * @param {number} score - The player's high score
 * @param {number} timePlayed - Time played in seconds
 * @returns {Promise<Object>} - Response with success status and optional error
 */
export const submitScore = async (score, timePlayed = 0) => {
  try {
    debugLog('Submitting high score', { score, timePlayed });
    
    // First, refresh the token to ensure we have a valid session
    try {
      await fetch('/jwt/refresh/', {
        method: 'POST',
        credentials: 'include',
      });
      debugLog('Token refreshed successfully');
    } catch (refreshError) {
      console.warn('[GameAPI] Token refresh failed:', refreshError);
      // Continue with score submission anyway
    }
    
    // Submit the score
    const response = await fetch('/api/scores/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        score, 
        time_played: timePlayed 
      }),
      credentials: 'include',
    });
    
    debugLog('Score submission response status', `${response.status} ${response.statusText}`);
    
    // Handle response status
    if (!response.ok) {
      if (response.status === 401) {
        console.error('[GameAPI] Authentication failed when submitting score');
        return { 
          success: false, 
          error: 'Authentication failed',
          message: 'Please refresh the page and log in again'
        };
      }
      
      return { 
        success: false,
        error: `Server error: ${response.status}`,
        message: 'Failed to submit score' 
      };
    }
    
    // Parse successful response
    const data = await response.json();
    debugLog('Score submission successful', data);
    return { ...data, success: true };
  } catch (error) {
    console.error('[GameAPI] Error submitting score:', error);
    return { 
      success: false,
      error: 'network_error',
      message: 'Connection error while submitting score'
    };
  }
};

/**
 * Get the leaderboard data
 * @returns {Promise<Array>} - Array of high scores
 */
export const getLeaderboard = async () => {
  try {
    // Add a random query parameter to prevent caching issues
    const timestamp = new Date().getTime();
    const url = `/api/scores/leaderboard/?_=${timestamp}`;
    
    debugLog('Fetching leaderboard', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      // Use manual redirect handling for debugging
      redirect: 'follow',
    });
    
    // Log redirects for debugging
    if (response.status === 301 || response.status === 302) {
      debugLog('Redirect detected', response.headers.get('Location'));
    }
    
    // Check response status
    if (!response.ok) {
      console.error(`[GameAPI] Leaderboard request failed: ${response.status} ${response.statusText}`);
      return [];
    }
    
    // Parse the response as text first to debug any issues
    const text = await response.text();
    
    try {
      // Try to parse the text as JSON
      const data = JSON.parse(text);
      debugLog('Leaderboard data received', { count: data.length });
      return data;
    } catch (parseError) {
      console.error('[GameAPI] Error parsing leaderboard JSON:', parseError);
      debugLog('Response text', text);
      return [];
    }
  } catch (error) {
    console.error('[GameAPI] Error fetching leaderboard:', error);
    return [];
  }
}; 