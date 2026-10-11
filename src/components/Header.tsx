import React from 'react';
import { ShieldAlert, Download, Upload, Sparkles, BookOpen } from 'lucide-react';
import { SpdSaveFile } from '../types';

interface HeaderProps {
  saveData: SpdSaveFile | null;
  onDownload: () => void;
  onUploadClick: () => void;
  isZh: boolean;
  setIsZh: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  saveData,
  onDownload,
  onUploadClick,
  isZh,
  setIsZh,
}) => {
  return (
    <header className="border-b border-dungeon-border bg-dungeon-panel sticky top-0 z-40 backdrop-blur bg-opacity-95 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-xl shadow-inner">
            🗡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                {isZh ? '破碎的像素地牢 存档修改器' : 'Shattered Pixel Dungeon Save Editor'}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-medium">
                v4.0.2 / 922+
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isZh ? '安全防坏档 • 全中文图鉴 • 双向热更新 • 纯客户端运行' : 'Zero Corruptions • Full Catalog • In-Browser Safe • Open Source'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language toggle */}
          <button
            onClick={() => setIsZh(!isZh)}
            className="px-2.5 py-1.5 text-xs rounded-md bg-dungeon-card hover:bg-slate-700 border border-dungeon-border text-slate-300 font-medium transition"
            title="切换语言 / Switch Language"
          >
            {isZh ? '🌐 English' : '🌐 简体中文'}
          </button>

          {/* Upload button */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-dungeon-border transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            {isZh ? '选择/导入存档' : 'Load Save'}
          </button>

          {/* Download button */}
          {saveData && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              {isZh ? '导出并下载 game.dat' : 'Download game.dat'}
            </button>
          )}

          {/* GitHub Repo */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-dungeon-card transition"
            title="GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
