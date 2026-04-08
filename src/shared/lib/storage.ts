import * as appSettings from "@nativescript/core/application-settings";

export const storage = {
  set(key: string, value: string): void {
    appSettings.setString(key, value);
  },
  
  get(key: string): string | null {
    return appSettings.getString(key);
  },
  
  remove(key: string): void {
    appSettings.remove(key);
  },
  
  clear(): void {
    appSettings.clear();
  }
};