import React from 'react';
import { GameState } from '../types/GameTypes';
import { getLevel, getExperienceToNextLevel } from '../utils/actions';
import { Users, Building2, Landmark, Calendar, Trophy, TrendingUp, TrendingDown, AlertTriangle, Star } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { turn, currentPlayer, household, business, government, activeEvents, winner, economicIndicators, playerFaction } = gameState;

  const getCurrentPlayerColor = () => {
    switch (currentPlayer) {
      case 'household': return 'bg-amber-500';
      case 'business': return 'bg-blue-600';
      case 'government': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentPlayerName = () => {
    switch (currentPlayer) {
      case 'household': return '가계';
      case 'business': return '기업';
      case 'government': return '정부';
      default: return '';
    }
  };

  const getPlayerIndicator = (faction: 'household' | 'business' | 'government') => {
    if (playerFaction === faction) {
      return <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full ml-2">플레이어</span>;
    }
    return <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full ml-2">AI</span>;
  };

  const getLevelDisplay = (reputation: number, colorClass: string) => {
    const level = getLevel(reputation);
    const expToNext = getExperienceToNextLevel(reputation);
    const currentExp = reputation % 100;
    const progressPercentage = (currentExp / 100) * 100;
    
    return (
      <div className={`bg-${colorClass}-700/30 p-3 rounded-lg`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span className={`text-${colorClass}-200 text-sm`}>레벨</span>
          </div>
          <span className={`text-xl font-bold text-${colorClass}-100`}>{level}</span>
        </div>
        <div className={`bg-${colorClass}-800 rounded-full h-2 mb-1`}>
          <div 
            className={`bg-${colorClass}-400 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className={`text-xs text-${colorClass}-300`}>
          다음 레벨까지: {expToNext}
        </div>
      </div>
    );
  };

  const getEconomicIndicatorColor = (value: number, type: 'gdp' | 'inflation' | 'unemployment' | 'stock') => {
    switch (type) {
      case 'gdp':
        return value >= 100 ? 'text-green-400' : value >= 80 ? 'text-yellow-400' : 'text-red-400';
      case 'inflation':
        return value <= 3 ? 'text-green-400' : value <= 6 ? 'text-yellow-400' : 'text-red-400';
      case 'unemployment':
        return value <= 5 ? 'text-green-400' : value <= 10 ? 'text-yellow-400' : 'text-red-400';
      case 'stock':
        return value >= 100 ? 'text-green-400' : value >= 80 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-amber-200" />
            <h1 className="text-3xl font-bold text-amber-100">경제 전략 시뮬레이션</h1>
          </div>
          <div className="flex items-center space-x-6 text-amber-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span className="text-lg font-medium">{turn}/30턴</span>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getCurrentPlayerColor()} shadow-lg`}>
              <span className="text-white font-bold">현재: {getCurrentPlayerName()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Indicators */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-3">경제 지표</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">GDP</span>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              <div className={`text-xl font-bold ${getEconomicIndicatorColor(economicIndicators.gdp, 'gdp')}`}>
                {economicIndicators.gdp.toFixed(1)}
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">인플레이션</span>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              <div className={`text-xl font-bold ${getEconomicIndicatorColor(economicIndicators.inflation, 'inflation')}`}>
                {economicIndicators.inflation.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">실업률</span>
                <TrendingDown className="h-4 w-4 text-slate-400" />
              </div>
              <div className={`text-xl font-bold ${getEconomicIndicatorColor(economicIndicators.unemployment, 'unemployment')}`}>
                {economicIndicators.unemployment.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">주식시장</span>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              <div className={`text-xl font-bold ${getEconomicIndicatorColor(economicIndicators.stockMarket, 'stock')}`}>
                {economicIndicators.stockMarket.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-300" />
            <h2 className="text-xl font-bold text-white">{winner}</h2>
          </div>
        </div>
      )}

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-purple-200" />
              <h3 className="text-lg font-bold text-purple-100">진행 중인 이벤트</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeEvents.map((event) => (
                <div key={event.id} className="bg-purple-700/50 p-3 rounded-lg border border-purple-500">
                  <div className="font-semibold text-purple-100">{event.name}</div>
                  <div className="text-sm text-purple-200">{event.description}</div>
                  <div className="text-xs text-purple-300 mt-1">남은 턴: {event.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Game Board */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Household Card */}
          <div className={`bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl shadow-2xl border-2 overflow-hidden ${
            playerFaction === 'household' ? 'border-green-400' : 'border-amber-600'
          }`}>
            <div className="bg-amber-700 p-4 flex items-center space-x-3">
              <Users className="h-6 w-6 text-amber-200" />
              <h3 className="text-xl font-bold text-amber-100">{household.name}</h3>
              {getPlayerIndicator('household')}
              <div className="ml-auto bg-amber-600 px-3 py-1 rounded-full text-sm font-medium text-amber-100">
                {household.actionsUsed}/{household.maxActions} 행동
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-700/30 p-3 rounded-lg">
                  <div className="text-amber-200 text-sm">자금</div>
                  <div className="text-xl font-bold text-amber-100">{household.money.toLocaleString()}원</div>
                </div>
                <div className="bg-amber-700/30 p-3 rounded-lg">
                  <div className="text-amber-200 text-sm">행복도</div>
                  <div className="text-xl font-bold text-amber-100">{household.happiness}%</div>
                </div>
                <div className="bg-amber-700/30 p-3 rounded-lg">
                  <div className="text-amber-200 text-sm">투자자산</div>
                  <div className="text-xl font-bold text-amber-100">{household.investments.toLocaleString()}원</div>
                </div>
                <div className="bg-amber-700/30 p-3 rounded-lg">
                  <div className="text-amber-200 text-sm">기술력</div>
                  <div className="text-xl font-bold text-amber-100">{household.skills}</div>
                </div>
              </div>
              
              {/* 레벨 표시 */}
              <div className="bg-amber-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-200 text-sm">레벨</span>
                  </div>
                  <span className="text-xl font-bold text-amber-100">{getLevel(household.reputation)}</span>
                </div>
                <div className="bg-amber-800 rounded-full h-2 mb-1">
                  <div 
                    className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((household.reputation % 100) / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-amber-300">
                  다음 레벨까지: {getExperienceToNextLevel(household.reputation)}
                </div>
              </div>
              
              {/* 승리 조건 표시 */}
              {playerFaction === 'household' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm font-semibold mb-1">승리 목표</div>
                  <div className="text-green-300 text-xs">
                    총 자산 100,000원 + 행복도 90% 달성
                  </div>
                  <div className="text-green-300 text-xs mt-1">
                    현재: {(household.money + household.investments).toLocaleString()}원 / {household.happiness}%
                  </div>
                </div>
              )}
              
              <div className="bg-amber-700/20 p-3 rounded-lg">
                <div className="text-amber-200 text-sm mb-2">영웅</div>
                {household.heroes.map((hero) => (
                  <div key={hero.id} className="flex items-center space-x-2">
                    <span className="text-2xl">{hero.portrait}</span>
                    <div>
                      <div className="font-medium text-amber-100">{hero.name}</div>
                      <div className="text-xs text-amber-300">{hero.specialty} +{hero.bonus}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Card */}
          <div className={`bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-2xl border-2 overflow-hidden ${
            playerFaction === 'business' ? 'border-green-400' : 'border-blue-600'
          }`}>
            <div className="bg-blue-700 p-4 flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-blue-200" />
              <h3 className="text-xl font-bold text-blue-100">{business.name}</h3>
              {getPlayerIndicator('business')}
              <div className="ml-auto bg-blue-600 px-3 py-1 rounded-full text-sm font-medium text-blue-100">
                {business.actionsUsed}/{business.maxActions} 행동
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-700/30 p-3 rounded-lg">
                  <div className="text-blue-200 text-sm">자본</div>
                  <div className="text-xl font-bold text-blue-100">{business.capital.toLocaleString()}원</div>
                </div>
                <div className="bg-blue-700/30 p-3 rounded-lg">
                  <div className="text-blue-200 text-sm">시장점유율</div>
                  <div className="text-xl font-bold text-blue-100">{business.marketShare}%</div>
                </div>
                <div className="bg-blue-700/30 p-3 rounded-lg">
                  <div className="text-blue-200 text-sm">직원 수</div>
                  <div className="text-xl font-bold text-blue-100">{business.employees}명</div>
                </div>
                <div className="bg-blue-700/30 p-3 rounded-lg">
                  <div className="text-blue-200 text-sm">기술력</div>
                  <div className="text-xl font-bold text-blue-100">{business.technology}</div>
                </div>
              </div>
              
              {/* 레벨 표시 */}
              <div className="bg-blue-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-200 text-sm">레벨</span>
                  </div>
                  <span className="text-xl font-bold text-blue-100">{getLevel(business.reputation)}</span>
                </div>
                <div className="bg-blue-800 rounded-full h-2 mb-1">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((business.reputation % 100) / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-300">
                  다음 레벨까지: {getExperienceToNextLevel(business.reputation)}
                </div>
              </div>
              
              {/* 승리 조건 표시 */}
              {playerFaction === 'business' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm font-semibold mb-1">승리 목표</div>
                  <div className="text-green-300 text-xs">
                    시장점유율 70% + 자본 500,000원 달성
                  </div>
                  <div className="text-green-300 text-xs mt-1">
                    현재: {business.marketShare}% / {business.capital.toLocaleString()}원
                  </div>
                </div>
              )}
              
              <div className="bg-blue-700/20 p-3 rounded-lg">
                <div className="text-blue-200 text-sm mb-2">영웅</div>
                {business.heroes.map((hero) => (
                  <div key={hero.id} className="flex items-center space-x-2">
                    <span className="text-2xl">{hero.portrait}</span>
                    <div>
                      <div className="font-medium text-blue-100">{hero.name}</div>
                      <div className="text-xs text-blue-300">{hero.specialty} +{hero.bonus}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Government Card */}
          <div className={`bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-2xl border-2 overflow-hidden ${
            playerFaction === 'government' ? 'border-green-400' : 'border-red-600'
          }`}>
            <div className="bg-red-700 p-4 flex items-center space-x-3">
              <Landmark className="h-6 w-6 text-red-200" />
              <h3 className="text-xl font-bold text-red-100">{government.name}</h3>
              {getPlayerIndicator('government')}
              <div className="ml-auto bg-red-600 px-3 py-1 rounded-full text-sm font-medium text-red-100">
                {government.actionsUsed}/{government.maxActions} 행동
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-700/30 p-3 rounded-lg">
                  <div className="text-red-200 text-sm">예산</div>
                  <div className="text-xl font-bold text-red-100">{government.budget.toLocaleString()}원</div>
                </div>
                <div className="bg-red-700/30 p-3 rounded-lg">
                  <div className="text-red-200 text-sm">신뢰도</div>
                  <div className="text-xl font-bold text-red-100">{government.trustRating}%</div>
                </div>
                <div className="bg-red-700/30 p-3 rounded-lg">
                  <div className="text-red-200 text-sm">인프라</div>
                  <div className="text-xl font-bold text-red-100">{government.infrastructure}</div>
                </div>
                <div className="bg-red-700/30 p-3 rounded-lg">
                  <div className="text-red-200 text-sm">복지</div>
                  <div className="text-xl font-bold text-red-100">{government.welfare}</div>
                </div>
              </div>
              
              {/* 레벨 표시 */}
              <div className="bg-red-700/30 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-red-400" />
                    <span className="text-red-200 text-sm">레벨</span>
                  </div>
                  <span className="text-xl font-bold text-red-100">{getLevel(government.reputation)}</span>
                </div>
                <div className="bg-red-800 rounded-full h-2 mb-1">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((government.reputation % 100) / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-red-300">
                  다음 레벨까지: {getExperienceToNextLevel(government.reputation)}
                </div>
              </div>
              
              {/* 승리 조건 표시 */}
              {playerFaction === 'government' && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm font-semibold mb-1">승리 목표</div>
                  <div className="text-green-300 text-xs">
                    신뢰도 85% + 인프라 95% 달성
                  </div>
                  <div className="text-green-300 text-xs mt-1">
                    현재: {government.trustRating}% / {government.infrastructure}%
                  </div>
                </div>
              )}
              
              <div className="bg-red-700/20 p-3 rounded-lg">
                <div className="text-red-200 text-sm mb-2">영웅</div>
                {government.heroes.map((hero) => (
                  <div key={hero.id} className="flex items-center space-x-2">
                    <span className="text-2xl">{hero.portrait}</span>
                    <div>
                      <div className="font-medium text-red-100">{hero.name}</div>
                      <div className="text-xs text-red-300">{hero.specialty} +{hero.bonus}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};