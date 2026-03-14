'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<{ id: number; content: string; createdAt: Date }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setEntries((prev) => [
      { id: Date.now(), content: text.trim(), createdAt: new Date() },
      ...prev,
    ]);
    setText('');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 sm:py-14 sm:px-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
        {/* ヘッダー */}
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Thinking Mirror
          </h1>
          <p className="text-slate-600 text-sm">思考の鏡</p>
        </header>

        {/* 入力フォームカード */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label htmlFor="diary" className="block text-sm font-medium text-slate-700">
              日記・メモ
            </label>
            <textarea
              id="diary"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="今日の出来事や考えたことを書いてみましょう..."
              rows={5}
              className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 text-base leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-[box-shadow,border-color]"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 text-white font-semibold text-sm py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200"
            >
              保存する
            </button>
          </form>
        </section>

        {/* 保存した一覧 */}
        {entries.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-slate-600">保存した一覧</h2>
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-3"
                >
                  <p className="text-slate-900 text-base leading-relaxed whitespace-pre-wrap m-0">
                    {entry.content}
                  </p>
                  <time
                    dateTime={entry.createdAt.toISOString()}
                    className="text-xs text-slate-500 mt-auto"
                  >
                    {entry.createdAt.toLocaleString('ja-JP')}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
