import React, { useState, useEffect } from 'react';
import { Code, Check, AlertCircle, Copy, RefreshCw } from 'lucide-react';
import { SpdSaveFile } from '../types';

interface RawJsonEditorProps {
  saveData: SpdSaveFile;
  onChange: (newData: SpdSaveFile) => void;
  isZh: boolean;
}

export const RawJsonEditor: React.FC<RawJsonEditorProps> = ({ saveData, onChange, isZh }) => {
  const [jsonText, setJsonText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  useEffect(() => {
    setJsonText(JSON.stringify(saveData, null, 2));
    setError(null);
  }, [saveData]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.hero) {
        throw new Error(isZh ? 'JSON 缺少 hero 节点，无法应用。' : 'Missing hero property.');
      }
      onChange(parsed);
      setError(null);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setJsonText(JSON.stringify(saveData, null, 2));
    setError(null);
  };

  return (
    <div className="bg-dungeon-panel border border-dungeon-border rounded-xl p-5 shadow-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-dungeon-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            {isZh ? '原始 JSON 高级编辑器 (Raw JSON)' : 'Raw JSON Advanced Editor'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-dungeon-card hover:bg-slate-700 text-slate-300 border border-dungeon-border rounded-md transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制' : 'Copy')}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-dungeon-card hover:bg-slate-700 text-slate-300 border border-dungeon-border rounded-md transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isZh ? '重置' : 'Reset'}</span>
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow transition active:scale-95"
          >
            {isApplied ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{isApplied ? (isZh ? '已生效' : 'Applied!') : (isZh ? '应用修改' : 'Apply')}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-800 rounded-lg text-red-200 text-xs mb-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{isZh ? `JSON 语法错误: ${error}` : `JSON syntax error: ${error}`}</span>
        </div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="w-full h-96 bg-dungeon-dark border border-dungeon-border rounded-lg p-3 text-xs font-mono text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};
