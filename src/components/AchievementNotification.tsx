import React, { useState, useEffect } from 'react';
import { Achievement } from '../utils/achievements';
import { X, Trophy, Star, Zap, Crown } from 'lucide-react';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievements, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // 여러 성취가 있을 때 순차적으로 표시
  useEffect(() => {
    if (achievements.length === 0) return;

    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 모든 성취를 보여준 후 자동으로 닫기
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, 2000);
      }
    }, 3000); // 각 성취를 3초간 표시

    return () => clearTimeout(timer);
  }, [currentIndex, achievements.length, onClose]);

  if (!isVisible || achievements.length === 0) return null;

  const currentAchievement = achievements[currentIndex];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-700';
      case 'rare': return 'from-blue-600 to-blue-700';
      case 'epic': return 'from-purple-600 to-purple-700';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-600 to-gray-700';
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

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`bg-gradient-to-r ${getRarityColor(currentAchievement.rarity)} p-1 rounded-lg shadow-2xl max-w-sm`}>
        <div className="bg-slate-800 rounded-lg p-4 relative">
          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* 헤더 */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-2xl">{currentAchievement.icon}</div>
            <div className="flex items-center space-x-1 text-sm">
              {getRarityIcon(currentAchievement.rarity)}
              <span className="text-slate-300 capitalize">{currentAchievement.rarity}</span>
            </div>
          </div>

          {/* 성취 정보 */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-1">
              🏆 성취 달성!
            </h3>
            <h4 className="text-md font-semibold text-yellow-300 mb-1">
              {currentAchievement.name}
            </h4>
            <p className="text-sm text-slate-300">
              {currentAchievement.description}
            </p>
          </div>

          {/* 포인트 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-green-400">
              <span>+{currentAchievement.points} 포인트</span>
            </div>
            
            {/* 진행 표시 */}
            {achievements.length > 1 && (
              <div className="text-xs text-slate-400">
                {currentIndex + 1} / {achievements.length}
              </div>
            )}
          </div>

          {/* 애니메이션 효과 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
