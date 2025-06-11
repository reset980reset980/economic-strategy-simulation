import React, { useState } from 'react';
import { ACHIEVEMENTS, getAchievementProgress, getAchievementStats, Achievement } from '../utils/achievements';
import { Trophy, Star, Zap, Crown, Lock, Filter } from 'lucide-react';

interface AchievementListProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementList: React.FC<AchievementListProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  
  const progress = getAchievementProgress();
  const stats = getAchievementStats();
  const unlockedIds = progress.map(p => p.achievementId);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      case 'epic': return 'border-purple-500 bg-purple-500/10';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-4 w-4" />;
      case 'rare': return <Zap className="h-4 w-4" />;
      case 'epic': return <Trophy className="h-4 w-4" />;
      case 'legendary': return <Crown className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    const isUnlocked = unlockedIds.includes(achievement.id);
    
    // 숨겨진 성취는 달성하지 않으면 표시하지 않음
    if (achievement.hidden && !isUnlocked) return false;
    
    // 카테고리 필터
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    
    // 희귀도 필터
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false;
    
    return true;
  });

  const categories = ['all', 'victory', 'economic', 'survival', 'special'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full m-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-200" />
              <div>
                <h2 className="text-2xl font-bold text-white">성취 목록</h2>
                <p className="text-yellow-200">
                  {stats.totalUnlocked}/{ACHIEVEMENTS.length} 달성 • {stats.totalPoints} 포인트
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-yellow-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div className="p-4 bg-slate-700 border-b border-slate-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-600 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalUnlocked}</div>
              <div className="text-sm text-slate-300">달성한 성취</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.totalPoints}</div>
              <div className="text-sm text-slate-300">총 포인트</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.byRarity.legendary || 0}</div>
              <div className="text-sm text-slate-300">전설 성취</div>
            </div>
            <div className="bg-slate-600 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round((stats.totalUnlocked / ACHIEVEMENTS.length) * 100)}%
              </div>
              <div className="text-sm text-slate-300">완료율</div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="p-4 bg-slate-700 border-b border-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-300" />
              <span className="text-sm text-slate-300">필터:</span>
            </div>
            
            {/* 카테고리 필터 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-600 border border-slate-500 rounded px-3 py-1 text-white text-sm"
            >
              <option value="all">모든 카테고리</option>
              <option value="victory">승리</option>
              <option value="economic">경제</option>
              <option value="survival">생존</option>
              <option value="special">특별</option>
            </select>

            {/* 희귀도 필터 */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-slate-600 border border-slate-500 rounded px-3 py-1 text-white text-sm"
            >
              <option value="all">모든 희귀도</option>
              <option value="common">일반</option>
              <option value="rare">희귀</option>
              <option value="epic">영웅</option>
              <option value="legendary">전설</option>
            </select>
          </div>
        </div>

        {/* 성취 목록 */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAchievements.map((achievement) => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              const achievementProgress = progress.find(p => p.achievementId === achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`
                    relative rounded-lg border-2 p-4 transition-all duration-200
                    ${isUnlocked 
                      ? `${getRarityColor(achievement.rarity)} border-opacity-100` 
                      : 'border-slate-600 bg-slate-700/50 opacity-60'
                    }
                  `}
                >
                  {/* 잠금 표시 */}
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                  )}

                  {/* 성취 정보 */}
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{isUnlocked ? achievement.icon : '❓'}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                          {achievement.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {getRarityIcon(achievement.rarity)}
                          <span className="text-xs text-slate-400 capitalize">
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isUnlocked ? 'text-green-400' : 'text-slate-500'}`}>
                          {achievement.points} 포인트
                        </span>
                        
                        {isUnlocked && achievementProgress && (
                          <span className="text-xs text-slate-400">
                            {achievementProgress.unlockedAt}턴에 달성
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              해당 조건에 맞는 성취가 없습니다.
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-4 bg-slate-700 border-t border-slate-600">
          <div className="text-center text-sm text-slate-400">
            더 많은 성취를 달성하여 포인트를 모아보세요! 🏆
          </div>
        </div>
      </div>
    </div>
  );
};
