import React, { useState } from 'react';
import { PlayerType } from '../types/GameTypes';
import { GameSettings, DEFAULT_SETTINGS, saveSettings } from '../utils/gameSettings';
import { Users, Building2, Landmark, Settings, Clock, Zap, DollarSign, Target } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (faction: PlayerType, settings: GameSettings) => void;
  onContinueGame?: () => void;
  hasSavedGame?: boolean;
}

export const GameSetup: React.FC<GameSetupProps> = ({ 
  onStartGame, 
  onContinueGame, 
  hasSavedGame = false 
}) => {
  const [selectedFaction, setSelectedFaction] = useState<PlayerType | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const factions = [
    {
      id: 'household' as PlayerType,
      name: '가계 (김씨 가문)',
      icon: Users,
      color: 'amber',
      description: '높은 적응력과 소비 주도형 경제 활동',
      victory: '총 자산 100,000원 + 행복도 90%',
      difficulty: '⭐⭐☆',
      bgGradient: 'from-amber-800 to-amber-900'
    },
    {
      id: 'business' as PlayerType,
      name: '기업 (혁신기업 코퍼레이션)',
      icon: Building2,
      color: 'blue',
      description: '자본 축적과 기술 혁신을 통한 성장',
      victory: '시장점유율 70% + 자본 500,000원',
      difficulty: '⭐⭐⭐',
      bgGradient: 'from-blue-800 to-blue-900'
    },
    {
      id: 'government' as PlayerType,
      name: '정부 (대한민국 정부)',
      icon: Landmark,
      color: 'red',
      description: '정책 수립과 사회 안정을 통한 국가 발전',
      victory: '신뢰도 85% + 인프라 95%',
      difficulty: '⭐⭐⭐',
      bgGradient: 'from-red-800 to-red-900'
    }
  ];

  const handleStartGame = () => {
    if (!selectedFaction) return;
    
    saveSettings(settings);
    onStartGame(selectedFaction, settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-8 shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-4">
            🏆 경제 전략 시뮬레이션
          </h1>
          <p className="text-amber-200 text-lg">
            3개 세력 중 하나를 선택하여 경제적 패권을 장악하세요
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Continue Game Button */}
        {hasSavedGame && onContinueGame && (
          <div className="mb-8 text-center">
            <button
              onClick={onContinueGame}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              📂 저장된 게임 이어하기
            </button>
          </div>
        )}

        {/* Settings Toggle */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 mx-auto"
          >
            <Settings className="h-5 w-5" />
            <span>{showSettings ? '설정 닫기' : '게임 설정'}</span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <h3 className="text-xl font-bold mb-6 text-center">게임 설정</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Game Length */}
              <div>
                <label className="flex items-center space-x-2 text-slate-300 mb-3">
                  <Clock className="h-4 w-4" />
                  <span>게임 길이</span>
                </label>
                <select
                  value={settings.gameLength}
                  onChange={(e) => setSettings({...settings, gameLength: Number(e.target.value) as 15 | 30 | 45})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={15}>짧게 (15턴)</option>
                  <option value={30}>보통 (30턴)</option>
                  <option value={45}>길게 (45턴)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="flex items-center space-x-2 text-slate-300 mb-3">
                  <Target className="h-4 w-4" />
                  <span>난이도</span>
                </label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => setSettings({...settings, difficulty: e.target.value as 'easy' | 'normal' | 'hard'})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="easy">쉬움 (승리 조건 -20%)</option>
                  <option value="normal">보통</option>
                  <option value="hard">어려움 (승리 조건 +20%)</option>
                </select>
              </div>

              {/* Starting Resources */}
              <div>
                <label className="flex items-center space-x-2 text-slate-300 mb-3">
                  <DollarSign className="h-4 w-4" />
                  <span>시작 자원</span>
                </label>
                <select
                  value={settings.startingResources}
                  onChange={(e) => setSettings({...settings, startingResources: Number(e.target.value) as 0.5 | 1.0 | 1.5})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value={0.5}>적게 (50%)</option>
                  <option value={1.0}>보통 (100%)</option>
                  <option value={1.5}>많게 (150%)</option>
                </select>
              </div>

              {/* AI Speed */}
              <div>
                <label className="flex items-center space-x-2 text-slate-300 mb-3">
                  <Zap className="h-4 w-4" />
                  <span>AI 속도</span>
                </label>
                <select
                  value={settings.aiSpeed}
                  onChange={(e) => setSettings({...settings, aiSpeed: e.target.value as 'slow' | 'normal' | 'fast' | 'instant'})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="slow">여유롭게 (2초)</option>
                  <option value="normal">보통 (1.5초)</option>
                  <option value="fast">빠르게 (0.5초)</option>
                  <option value="instant">즉시 (0초)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Faction Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">세력을 선택하세요</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {factions.map((faction) => {
              const Icon = faction.icon;
              const isSelected = selectedFaction === faction.id;
              
              return (
                <div
                  key={faction.id}
                  onClick={() => setSelectedFaction(faction.id)}
                  className={`
                    relative bg-gradient-to-br ${faction.bgGradient} rounded-xl shadow-2xl border-2 cursor-pointer
                    transition-all duration-300 transform hover:scale-105
                    ${isSelected ? `border-${faction.color}-400 ring-4 ring-${faction.color}-400/30` : 'border-slate-600 hover:border-slate-500'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className={`h-8 w-8 text-${faction.color}-200`} />
                      <h3 className={`text-xl font-bold text-${faction.color}-100`}>
                        {faction.name}
                      </h3>
                    </div>
                    
                    <p className={`text-${faction.color}-200 mb-4 leading-relaxed`}>
                      {faction.description}
                    </p>
                    
                    <div className={`bg-${faction.color}-700/30 p-3 rounded-lg mb-3`}>
                      <div className={`text-${faction.color}-200 text-sm font-semibold mb-1`}>
                        승리 조건
                      </div>
                      <div className={`text-${faction.color}-100 text-sm`}>
                        {faction.victory}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className={`text-${faction.color}-200 text-sm`}>
                        난이도: {faction.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={!selectedFaction}
            className={`
              px-12 py-4 rounded-xl text-white font-bold text-xl transition-all duration-200 shadow-lg
              ${selectedFaction 
                ? 'bg-green-600 hover:bg-green-700 transform hover:scale-105' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            {selectedFaction ? '🚀 게임 시작!' : '세력을 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
};
