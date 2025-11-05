// utils/offlineQueue.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@homeiq_offline_queue';
const MAX_QUEUE_SIZE = 100; // Prevent unlimited growth

/**
 * Add an action to the offline queue
 * @param {object} action - Action object to queue
 * @param {string} action.type - Action type identifier
 * @param {any} action.data - Action data
 * @param {string} action.endpoint - Optional API endpoint
 */
export const addToQueue = async (action) => {
  try {
    const queue = await getQueue();
    
    // Check queue size limit
    if (queue.length >= MAX_QUEUE_SIZE) {
      console.warn('⚠ Offline queue is full, removing oldest item');
      queue.shift(); // Remove oldest item
    }
    
    const queueItem = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    };
    
    queue.push(queueItem);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    
    console.log(`✓ Added to offline queue: ${action.type} (${queue.length} items)`);
    return queueItem.id;
  } catch (error) {
    console.error('Error adding to queue:', error);
    throw error;
  }
};

/**
 * Get the current offline queue
 * @returns {Array} Queue items
 */
export const getQueue = async () => {
  try {
    const queue = await AsyncStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error reading queue:', error);
    return [];
  }
};

/**
 * Remove specific item from queue
 * @param {string} itemId - Queue item ID
 */
export const removeFromQueue = async (itemId) => {
  try {
    const queue = await getQueue();
    const updatedQueue = queue.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    console.log(`✓ Removed from queue: ${itemId}`);
  } catch (error) {
    console.error('Error removing from queue:', error);
  }
};

/**
 * Clear the entire offline queue
 */
export const clearQueue = async () => {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
    console.log('✓ Cleared offline queue');
  } catch (error) {
    console.error('Error clearing queue:', error);
  }
};

/**
 * Get queue statistics
 * @returns {object} Queue stats
 */
export const getQueueStats = async () => {
  try {
    const queue = await getQueue();
    return {
      total: queue.length,
      pending: queue.filter(item => item.status === 'pending').length,
      failed: queue.filter(item => item.status === 'failed').length,
      oldestTimestamp: queue.length > 0 ? queue[0].timestamp : null,
    };
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return { total: 0, pending: 0, failed: 0, oldestTimestamp: null };
  }
};

/**
 * Process the offline queue when back online
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - Current user ID
 * @returns {object} Processing results
 */
export const processQueue = async (supabase, userId) => {
  const queue = await getQueue();
  
  if (queue.length === 0) {
    console.log('✓ No items in offline queue');
    return { processed: 0, failed: 0, total: 0 };
  }
  
  console.log(`🔄 Processing ${queue.length} queued items...`);
  
  const results = {
    processed: 0,
    failed: 0,
    total: queue.length,
    errors: [],
  };
  
  const remainingQueue = [];
  
  for (const item of queue) {
    try {
      await processQueueItem(supabase, userId, item);
      results.processed++;
      console.log(`✓ Synced: ${item.type} (${item.id})`);
    } catch (error) {
      console.error(`✗ Failed to sync: ${item.type} (${item.id})`, error);
      
      item.retryCount = (item.retryCount || 0) + 1;
      item.status = 'failed';
      item.lastError = error.message;
      
      // Keep in queue if retry count is reasonable
      if (item.retryCount < 3) {
        remainingQueue.push(item);
      } else {
        console.warn(`⚠ Max retries reached for: ${item.id}, removing from queue`);
      }
      
      results.failed++;
      results.errors.push({ id: item.id, error: error.message });
    }
  }
  
  // Update queue with remaining failed items
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
  
  console.log(`✓ Queue processed: ${results.processed} succeeded, ${results.failed} failed`);
  
  return results;
};

/**
 * Process individual queue item
 * @param {object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {object} item - Queue item
 */
const processQueueItem = async (supabase, userId, item) => {
  const { type, data } = item;
  
  switch (type) {
    case 'UPDATE_APPLIANCE':
      await supabase
        .from('appliances')
        .update(data)
        .eq('id', item.applianceId)
        .eq('user_id', userId);
      break;
      
    case 'ADD_APPLIANCE':
      await supabase
        .from('appliances')
        .insert({ ...data, user_id: userId });
      break;
      
    case 'DELETE_APPLIANCE':
      await supabase
        .from('appliances')
        .delete()
        .eq('id', item.applianceId)
        .eq('user_id', userId);
      break;
      
    case 'UPDATE_PROFILE':
      await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);
      break;
      
    case 'UPDATE_LOADSHEDDING_AREA':
      await supabase
        .from('profiles')
        .update({ loadshedding_area: data.areaCode })
        .eq('id', userId);
      break;
      
    case 'UPDATE_AUTOMATION':
      await supabase
        .from('loadshedding_automation')
        .upsert({
          user_id: userId,
          ...data,
        });
      break;
      
    default:
      console.warn(`Unknown queue item type: ${type}`);
      throw new Error(`Unsupported action type: ${type}`);
  }
};

/**
 * Preview what will be synced (for debugging)
 * @returns {Array} Queue preview
 */
export const previewQueue = async () => {
  const queue = await getQueue();
  return queue.map(item => ({
    id: item.id,
    type: item.type,
    timestamp: item.timestamp,
    retryCount: item.retryCount,
    status: item.status,
  }));
};
