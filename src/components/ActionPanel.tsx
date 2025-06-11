import React from 'react';
import { GameState } from '../types/GameTypes';
import { Action, HOUSEHOLD_ACTIONS, BUSINESS_ACTIONS, GOVERNMENT_ACTIONS, getLevel } from '../utils/actions';
import { Play, DollarSign, AlertCircle, Star, Zap } from 'lucide-react';

interface ActionPanelProps {
  gameState: GameState;
  onActionExecute: (action: Action) => void;
  onNextTurn: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ gameState, onActionExecute, onNextTurn }) => {
  const { currentPlayer } = gameState;

  const getActions = (): Action[] => {
    switch (currentPlayer) {
      case 'household': return HOUSEHOLD_ACTIONS;
      case 'business': return BUSINESS_ACTIONS;
      case 'government': return GOVERNMENT_ACTIONS;
      default: return [];
    }
  };

  const getCurrentPlayerData = () => {
    switch (currentPlayer) {
      case 'household': return gameState.household;
      case 'business': return gameState.business;
      case 'government': return gameState.government;
      default: return null;
    }
  };

  const getPlayerColor = () => {
    switch (currentPlayer) {
      case 'household': return 'amber';
      case 'business': return 'blue';
      case 'government': return 'red';
      default: return 'gray';
    }
  };

  const getPlayerName = () => {
    switch (currentPlayer) {
      case 'household': return '가계';
      case 'business': return '기업';
      case 'government': return '정부';
      default: return '';
    }
  };

  const actions = getActions();
  const playerData = getCurrentPlayerData();
  const color = getPlayerColor();
  const playerName = getPlayerName();

  if (!playerData) return null;

  const canTakeMoreActions = playerData.actionsUsed < playerData.maxActions;

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">{playerName} 행동 선택</h2>
            <div className={`bg-${color}-600 px-4 py-2 rounded-full text-white font-medium`}>
              {playerData.actionsUsed}/{playerData.maxActions} 행동 완료
            </div>
          </div>
          <button
            onClick={onNextTurn}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 shadow-lg"
          >
            <Play className="h-5 w-5" />
            <span>턴 종료</span>
          </button>
        </div>

        {canTakeMoreActions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => {
              const isAvailable = action.isAvailable(gameState);
              const hasEnoughMoney = currentPlayer === 'household' 
                ? gameState.household.money >= action.cost
                : currentPlayer === 'business'
                ? gameState.business.capital >= action.cost
                : gameState.government.budget >= action.cost;
              
              // 레벨 체크
              const currentLevel = currentPlayer === 'household' 
                ? getLevel(gameState.household.reputation)
                : currentPlayer === 'business'
                ? getLevel(gameState.business.reputation)
                : getLevel(gameState.government.reputation);
              
              const meetsLevelRequirement = !action.requiredLevel || currentLevel >= action.requiredLevel;

              return (
                <div
                  key={action.id}
                  className={`
                    relative bg-slate-700 rounded-lg border-2 transition-all duration-200 overflow-hidden
                    ${isAvailable && hasEnoughMoney && meetsLevelRequirement
                      ? `border-${color}-500 hover:border-${color}-400 hover:shadow-lg cursor-pointer` 
                      : 'border-slate-600 opacity-60 cursor-not-allowed'
                    }
                  `}
                  onClick={() => isAvailable && hasEnoughMoney && meetsLevelRequirement && onActionExecute(action)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-lg">{action.name}</h3>
                      <div className="flex flex-col items-end space-y-1">
                        {action.cost > 0 && (
                          <div className={`flex items-center space-x-1 bg-${color}-600/20 px-2 py-1 rounded-full`}>
                            <DollarSign className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-400">{action.cost.toLocaleString()}</span>
                          </div>
                        )}
                        {action.experienceGain && (
                          <div className="flex items-center space-x-1 bg-purple-600/20 px-2 py-1 rounded-full">
                            <Zap className="h-3 w-3 text-purple-400" />
                            <span className="text-xs font-medium text-purple-400">+{action.experienceGain} EXP</span>
                          </div>
                        )}
                        {action.requiredLevel && (
                          <div className="flex items-center space-x-1 bg-amber-600/20 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-amber-400" />
                            <span className="text-xs font-medium text-amber-400">Lv.{action.requiredLevel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 액션 카테고리 표시 */}
                    {action.category && (
                      <div className="mb-2">
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                          action.category === 'production' ? 'bg-green-600/20 text-green-400' :
                          action.category === 'consumption' ? 'bg-blue-600/20 text-blue-400' :
                          action.category === 'investment' ? 'bg-purple-600/20 text-purple-400' :
                          action.category === 'social' ? 'bg-pink-600/20 text-pink-400' :
                          action.category === 'upgrade' ? 'bg-orange-600/20 text-orange-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}>
                          {
                            action.category === 'production' ? '생산' :
                            action.category === 'consumption' ? '소비' :
                            action.category === 'investment' ? '투자' :
                            action.category === 'social' ? '사회' :
                            action.category === 'upgrade' ? '성장' : '기타'
                          }
                        </span>
                      </div>
                    )}
                    
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{action.description}</p>
                    
                    {!meetsLevelRequirement && (
                      <div className="flex items-center space-x-2 text-amber-400 text-sm">
                        <Star className="h-4 w-4" />
                        <span>레벨 {action.requiredLevel} 필요 (현재: {currentLevel})</span>
                      </div>
                    )}
                    
                    {!isAvailable && meetsLevelRequirement && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>사용할 수 없음</span>
                      </div>
                    )}
                    
                    {!hasEnoughMoney && isAvailable && meetsLevelRequirement && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>자금 부족</span>
                      </div>
                    )}
                  </div>
                  
                  {isAvailable && hasEnoughMoney && meetsLevelRequirement && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${color}-500`}></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-slate-700 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-2">모든 행동을 완료했습니다</h3>
              <p className="text-slate-300 mb-4">턴을 종료하여 다음 플레이어로 넘어가세요.</p>
              <button
                onClick={onNextTurn}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 shadow-lg mx-auto"
              >
                <Play className="h-5 w-5" />
                <span>턴 종료</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};