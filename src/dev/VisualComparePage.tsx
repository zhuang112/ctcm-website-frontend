import { useEffect, useMemo, useState } from 'react'

type CompareEntry = {
  id: string
  label: string
  postType: string
  legacyUrl?: string | null
  legacyHtmlPath?: string | null
  anycontentZhTwPath?: string | null
  anycontentZhCnPath?: string | null
  newSiteUrl?: string | null
  wordpressPostId?: string | number | null
  hasUnclassifiedContent?: boolean
  unclassifiedNotes?: string | null
}

type LoadedJson = Record<string, any> | null

function useFetchedText(path?: string | null) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) {
      setText(null)
      setError(null)
      return
    }
    let cancelled = false
    setText(null)
    setError(null)
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.text()
      })
      .then((t) => {
        if (!cancelled) setText(t)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [path])

  return { text, error }
}

function useFetchedJson(path?: string | null) {
  const { text, error } = useFetchedText(path)
  const parsed = useMemo<LoadedJson>(() => {
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }, [text])
  return { data: parsed, raw: text, error }
}

function JsonSummary({ data, title }: { data: LoadedJson; title: string }) {
  if (!data) {
    return <div className="text-sm text-gray-600">尚未載入 {title}</div>
  }

  const body = typeof data.body_markdown === 'string' ? data.body_markdown : ''
  const meta = data.meta || {}

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-500">post_type</div>
          <div className="font-medium">{data.post_type || '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">language</div>
          <div className="font-medium">{data.language || '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">post_title</div>
          <div className="font-medium break-words">{data.post_title || '—'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">old_url</div>
          <div className="break-words">{data.old_url || '—'}</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-1">meta</div>
        <div className="text-gray-800 leading-relaxed space-y-1">
          <div>ct_has_dharma_verse: {meta.ct_has_dharma_verse ?? '—'}</div>
          <div>ct_verse_type: {meta.ct_verse_type ?? '—'}</div>
          <div>ct_verse_lang: {meta.ct_verse_lang ?? '—'}</div>
          <div>has_unclassified_content: {meta.has_unclassified_content ?? '—'}</div>
          {meta.unclassified_notes ? <div>unclassified_notes: {meta.unclassified_notes}</div> : null}
        </div>
        {meta.ct_verse_block_markdown ? (
          <pre className="mt-2 bg-gray-50 border rounded p-2 whitespace-pre-wrap text-xs">
            {meta.ct_verse_block_markdown}
          </pre>
        ) : null}
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-1">body_markdown (snippet)</div>
        <pre className="bg-gray-50 border rounded p-2 whitespace-pre-wrap text-xs max-h-48 overflow-auto">
          {body ? body.split('\n').slice(0, 12).join('\n') : '—'}
        </pre>
      </div>

      <details className="text-xs">
        <summary className="cursor-pointer text-gray-600">展開完整 JSON</summary>
        <pre className="mt-2 bg-gray-50 border rounded p-2 whitespace-pre-wrap overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  )
}

function LegacyView({
  entry,
  htmlText,
  legacyView,
  setLegacyView,
}: {
  entry: CompareEntry
  htmlText: string | null
  legacyView: 'local' | 'url'
  setLegacyView: (view: 'local' | 'url') => void
}) {
  return (
    <div className="bg-white border rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="font-semibold text-sm">Legacy</div>
        <div className="flex gap-2 text-xs">
          {entry.legacyHtmlPath && (
            <button
              className={`px-2 py-1 rounded border ${legacyView === 'local' ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}
              onClick={() => setLegacyView('local')}
            >
              Local HTML
            </button>
          )}
          {entry.legacyUrl && (
            <button
              className={`px-2 py-1 rounded border ${legacyView === 'url' ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}
              onClick={() => setLegacyView('url')}
            >
              Legacy URL
            </button>
          )}
        </div>
      </div>

      <div className="p-3 text-sm flex-1 overflow-auto">
        {legacyView === 'local' && entry.legacyHtmlPath ? (
          htmlText ? (
            <iframe title="Legacy HTML preview" srcDoc={htmlText} className="w-full h-96 border rounded" />
          ) : (
            <div className="text-gray-600">尚未載入 local HTML</div>
          )
        ) : null}

        {legacyView === 'url' && entry.legacyUrl ? (
          <div className="space-y-2">
            <a className="text-blue-600 underline break-all" href={entry.legacyUrl} target="_blank" rel="noreferrer">
              {entry.legacyUrl}
            </a>
            <div className="text-xs text-gray-500">若站台有限制（X-Frame-Options），內嵌預覽可能被阻擋。</div>
            <iframe title="Legacy URL preview" src={entry.legacyUrl} className="w-full h-96 border rounded" />
          </div>
        ) : null}

        {!entry.legacyHtmlPath && !entry.legacyUrl ? (
          <div className="text-gray-600">尚未提供 legacy HTML / URL</div>
        ) : null}
      </div>
    </div>
  )
}

type RightTab = 'zh-tw' | 'zh-cn' | 'new-page' | 'wordpress'

function RightPane({
  entry,
  zhTw,
  zhCn,
  tab,
  setTab,
  unclassified,
}: {
  entry: CompareEntry
  zhTw: LoadedJson
  zhCn: LoadedJson
  tab: RightTab
  setTab: (t: RightTab) => void
  unclassified?: { hasUnclassifiedContent?: boolean; unclassifiedNotes?: string | null }
}) {
  return (
    <div className="bg-white border rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <div className="font-semibold text-sm">New / JSON / WP</div>
        <div className="flex gap-2 text-xs">
          {(['zh-tw', 'zh-cn', 'new-page', 'wordpress'] as RightTab[]).map((key) => (
            <button
              key={key}
              className={`px-2 py-1 rounded border ${tab === key ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}
              onClick={() => setTab(key)}
            >
              {key === 'zh-tw' && 'zh-TW JSON'}
              {key === 'zh-cn' && 'zh-CN JSON'}
              {key === 'new-page' && 'New page'}
              {key === 'wordpress' && 'WordPress'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 text-sm flex-1 overflow-auto space-y-3">
        {unclassified?.hasUnclassifiedContent ? (
          <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <div className="font-semibold mb-1">Unclassified content noted</div>
            <div className="text-xs text-amber-900">
              meta.has_unclassified_content = true，暫存內容先留在 <code>body_markdown</code>。
            </div>
            {unclassified.unclassifiedNotes ? (
              <div className="mt-1 text-xs text-amber-900">Notes: {unclassified.unclassifiedNotes}</div>
            ) : null}
          </div>
        ) : null}

        {tab === 'zh-tw' && <JsonSummary data={zhTw} title="zh-TW JSON" />}
        {tab === 'zh-cn' && <JsonSummary data={zhCn} title="zh-CN JSON" />}

        {tab === 'new-page' && (
          <div className="space-y-2">
            {entry.newSiteUrl ? (
              <>
                <a className="text-blue-600 underline break-all" href={entry.newSiteUrl} target="_blank" rel="noreferrer">
                  {entry.newSiteUrl}
                </a>
                <iframe title="New page preview" src={entry.newSiteUrl} className="w-full h-96 border rounded" />
              </>
            ) : (
              <div className="text-gray-600">尚未設定新站 URL</div>
            )}
          </div>
        )}

        {tab === 'wordpress' && (
          <div className="space-y-2">
            {entry.wordpressPostId ? (
              <div>WordPress post_id: {entry.wordpressPostId}</div>
            ) : (
              <div className="text-gray-600">尚未設定 WordPress 資料</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VisualComparePage() {
  const [entries, setEntries] = useState<CompareEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [indexError, setIndexError] = useState<string | null>(null)
  const [legacyView, setLegacyView] = useState<'local' | 'url'>('local')
  const [rightTab, setRightTab] = useState<RightTab>('zh-tw')
  const [showOnlyUnclassified, setShowOnlyUnclassified] = useState(false)
  const [unclassifiedMap, setUnclassifiedMap] = useState<
    Record<string, { hasUnclassifiedContent: boolean; unclassifiedNotes: string | null }>
  >({})

  useEffect(() => {
    fetch('/data/compare/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((list: CompareEntry[]) => {
        setEntries(list)
        if (list.length > 0) setSelectedId(list[0].id)
        setIndexError(null)
      })
      .catch((err) => setIndexError(err.message || 'failed to load index'))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadFlags() {
      const next: Record<string, { hasUnclassifiedContent: boolean; unclassifiedNotes: string | null }> = {}
      for (const item of entries) {
        const path = item.anycontentZhTwPath ? (item.anycontentZhTwPath.startsWith('/') ? item.anycontentZhTwPath : `/${item.anycontentZhTwPath}`) : null
        if (!path) continue
        try {
          const res = await fetch(path)
          if (!res.ok) continue
          const json = await res.json()
          const meta = json?.meta || {}
          next[item.id] = {
            hasUnclassifiedContent: Boolean(meta.has_unclassified_content),
            unclassifiedNotes: meta.unclassified_notes ?? null,
          }
        } catch {
          // ignore errors per item
        }
      }
      if (!cancelled) setUnclassifiedMap(next)
    }
    if (entries.length > 0) {
      loadFlags()
    } else {
      setUnclassifiedMap({})
    }
    return () => {
      cancelled = true
    }
  }, [entries])

  const selected = useMemo(() => entries.find((e) => e.id === selectedId) || null, [entries, selectedId])
  const selectedFlags = selected ? unclassifiedMap[selected.id] : undefined
  const visibleEntries = useMemo(
    () => (showOnlyUnclassified ? entries.filter((e) => unclassifiedMap[e.id]?.hasUnclassifiedContent) : entries),
    [entries, showOnlyUnclassified, unclassifiedMap],
  )

  const { text: legacyHtml } = useFetchedText(selected?.legacyHtmlPath)
  const { data: zhTw } = useFetchedJson(selected?.anycontentZhTwPath)
  const { data: zhCn } = useFetchedJson(selected?.anycontentZhCnPath)

  useEffect(() => {
    setLegacyView('local')
    setRightTab('zh-tw')
  }, [selectedId])

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#1f2937]">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Visual Compare Tool v1</h1>
          <p className="text-sm text-gray-600">
            開啟 dev 用的比對工具，檢查 legacy / AnyContent / 新站（目前含 teaching/news/magazine sample）。
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        <section className="bg-white border rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div>
              <div className="font-semibold">Index</div>
              <div className="text-xs text-gray-600">點選一列同步切換 legacy / JSON / 新頁</div>
            </div>
            <label className="text-xs flex items-center gap-2 px-2 py-1 border rounded bg-gray-50">
              <input
                type="checkbox"
                checked={showOnlyUnclassified}
                onChange={(e) => setShowOnlyUnclassified(e.target.checked)}
              />
              只顯示未分類旗標
            </label>
          </div>
          <div className="overflow-x-auto">
            {indexError ? (
              <div className="px-4 py-3 text-sm text-red-600">無法載入 index：{indexError}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">Label</th>
                    <th className="text-left px-3 py-2">postType</th>
                    <th className="text-left px-3 py-2">Legacy</th>
                    <th className="text-left px-3 py-2">AnyContent</th>
                    <th className="text-left px-3 py-2">New</th>
                    <th className="text-left px-3 py-2">WP</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEntries.map((item) => {
                    const isActive = item.id === selectedId
                    const hasUnclassified = unclassifiedMap[item.id]?.hasUnclassifiedContent
                    return (
                      <tr
                        key={item.id}
                        className={`border-t cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td className="px-3 py-2 font-medium">
                          <div className="flex items-center gap-2">
                            <span>{item.label}</span>
                            {hasUnclassified ? (
                              <span className="text-[11px] px-2 py-0.5 rounded border border-amber-400 bg-amber-50 text-amber-700">
                                unclassified
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2">{item.postType}</td>
                        <td className="px-3 py-2 break-all">{item.legacyUrl || item.legacyHtmlPath || '—'}</td>
                        <td className="px-3 py-2 break-all">{item.anycontentZhTwPath || '—'}</td>
                        <td className="px-3 py-2 break-all">{item.newSiteUrl || '—'}</td>
                        <td className="px-3 py-2 break-all">
                          {item.wordpressPostId ? `post_id: ${item.wordpressPostId}` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                  {visibleEntries.length === 0 && (
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-600" colSpan={6}>
                        目前沒有資料，請檢查 data/compare/index.json
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="min-h-[480px]">
            {selected ? (
              <LegacyView entry={selected} htmlText={legacyHtml} legacyView={legacyView} setLegacyView={setLegacyView} />
            ) : (
              <div className="bg-white border rounded-lg shadow-sm h-full flex items-center justify-center text-gray-600">
                請先在 index 選擇一筆資料
              </div>
            )}
          </div>
          <div className="min-h-[480px]">
            {selected ? (
              <RightPane
                entry={selected}
                zhTw={zhTw}
                zhCn={zhCn}
                tab={rightTab}
                setTab={setRightTab}
                unclassified={selectedFlags}
              />
            ) : (
              <div className="bg-white border rounded-lg shadow-sm h-full flex items-center justify-center text-gray-600">
                請先在 index 選擇一筆資料
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
