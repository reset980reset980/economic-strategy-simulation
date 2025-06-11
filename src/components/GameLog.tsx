import React, { useEffect, useRef } from 'react';
import { ScrollText } from 'lucide-react';

interface GameLogProps {
  log: string[];
}

export const GameLog: React.FC<GameLogProps> = ({ log }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ScrollText className="h-6 w-6 text-slate-400" />
          <h3 className="text-xl font-bold text-white">게임 로그</h3>
        </div>
        
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 max-h-48 overflow-y-auto">
          {log.length === 0 ? (
            <div className="text-slate-500 text-center py-4">게임 로그가 없습니다.</div>
          ) : (
            <div className="space-y-2">
              {log.map((entry, index) => (
                <div
                  key={index}
                  className={`
                    text-sm p-2 rounded border-l-4 transition-all duration-200
                    ${entry.includes('[가계]') 
                      ? 'bg-amber-900/20 border-amber-500 text-amber-200' 
                      : entry.includes('[기업]')
                      ? 'bg-blue-900/20 border-blue-500 text-blue-200'
                      : entry.includes('[정부]')
                      ? 'bg-red-900/20 border-red-500 text-red-200'
                      : entry.includes('[이벤트]')
                      ? 'bg-purple-900/20 border-purple-500 text-purple-200'
                      : 'bg-slate-800/50 border-slate-600 text-slate-300'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex-1">{entry}</span>
                    <span className="text-xs opacity-60 ml-2">#{index + 1}</span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};