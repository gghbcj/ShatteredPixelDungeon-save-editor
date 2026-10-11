import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, Copy, Check, Folder } from 'lucide-react';
import { SpdSaveFile } from '../types';
import { parseSaveFile } from '../utils/saveFile';

interface SaveFileManagerProps {
  saveData: SpdSaveFile | null;
  fileName: string;
  onSaveLoaded: (data: SpdSaveFile, fileName: string) => void;
  isZh: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const SaveFileManager: React.FC<SaveFileManagerProps> = ({
  saveData,
  fileName,
  onSaveLoaded,
  isZh,
  fileInputRef
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = parseSaveFile(reader.result as ArrayBuffer);
        onSaveLoaded(result.data, file.name);
      } catch (err: any) {
        setErrorMessage(err.message || '读取存档失败');
      }
    };
    reader.onerror = () => {
      setErrorMessage(isZh ? '读取文件出错' : 'Error reading file.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const savePaths = [
    {
      os: 'Windows',
      path: '%APPDATA%\\.shatteredpixel\\Shattered Pixel Dungeon\\game1\\game.dat'
    },
    {
      os: 'Android',
      path: '/data/data/com.shatteredpixel.shatteredpixeldungeon/files/game1/game.dat'
    },
    {
      os: 'macOS',
      path: '~/Library/Application Support/Shattered Pixel Dungeon/game1/game.dat'
    },
    {
      os: 'Linux',
      path: '~/.local/share/.shatteredpixel/shattered-pixel-dungeon/game1/game.dat'
    }
  ];

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        accept=".dat,.json"
        className="hidden"
      />

      {/* If file is not yet loaded, show prominent drop zone */}
      {!saveData ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-400 bg-indigo-950/20 scale-[1.01]'
              : 'border-dungeon-border hover:border-slate-500 bg-dungeon-panel/60 hover:bg-dungeon-panel'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-800/60 shadow-lg">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {isZh ? '拖拽游戏存档 (game.dat) 到此处' : 'Drop your game.dat save file here'}
          </h3>
          <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">
            {isZh ? '或点击选择本地文件。所有解析与修改均在浏览器本地完成，绝不上传任何服务器。' : 'Or click to browse. Processing is done 100% locally in your browser.'}
          </p>

          <span className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition">
            {isZh ? '浏览选择存档文件...' : 'Browse file...'}
          </span>

          {errorMessage && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/60 max-w-lg mx-auto">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Path Reference Accordion */}
          <div className="mt-8 pt-6 border-t border-dungeon-border/60 text-left max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              {isZh ? '常见系统存档路径参考 (点击复制)' : 'Save File Path Quick Reference (Click to copy)'}
            </span>
            <div className="space-y-1.5">
              {savePaths.map((sp) => (
                <div
                  key={sp.os}
                  onClick={() => copyPath(sp.path)}
                  className="flex items-center justify-between text-xs bg-dungeon-card/70 hover:bg-dungeon-card p-2 rounded border border-dungeon-border cursor-pointer transition group"
                >
                  <span className="font-semibold text-slate-300 w-20 shrink-0">{sp.os}</span>
                  <code className="text-[11px] text-slate-400 font-mono truncate flex-1 group-hover:text-amber-300 transition">
                    {sp.path}
                  </code>
                  <div className="shrink-0 ml-2 text-slate-400 group-hover:text-white">
                    {copiedPath === sp.path ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Status bar when loaded */
        <div className="bg-dungeon-panel border border-emerald-900/60 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">{fileName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {isZh ? '已就绪' : 'Loaded'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Version: {saveData.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isZh
                  ? `第 ${saveData.depth || 1} 层 • 职业: ${saveData.hero.class} • 生命: ${saveData.hero.HP}/${saveData.hero.HT} • 金币: ${saveData.gold}`
                  : `Floor ${saveData.depth || 1} • Class: ${saveData.hero.class} • HP: ${saveData.hero.HP}/${saveData.hero.HT} • Gold: ${saveData.gold}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs bg-dungeon-card hover:bg-slate-700 text-slate-300 border border-dungeon-border rounded-lg font-medium transition"
            >
              {isZh ? '更换其他存档' : 'Switch Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
