import React from 'react';
import { Users, Building2, Landmark, Star, Target, TrendingUp } from 'lucide-react';
import { PlayerType } from '../types/GameTypes';

interface FactionSelectorProps {
  onSelectFaction: (faction: PlayerType) => void;
}

export const FactionSelector: React.FC<FactionSelectorProps> = ({ onSelectFaction }) => {
  const factions = [
    {
      id: 'household' as PlayerType,
      name: '가계',
      description: '가족의 행복과 번영을 추구하는 평범한 시민',
      icon: Users,
      color: 'amber',
      strengths: ['높은 적응력', '소비 주도', '교육 투자'],
      weaknesses: ['제한된 자본', '외부 의존성'],
      winCondition: '자산 100,000원 + 행복도 90% 달성',
      failCondition: '파산 또는 행복도 10% 이하',
      bgGradient: 'from-amber-600 to-amber-800'
    },
    {
      id: 'business' as PlayerType,
      name: '기업',
      description: '혁신과 성장을 통해 시장을 지배하는 기업가',
      icon: Building2,
      color: 'blue',
      strengths: ['자본 축적', '기술 혁신', '고용 창출'],
      weaknesses: ['시장 변동성', '규제 리스크'],
      winCondition: '시장점유율 70% + 자본 500,000원 달성',
      failCondition: '파산 또는 시장점유율 5% 이하',
      bgGradient: 'from-blue-600 to-blue-800'
    },
    {
      id: 'government' as PlayerType,
      name: '정부',
      description: '국가의 안정과 발전을 책임지는 공공 기관',
      icon: Landmark,
      color: 'red',
      strengths: ['정책 수립', '자원 배분', '사회 안정'],
      weaknesses: ['정치적 압박', '예산 제약'],
      winCondition: '신뢰도 85% + 인프라 95% 달성',
      failCondition: '신뢰도 15% 이하 또는 예산 고갈',
      bgGradient: 'from-red-600 to-red-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            경제 전략 시뮬레이션
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            세력을 선택하고 경제 패권을 장악하세요
          </p>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">게임 목표</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              30턴 내에 승리 조건을 달성하거나, 다른 세력보다 우위를 점하세요. 
              AI가 나머지 두 세력을 운영하며 치열한 경쟁을 펼칩니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {factions.map((faction) => {
            const IconComponent = faction.icon;
            return (
              <div
                key={faction.id}
                className={`
                  relative bg-gradient-to-br ${faction.bgGradient} rounded-2xl shadow-2xl 
                  border border-slate-600 overflow-hidden cursor-pointer transform transition-all 
                  duration-300 hover:scale-105 hover:shadow-3xl group
                `}
                onClick={() => onSelectFaction(faction.id)}
              >
                {/* 배경 패턴 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>

                <div className="relative p-8">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{faction.name}</h3>
                        <p className="text-white/80 text-sm">{faction.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* 강점 */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold text-white">강점</h4>
                    </div>
                    <div className="space-y-1">
                      {faction.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-white/90 text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 약점 */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-orange-400" />
                      <h4 className="font-semibold text-white">도전 과제</h4>
                    </div>
                    <div className="space-y-1">
                      {faction.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span className="text-white/90 text-sm">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 승리/패배 조건 */}
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-green-400 text-sm">승리 조건</span>
                      </div>
                      <p className="text-white text-sm">{faction.winCondition}</p>
                    </div>
                    
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-4 w-4 text-red-400" />
                        <span className="font-semibold text-red-400 text-sm">패배 조건</span>
                      </div>
                      <p className="text-white text-sm">{faction.failCondition}</p>
                    </div>
                  </div>

                  {/* 호버 효과 */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  {/* 선택 버튼 */}
                  <div className="mt-6 text-center">
                    <div className="bg-white/20 hover:bg-white/30 transition-colors duration-200 rounded-lg py-3 px-6">
                      <span className="text-white font-semibold">이 세력 선택</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">게임 특징</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>AI가 나머지 세력 자동 운영</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>30턴 제한 시간</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>랜덤 이벤트 및 위기 상황</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};