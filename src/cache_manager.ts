// deletes an element from cache
export function deleteFromCache (key: string, value: any) {
  const currentCache: Array<any> = JSON.parse(window.localStorage.getItem(key) || "[]");
  if (currentCache.length === 0) return console.error("[cache_manager] Can't delete from empty cache");

  const indexToRemove = currentCache.findIndex(element => element.id === value.id);
  if (indexToRemove === -1) return console.error("[cache_manager] Couldn't find object to remove");

  currentCache.splice(indexToRemove, 1);
  window.localStorage.setItem(key, JSON.stringify(currentCache));
  console.log(`[cache_manager] Successfully removed ${value.id} from cache.`);
}

// updates or adds a new element to cache
export function appendToCache (key: string, value: any) {
  const currentCache: Array<any> = JSON.parse(window.localStorage.getItem(key) || "[]");

  const indexToReplace = currentCache.findIndex(element => element.id === value.id);
  if (indexToReplace === -1) currentCache.push(value);
  else currentCache[indexToReplace] = value;

  window.localStorage.setItem(key, JSON.stringify(currentCache));
  console.log(`[cache_manager] Successfully appended ${value.id} to cache`);
}
