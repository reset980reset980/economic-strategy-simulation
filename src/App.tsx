import React, { useState, useEffect } from 'react';
import { GameState, PlayerType } from './types/GameTypes';
import { initializeGameWithPlayer, initializeGameWithSettings, nextTurn } from './utils/gameLogic';
import { Action } from './utils/actions';
import { AIPlayer, createAIPlayers } from './utils/aiLogic';
import { GameBoard } from './components/GameBoard';
import { ActionPanel } from './components/ActionPanel';
import { GameLog } from './components/GameLog';
import { GameSetup } from './components/GameSetup';
import { AchievementNotification } from './components/AchievementNotification';
import { AchievementList } from './components/AchievementList';
import { saveGame, loadGame, hasSavedGame, deleteSavedGame } from './utils/saveGame';
import { GameSettings, loadSettings, AI_SPEED_VALUES, DIFFICULTY_MULTIPLIERS, STARTING_RESOURCES_MULTIPLIERS } from './utils/gameSettings';
import { checkAchievements, Achievement } from './utils/achievements';
import { playSound, playVictoryMelody, playDefeatMelody, playAchievementMelody, getSoundSettings, updateSoundSettings, playBGM, stopBGM } from './utils/sounds';
import { Save, Download, Trophy, Volume2, VolumeX, Music, HelpCircle, X } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({ 
    ...initializeGameWithPlayer('household'), 
    gamePhase: 'setup' 
  });
  const [aiPlayers, setAiPlayers] = useState<AIPlayer[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>(loadSettings());
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showAchievementList, setShowAchievementList] = useState(false);
  const [showGameGuide, setShowGameGuide] = useState(false);
  const [soundSettings, setSoundSettings] = useState(getSoundSettings());

  const handleStartGame = (faction: PlayerType, settings: GameSettings) => {
    console.log('🎯 새 게임 시작:', { faction, settings });
    
    playSound('click');
    setGameSettings(settings);
    
    // 기존 상태 초기화
    setAiPlayers([]);
    setNewAchievements([]);
    
    // 설정이 적용된 게임 상태 생성
    const newGameState = initializeGameWithSettings(faction, settings);
    console.log('🎮 게임 상태 초기화 완료:', {
      playerFaction: newGameState.playerFaction,
      currentPlayer: newGameState.currentPlayer,
      gamePhase: newGameState.gamePhase
    });
    
    // AI 플레이어들 생성
    const newAiPlayers = createAIPlayers(faction);
    console.log('🤖 AI 플레이어 생성 완료:', {
      aiCount: newAiPlayers.length,
      aiFactions: newAiPlayers.map(ai => ai.faction)
    });
    
    // 게임 BGM 시작
    playBGM('game');
    
    // 동시 업데이트로 타이밍 이슈 방지
    setTimeout(() => {
      setGameState(newGameState);
      setAiPlayers(newAiPlayers);
    }, 100);
  };

  const handleContinueGame = () => {
    const savedState = loadGame();
    if (savedState) {
      console.log('📂 저장된 게임 불러오기');
      playSound('click');
      setGameState(savedState);
      setNewAchievements([]);
      
      // 게임 BGM 시작
      playBGM('game');
      
      // AI 플레이어들 재생성
      if (savedState.playerFaction) {
        const newAiPlayers = createAIPlayers(savedState.playerFaction);
        setAiPlayers(newAiPlayers);
      }
    }
  };

  const handleSaveGame = () => {
    const success = saveGame(gameState);
    if (success) {
      playSound('success');
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } else {
      playSound('error');
    }
  };

  const handleActionExecute = (action: Action) => {
    if (gameState.winner || gameState.gamePhase !== 'playing') {
      console.log('🚫 게임이 종료되었거나 진행 중이 아님');
      return;
    }
    
    console.log('⚡ 플레이어 행동 실행:', action.name);
    
    // 행동 타입에 따른 사운드 재생
    if (action.id.includes('invest') || action.id.includes('money')) {
      playSound('money');
    } else {
      playSound('click');
    }
    
    const newState = action.execute(gameState);
    console.log('📊 행동 실행 후 상태:', {
      currentPlayer: newState.currentPlayer,
      actionsUsed: newState.currentPlayer === 'household' ? newState.household.actionsUsed :
                   newState.currentPlayer === 'business' ? newState.business.actionsUsed :
                   newState.government.actionsUsed
    });
    
    // 성취 체크
    const achievements = checkAchievements(newState);
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      playAchievementMelody();
    }
    
    setGameState(newState);
  };

  const handleNextTurn = () => {
    if (gameState.winner || gameState.gamePhase !== 'playing') {
      console.log('🚫 게임이 종료되었거나 진행 중이 아님');
      return;
    }
    
    console.log('⏭️ 플레이어가 턴 종료 요청');
    playSound('click');
    
    const newState = nextTurn(gameState);
    console.log('🔄 턴 종료 후 상태:', {
      currentPlayer: newState.currentPlayer,
      turn: newState.turn
    });
    
    // 성취 체크
    const achievements = checkAchievements(newState);
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      playAchievementMelody();
    }
    
    setGameState(newState);
  };

  const handleResetGame = () => {
    console.log('🔄 게임 리셋');
    playSound('click');
    stopBGM(); // BGM 정지
    setGameState({ 
      ...initializeGameWithPlayer('household'), 
      gamePhase: 'setup' 
    });
    setAiPlayers([]);
    setGameSettings(loadSettings());
    setNewAchievements([]);
    
    // 메뉴 BGM 시작
    setTimeout(() => playBGM('menu'), 500);
  };

  // 사운드 설정 토글
  const toggleSound = () => {
    const newSettings = { ...soundSettings, enabled: !soundSettings.enabled };
    setSoundSettings(newSettings);
    updateSoundSettings(newSettings);
    playSound('click');
  };

  // BGM 설정 토글
  const toggleBGM = () => {
    const newSettings = { ...soundSettings, bgmEnabled: !soundSettings.bgmEnabled };
    setSoundSettings(newSettings);
    updateSoundSettings(newSettings);
    playSound('click');
    
    // BGM이 비활성화되면 정지, 활성화되면 상황에 맞는 BGM 재생
    if (!newSettings.bgmEnabled) {
      stopBGM();
    } else {
      if (gameState.gamePhase === 'setup') {
        playBGM('menu');
      } else if (gameState.winner) {
        if (gameState.winner.includes('승리')) {
          playBGM('victory');
        } else {
          playBGM('defeat');
        }
      } else {
        playBGM('game');
      }
    }
  };

  // AI 턴 처리
  useEffect(() => {
    if (gameState.gamePhase !== 'playing' || gameState.winner) {
      console.log('🚫 게임이 진행 중이 아니거나 승부가 결정됨');
      return;
    }

    // AI 플레이어가 생성되지 않았으면 대기
    if (aiPlayers.length === 0) {
      console.log('⏳ AI 플레이어 생성 대기 중...');
      return;
    }

    const currentFactionData = gameState.currentPlayer === 'household' ? gameState.household :
                              gameState.currentPlayer === 'business' ? gameState.business :
                              gameState.government;

    console.log('🔍 현재 턴 상태 체크:', {
      currentPlayer: gameState.currentPlayer,
      isPlayer: currentFactionData.isPlayer,
      actionsUsed: currentFactionData.actionsUsed,
      maxActions: currentFactionData.maxActions,
      aiPlayersCount: aiPlayers.length,
      playerFaction: gameState.playerFaction
    });

    // 현재 플레이어가 사람이면 AI 처리 안함
    if (currentFactionData.isPlayer) {
      console.log('👤 현재 턴은 플레이어 턴 - AI 처리 안함');
      return;
    }

    // 현재 플레이어가 선택된 플레이어 세력과 같으면 AI 처리 안함 (이중 체크)
    if (gameState.currentPlayer === gameState.playerFaction) {
      console.log('👤 현재 턴은 플레이어 세력 턴 - AI 처리 안함');
      return;
    }

    // 설정된 AI 속도 가져오기 (게임 상태에서 우선, 없으면 현재 설정에서)
    const aiSpeed = gameState.settings?.aiSpeed || gameSettings.aiSpeed;
    const aiDelay = AI_SPEED_VALUES[aiSpeed];

    // 현재 플레이어가 AI이고 아직 행동을 할 수 있는 경우
    if (currentFactionData.actionsUsed < currentFactionData.maxActions) {
      const currentAI = aiPlayers.find(ai => ai.faction === gameState.currentPlayer);
      
      console.log('🤖 AI 턴 처리:', {
        searchingFor: gameState.currentPlayer,
        foundAI: !!currentAI,
        availableAIs: aiPlayers.map(ai => ai.faction),
        aiDelay: aiDelay
      });
      
      if (currentAI) {
        const timer = setTimeout(() => {
          console.log('🎲 AI 결정 중...');
          const aiAction = currentAI.makeDecision(gameState);
          if (aiAction) {
            console.log('✅ AI 행동 실행:', aiAction.name);
            const newState = aiAction.execute(gameState);
            setGameState(newState);
          } else {
            console.log('❌ AI가 더 이상 행동할 수 없음, 턴 종료');
            const newState = nextTurn(gameState);
            setGameState(newState);
          }
        }, aiDelay);

        return () => clearTimeout(timer);
      } else {
        console.log('⚠️ AI를 찾을 수 없음, 턴 강제 종료');
        const timer = setTimeout(() => {
          const newState = nextTurn(gameState);
          setGameState(newState);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    
    // AI가 모든 행동을 완료했으면 자동으로 턴 종료
    if (currentFactionData.actionsUsed >= currentFactionData.maxActions) {
      console.log('✅ AI 모든 행동 완료, 턴 종료');
      const timer = setTimeout(() => {
        const newState = nextTurn(gameState);
        setGameState(newState);
      }, Math.max(1000, aiDelay));

      return () => clearTimeout(timer);
    }
  }, [gameState, aiPlayers, gameSettings.aiSpeed]);

  // 승리/패배 시 음향 효과
  useEffect(() => {
    if (gameState.winner) {
      const achievements = checkAchievements(gameState);
      if (achievements.length > 0) {
        setNewAchievements(achievements);
      }
      
      if (gameState.winner.includes('승리')) {
        playVictoryMelody();
        // 승리 BGM으로 전환
        setTimeout(() => playBGM('victory'), 1000);
      } else if (gameState.winner.includes('패배')) {
        playDefeatMelody();
        // 패배 BGM으로 전환
        setTimeout(() => playBGM('defeat'), 1000);
      }
    }
  }, [gameState.winner]);

  // 메뉴 BGM 시작 (한 번만 실행되도록)
  useEffect(() => {
    if (gameState.gamePhase === 'setup' && soundSettings.bgmEnabled) {
      const timer = setTimeout(() => playBGM('menu'), 100);
      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase, soundSettings.bgmEnabled]);

  if (gameState.gamePhase === 'setup') {
    return (
      <GameSetup 
        onStartGame={handleStartGame}
        onContinueGame={hasSavedGame() ? handleContinueGame : undefined}
        hasSavedGame={hasSavedGame()}
      />
    );
  }

  const currentFactionData = gameState.currentPlayer === 'household' ? gameState.household :
                            gameState.currentPlayer === 'business' ? gameState.business :
                            gameState.government;

  const isPlayerTurn = currentFactionData.isPlayer;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Save Success Notification */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Save className="h-5 w-5" />
          <span>게임이 저장되었습니다!</span>
        </div>
      )}

      {/* Game Board with Save Button */}
      <div className="relative">
        <GameBoard gameState={gameState} />
        
        {/* Top Right Buttons */}
        <div className="fixed top-4 right-4 flex space-x-2 z-40">
          {/* Game Guide Button */}
          <button
            onClick={() => setShowGameGuide(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
            title="게임 설명서 📖"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
            title={soundSettings.enabled ? '🔊 효과음 끄기' : '🔇 효과음 켜기'}
          >
            {soundSettings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          
          {/* BGM Toggle */}
          <button
            onClick={toggleBGM}
            className={`p-2 rounded-lg shadow-lg transition-colors duration-200 ${
              soundSettings.bgmEnabled 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
            }`}
            title={soundSettings.bgmEnabled ? '🎵 배경음악 끄기' : '🎵 배경음악 켜기'}
          >
            <Music className="h-4 w-4" />
          </button>
          
          {/* Achievement Button */}
          <button
            onClick={() => setShowAchievementList(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
            title="🏆 성취 및 랭킹"
          >
            <Trophy className="h-4 w-4" />
          </button>
          
          {/* Save Button */}
          {gameState.gamePhase === 'playing' && !gameState.winner && (
            <button
              onClick={handleSaveGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-colors duration-200"
              title="💾 게임 진행상황 저장"
            >
              <Save className="h-4 w-4" />
              <span>저장</span>
            </button>
          )}
          
          {/* Reset Button */}
          {gameState.gamePhase === 'playing' && (
            <button
              onClick={handleResetGame}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-colors duration-200"
              title="🔄 첫 화면으로 돌아가기"
            >
              <Download className="h-4 w-4" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>
      
      {isPlayerTurn && !gameState.winner && (
        <ActionPanel 
          gameState={gameState}
          onActionExecute={handleActionExecute}
          onNextTurn={handleNextTurn}
        />
      )}
      
      {!isPlayerTurn && !gameState.winner && gameState.gamePhase === 'playing' && (
        <div className="bg-slate-800 border-t border-slate-700 p-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-slate-700 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-white mb-2">AI 턴 진행 중...</h3>
              <p className="text-slate-300 mb-4">
                {gameState.currentPlayer === 'household' ? '가계' :
                 gameState.currentPlayer === 'business' ? '기업' : '정부'} AI가 행동을 결정하고 있습니다.
              </p>
              <div className="animate-pulse bg-blue-600 h-2 rounded-full mb-4"></div>
              
              <div className="text-sm text-slate-400">
                AI 속도: {(gameState.settings?.aiSpeed || gameSettings.aiSpeed) === 'slow' ? '여유롭게' :
                         (gameState.settings?.aiSpeed || gameSettings.aiSpeed) === 'normal' ? '보통' :
                         (gameState.settings?.aiSpeed || gameSettings.aiSpeed) === 'fast' ? '빠르게' : '즉시'}
              </div>
              
              {/* 디버그 정보 */}
              <div className="mt-4 text-xs text-slate-400 space-y-1">
                <div>현재 플레이어: {gameState.currentPlayer}</div>
                <div>AI 개수: {aiPlayers.length}</div>
                <div>행동: {currentFactionData.actionsUsed}/{currentFactionData.maxActions}</div>
                <div>플레이어 세력: {gameState.playerFaction}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {gameState.winner && (
        <div className="bg-slate-800 border-t border-slate-700 p-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-slate-700 rounded-lg p-8 max-w-md mx-auto mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">{gameState.winner}</h3>
              <p className="text-slate-300 mb-4">
                {(gameState.settings?.gameLength || 30)}턴이 완료되었거나 승리 조건을 달성했습니다!
              </p>
              
              {/* 게임 통계 */}
              <div className="bg-slate-600 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-2">게임 통계</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>플레이한 턴: {gameState.turn}</div>
                  <div>설정 난이도: {gameState.settings?.difficulty || 'normal'}</div>
                  <div>AI 속도: {gameState.settings?.aiSpeed || 'normal'}</div>
                  <div>시작 자원: {((gameState.settings?.startingResources || 1.0) * 100)}%</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleResetGame}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-white font-bold text-lg transition-colors duration-200 shadow-lg"
              >
                새 게임 시작
              </button>
              
              <button
                onClick={() => deleteSavedGame()}
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-white font-bold text-lg transition-colors duration-200 shadow-lg"
              >
                저장 데이터 삭제
              </button>
            </div>
          </div>
        </div>
      )}
      
      <GameLog log={gameState.gameLog} />
      
      {/* Achievement Notification */}
      {newAchievements.length > 0 && (
        <AchievementNotification
          achievements={newAchievements}
          onClose={() => setNewAchievements([])}
        />
      )}
      
      {/* Achievement List Modal */}
      <AchievementList
        isOpen={showAchievementList}
        onClose={() => setShowAchievementList(false)}
      />
      
      {/* Game Guide Modal */}
      {showGameGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="h-6 w-6 text-purple-400" />
                  <span>게임 설명서</span>
                </h2>
                <button
                  onClick={() => setShowGameGuide(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6 text-gray-300">
                {/* 게임 개요 */}
                <section>
                  <h3 className="text-xl font-bold text-amber-400 mb-3">🎯 게임 개요</h3>
                  <p className="leading-relaxed">
                    경제 전략 시뮬레이션은 <strong>가계, 기업, 정부</strong> 중 하나의 세력을 선택하여 
                    AI와 경쟁하며 경제적 패권을 장악하는 턴제 전략 게임입니다. 
                    30턴 내에 승리 조건을 달성하거나 최고 점수를 획득해야 합니다.
                  </p>
                </section>
                
                {/* 세력별 특징 */}
                <section>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">🏠🏢🏛️ 세력별 특징</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-600/30">
                      <h4 className="font-bold text-amber-400 mb-2">🏠 가계 (김씨 가문)</h4>
                      <p className="text-sm mb-2"><strong>승리 조건:</strong> 총 자산 100,000원 + 행복도 90%</p>
                      <p className="text-sm"><strong>특징:</strong> 소비 주도, 교육 투자, 높은 적응력</p>
                    </div>
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-600/30">
                      <h4 className="font-bold text-blue-400 mb-2">🏢 기업 (혁신기업)</h4>
                      <p className="text-sm mb-2"><strong>승리 조건:</strong> 시장점유율 70% + 자본 500,000원</p>
                      <p className="text-sm"><strong>특징:</strong> 자본 축적, 기술 혁신, 고용 창출</p>
                    </div>
                    <div className="bg-red-900/30 p-4 rounded-lg border border-red-600/30">
                      <h4 className="font-bold text-red-400 mb-2">🏛️ 정부 (대한민국)</h4>
                      <p className="text-sm mb-2"><strong>승리 조건:</strong> 신뢰도 85% + 인프라 95%</p>
                      <p className="text-sm"><strong>특징:</strong> 정책 수립, 자원 배분, 사회 안정</p>
                    </div>
                  </div>
                </section>
                
                {/* 게임플레이 */}
                <section>
                  <h3 className="text-xl font-bold text-green-400 mb-3">🎮 게임플레이</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-1">턴 시스템</h4>
                      <p className="text-sm">가계 → 기업 → 정부 순으로 진행, 각 세력은 턴당 2-3회 행동 가능</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-1">상호작용</h4>
                      <p className="text-sm">• 가계 소비 → 기업 수익 증가<br/>• 기업 고용 → 가계 소득 증가<br/>• 정부 정책 → 모든 세력에 영향</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-1">레벨업 시스템</h4>
                      <p className="text-sm">행동 실행 시 경험치 획득 → 레벨업 → 새로운 행동 잠금해제</p>
                    </div>
                  </div>
                </section>
                
                {/* 경제 지표 */}
                <section>
                  <h3 className="text-xl font-bold text-purple-400 mb-3">📊 경제 지표</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400">GDP</h4>
                      <p className="text-sm">전체 경제 규모, 모든 세력의 활동에 따라 변동</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400">실업률</h4>
                      <p className="text-sm">기업의 고용과 가계 규모에 따라 결정</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400">인플레이션</h4>
                      <p className="text-sm">정부 예산과 시장 상황에 따라 변동</p>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-400">주식시장</h4>
                      <p className="text-sm">기업 성과와 경제 상황을 반영</p>
                    </div>
                  </div>
                </section>
                
                {/* 전략 팁 */}
                <section>
                  <h3 className="text-xl font-bold text-orange-400 mb-3">💡 전략 팁</h3>
                  <div className="space-y-2">
                    <div className="bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-400">
                      <h4 className="font-semibold text-orange-400">🏠 가계 전략</h4>
                      <p className="text-sm">기술 교육에 투자하여 수입을 늘리고, 적절한 소비로 행복도를 유지하세요.</p>
                    </div>
                    <div className="bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-semibold text-blue-400">🏢 기업 전략</h4>
                      <p className="text-sm">R&D 투자로 기술력을 높이고, 마케팅으로 시장점유율을 확대하세요.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400">
                      <h4 className="font-semibold text-red-400">🏛️ 정부 전략</h4>
                      <p className="text-sm">복지와 인프라에 균형있게 투자하여 신뢰도를 높이세요.</p>
                    </div>
                  </div>
                </section>
                
                {/* 조작법 */}
                <section>
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">🎮 조작법</h3>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>• <strong>행동 선택:</strong> 카드 클릭으로 행동 실행</div>
                      <div>• <strong>턴 종료:</strong> '턴 종료' 버튼 클릭</div>
                      <div>• <strong>저장:</strong> 💾 버튼으로 게임 저장</div>
                      <div>• <strong>초기화:</strong> 🔄 버튼으로 처음부터</div>
                      <div>• <strong>음향 설정:</strong> 🔊🎵 버튼으로 조절</div>
                      <div>• <strong>성취 확인:</strong> 🏆 버튼으로 랭킹 보기</div>
                    </div>
                  </div>
                </section>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowGameGuide(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  이해했습니다!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
