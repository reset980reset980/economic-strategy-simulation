import { GameState } from '../types/GameTypes';

const SAVE_KEY = 'economicStrategy_savedGame';

export interface SaveData {
  gameState: GameState;
  timestamp: number;
  version: string;
}

export function saveGame(gameState: GameState): boolean {
  try {
    const saveData: SaveData = {
      gameState,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('💾 게임 저장 완료');
    return true;
  } catch (error) {
    console.error('❌ 게임 저장 실패:', error);
    return false;
  }
}

export function loadGame(): GameState | null {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) {
      console.log('📁 저장된 게임이 없습니다');
      return null;
    }
    
    const parseData: SaveData = JSON.parse(savedData);
    console.log('📂 게임 불러오기 완료');
    return parseData.gameState;
  } catch (error) {
    console.error('❌ 게임 불러오기 실패:', error);
    return null;
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSavedGame(): void {
  localStorage.removeItem(SAVE_KEY);
  console.log('🗑️ 저장된 게임 삭제 완료');
}

export function getSaveInfo(): { timestamp: number; turn: number } | null {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;
    
    const parseData: SaveData = JSON.parse(savedData);
    return {
      timestamp: parseData.timestamp,
      turn: parseData.gameState.turn
    };
  } catch {
    return null;
  }
}
