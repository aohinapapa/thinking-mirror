'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type DiaryEntry = {
  id: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('diaries')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setEntries(data ?? []);
  }, []);

  useEffect(() => {
    fetchEntries().finally(() => setLoading(false));
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('diaries')
      .insert({ content: text.trim() });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setText('');
    await fetchEntries();
    setSubmitting(false);
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
              disabled={submitting}
              className="w-full min-h-[140px] resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 text-base leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-[box-shadow,border-color] disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 text-white font-semibold text-sm py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? '保存中...' : '保存する'}
            </button>
          </form>
        </section>

        {/* 保存した一覧 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-slate-600">保存した一覧</h2>
          {loading ? (
            <p className="text-slate-500 text-sm">読み込み中...</p>
          ) : entries.length === 0 ? (
            <p className="text-slate-500 text-sm">まだ日記はありません。</p>
          ) : (
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
                    dateTime={entry.created_at}
                    className="text-xs text-slate-500 mt-auto"
                  >
                    {new Date(entry.created_at).toLocaleString('ja-JP')}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
