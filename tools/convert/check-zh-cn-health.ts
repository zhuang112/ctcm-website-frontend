import { promises as fs } from 'fs'
import path from 'path'

type Severity = 'ERROR' | 'WARN'

type Issue = {
  severity: Severity
  type: string
  message: string
}

const TW_ROOT = path.join('data', 'anycontent', 'zh-tw')
const CN_ROOT = path.join('data', 'anycontent', 'zh-cn')

const BASIC_FIELDS = ['post_type', 'slug', 'old_url'] as const
const CONVERTIBLE_FIELDS = ['post_title', 'post_excerpt', 'body_markdown'] as const
const SEO_FIELDS = ['meta_title', 'meta_description'] as const

async function listJsonFiles(root: string): Promise<string[]> {
  const result: string[] = []
  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true })
    for (const entry of entries) {
        const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        result.push(full)
      }
    }
  }
  await walk(root)
  return result.sort()
}

async function readJson(file: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const raw = await fs.readFile(file, 'utf8')
    return { ok: true, data: JSON.parse(raw) }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.stat(file)
    return true
  } catch {
    return false
  }
}

function relativeCnPath(twPath: string): string {
  const relative = path.relative(TW_ROOT, twPath)
  return path.join(CN_ROOT, relative)
}

function push(issues: Issue[], severity: Severity, type: string, message: string) {
  issues.push({ severity, type, message })
}

function checkBasicFields(tw: any, cn: any, twPath: string, issues: Issue[]) {
  for (const field of BASIC_FIELDS) {
    if (tw[field] === undefined || cn[field] === undefined) {
      if (tw[field] === undefined) push(issues, 'ERROR', 'MISSING_FIELD_ZH_TW', `${field} missing in ${twPath}`)
      if (cn[field] === undefined) push(issues, 'ERROR', 'MISSING_FIELD_ZH_CN', `${field} missing in ${twPath}`)
      continue
    }
    if (tw[field] !== cn[field]) {
      push(issues, 'ERROR', `${field.toUpperCase()}_MISMATCH`, `${twPath} (${tw[field]} vs ${cn[field]})`)
    }
  }
  if (tw.language && tw.language !== 'zh-tw') {
    push(issues, 'ERROR', 'LANGUAGE_MISMATCH', `${twPath} expected zh-tw got ${tw.language}`)
  }
  if (cn.language && cn.language !== 'zh-cn') {
    push(issues, 'ERROR', 'LANGUAGE_MISMATCH', `${twPath} expected zh-cn got ${cn.language}`)
  }
}

function checkConvertibleFields(tw: any, cn: any, twPath: string, issues: Issue[]) {
  for (const field of CONVERTIBLE_FIELDS) {
    if (tw[field] === undefined) continue
    if (cn[field] === undefined || typeof cn[field] !== typeof tw[field]) {
      push(issues, 'ERROR', `MISSING_CONVERTIBLE_FIELD_ZH_CN:${field}`, `${twPath}`)
    }
  }
}

function checkMeta(tw: any, cn: any, twPath: string, issues: Issue[]) {
  const twMeta = tw?.meta
  if (twMeta === undefined) return
  const cnMeta = cn?.meta
  if (cnMeta === undefined) {
    push(issues, 'ERROR', 'MISSING_META_ZH_CN', twPath)
    return
  }
  if (typeof twMeta !== 'object' || twMeta === null) return
  if (typeof cnMeta !== 'object' || cnMeta === null) {
    push(issues, 'ERROR', 'MISSING_META_ZH_CN', twPath)
    return
  }
  for (const [key, value] of Object.entries(twMeta)) {
    if (typeof value !== 'string') continue
    const cnValue = (cnMeta as Record<string, unknown>)[key]
    if (typeof cnValue !== 'string') {
      push(issues, 'ERROR', `MISSING_META_FIELD_ZH_CN:${key}`, twPath)
    }
  }
}

function checkSeo(tw: any, cn: any, twPath: string, issues: Issue[]) {
  const twSeo = tw?.seo
  if (!twSeo || typeof twSeo !== 'object') return
  const cnSeo = cn?.seo
  for (const field of SEO_FIELDS) {
    if (typeof twSeo[field] === 'string') {
      const cnVal = cnSeo ? cnSeo[field] : undefined
      if (typeof cnVal !== 'string') {
        push(issues, 'ERROR', `MISSING_SEO_FIELD_ZH_CN:${field}`, twPath)
      }
    }
  }
}

async function main() {
  const issues: Issue[] = []
  const twFiles = await listJsonFiles(TW_ROOT)

  for (const twPath of twFiles) {
    const cnPath = relativeCnPath(twPath)
    const twRes = await readJson(twPath)
    if (!twRes.ok || !twRes.data) {
      push(issues, 'ERROR', 'INVALID_JSON_ZH_TW', `${twPath}: ${twRes.error}`)
      continue
    }

    if (!(await exists(cnPath))) {
      push(issues, 'ERROR', 'MISSING_ZH_CN', `${twPath} -> ${cnPath}`)
      continue
    }

    const cnRes = await readJson(cnPath)
    if (!cnRes.ok || !cnRes.data) {
      push(issues, 'ERROR', 'INVALID_JSON_ZH_CN', `${cnPath}: ${cnRes.error}`)
      continue
    }

    const tw = twRes.data
    const cn = cnRes.data

    checkBasicFields(tw, cn, twPath, issues)
    checkConvertibleFields(tw, cn, twPath, issues)
    checkMeta(tw, cn, twPath, issues)
    checkSeo(tw, cn, twPath, issues)
  }

  const grouped = issues.reduce<Record<string, { severity: Severity; count: number }>>((acc, cur) => {
    if (!acc[cur.type]) acc[cur.type] = { severity: cur.severity, count: 0 }
    acc[cur.type].count += 1
    return acc
  }, {})

  const errors = issues.filter((i) => i.severity === 'ERROR').length
  const warnings = issues.filter((i) => i.severity === 'WARN').length

  if (issues.length === 0) {
    console.log('Health check passed with no issues.')
    process.exit(0)
  }

  console.log('Summary:')
  Object.entries(grouped).forEach(([type, info]) => {
    console.log(`  [${info.severity}] ${type}: ${info.count}`)
  })

  console.log('\nDetails:')
  issues.forEach((issue) => {
    console.log(`[${issue.severity}] ${issue.type} ${issue.message}`)
  })

  if (errors > 0) {
    process.exit(1)
  }
  console.log(`\nCompleted with ${warnings} warning(s).`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
