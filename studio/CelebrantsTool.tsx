import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useClient, useCurrentUser } from 'sanity'
import { Badge, Box, Button, Card, Flex, Heading, Inline, Spinner, Stack, Text } from '@sanity/ui'
import { celebrantsFromCsv, type CelebrantRow } from '../lib/celebrantsCsv'

// The Home Page singleton this tool edits (see singletonPages in sanity.config.ts).
const HOME_PAGE_ID = 'c5eaa530-f8a9-4378-b919-68fb1dfb773b'
const API_VERSION = '2024-01-01'

type StoredCelebrant = {
  _key: string
  name: string
  birthday?: string
  role?: string
  school?: string
  greeting?: string
  photo?: unknown
}

type Status = { tone: 'positive' | 'critical' | 'caution' | 'primary'; message: string } | null

function formatBirthday(value?: string) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-PH', { month: 'long', day: 'numeric', timeZone: 'Asia/Manila' }).format(date)
}

export default function CelebrantsTool() {
  const client = useClient({ apiVersion: API_VERSION })
  const user = useCurrentUser()
  const fileInput = useRef<HTMLInputElement>(null)

  const [celebrants, setCelebrants] = useState<StoredCelebrant[] | null>(null)
  const [pending, setPending] = useState<CelebrantRow[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<Status>(null)

  const load = useCallback(async () => {
    const result = await client.fetch<StoredCelebrant[] | null>(
      '*[_id == $id][0].birthdayCelebrants',
      { id: HOME_PAGE_ID },
    )
    setCelebrants(result ?? [])
  }, [client])

  // Load once on open. The cancelled flag stops a slow response from writing
  // state into a tool the user has already navigated away from.
  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        await load()
      } catch (error) {
        if (!cancelled) setStatus({ tone: 'critical', message: (error as Error).message })
      }
    }
    run()
    return () => { cancelled = true }
  }, [load])

  const sorted = useMemo(
    () => (celebrants ?? []).slice().sort((a, b) => (a.birthday ?? '').slice(5).localeCompare((b.birthday ?? '').slice(5))),
    [celebrants],
  )

  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setStatus(null)

    const reader = new FileReader()
    reader.onload = () => {
      const result = celebrantsFromCsv(String(reader.result ?? ''))
      if (!result.ok) { setPending(null); setStatus({ tone: 'critical', message: result.error }); return }
      setPending(result.celebrants)
      setStatus({ tone: 'primary', message: `Read ${result.celebrants.length} celebrant${result.celebrants.length === 1 ? '' : 's'}. Nothing saved yet — choose how to add them below.` })
    }
    reader.onerror = () => setStatus({ tone: 'critical', message: 'Could not read that file.' })
    reader.readAsText(file)
  }

  const clearFile = () => {
    setPending(null); setFileName(''); setStatus(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  /** Photos given as web addresses are fetched and stored in Sanity as real images. */
  const withPhotos = async (rows: CelebrantRow[]) => {
    const out = []
    for (const row of rows) {
      const { photoUrl, ...rest } = row
      if (!photoUrl || !/^https?:\/\//i.test(photoUrl)) { out.push(rest); continue }
      try {
        const response = await fetch(photoUrl)
        if (!response.ok) throw new Error(`status ${response.status}`)
        const asset = await client.assets.upload('image', await response.blob(), { filename: `${row.name}.jpg` })
        out.push({ ...rest, photo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      } catch {
        // A photo that will not download should not lose the whole celebrant.
        out.push(rest)
      }
    }
    return out
  }

  const save = async (mode: 'add' | 'replace') => {
    if (!pending) return
    setBusy(true)
    setStatus({ tone: 'primary', message: 'Saving…' })
    try {
      const rows = await withPhotos(pending)
      if (mode === 'replace') {
        await client.patch(HOME_PAGE_ID).set({ birthdayCelebrants: rows }).commit()
      } else {
        await client.patch(HOME_PAGE_ID).setIfMissing({ birthdayCelebrants: [] }).append('birthdayCelebrants', rows).commit()
      }
      await load()
      clearFile()
      setStatus({ tone: 'positive', message: `Saved. ${rows.length} celebrant${rows.length === 1 ? '' : 's'} ${mode === 'replace' ? 'now on the homepage' : 'added'}.` })
    } catch (error) {
      setStatus({ tone: 'critical', message: `Could not save: ${(error as Error).message}` })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (key: string, name: string) => {
    setBusy(true)
    try {
      await client.patch(HOME_PAGE_ID).unset([`birthdayCelebrants[_key=="${key}"]`]).commit()
      await load()
      setStatus({ tone: 'positive', message: `Removed ${name}.` })
    } catch (error) {
      setStatus({ tone: 'critical', message: `Could not remove: ${(error as Error).message}` })
    } finally {
      setBusy(false)
    }
  }

  const removeAll = async () => {
    setBusy(true)
    try {
      await client.patch(HOME_PAGE_ID).set({ birthdayCelebrants: [] }).commit()
      await load()
      setStatus({ tone: 'caution', message: 'All celebrants removed. The homepage will show sample entries until you add more.' })
    } catch (error) {
      setStatus({ tone: 'critical', message: `Could not clear: ${(error as Error).message}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box padding={4} style={{ maxWidth: 900, margin: '0 auto' }}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading size={3}>Birthday Celebrants</Heading>
          <Text size={1} muted>
            Upload a CSV to add this month&apos;s celebrants to the homepage, or remove them below.
            Signed in as {user?.name || user?.email || 'your Sanity account'}.
          </Text>
        </Stack>

        {/* Upload */}
        <Card padding={4} radius={3} shadow={1} tone="transparent" border>
          <Stack gap={4}>
            <Text weight="semibold">1. Choose your CSV file</Text>
            <Text size={1} muted>
              Columns: <code>name</code> and <code>birthday</code> are required; <code>role</code>,{' '}
              <code>school</code>, <code>greeting</code> and <code>photo</code> are optional.
              Dates can be 2026-09-14, 09/14/2026 or 09-14. A photo must be a web address.
            </Text>

            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              onChange={onFile}
              disabled={busy}
              style={{ fontSize: 14 }}
            />

            {pending && (
              <Stack gap={3}>
                <Text size={1} weight="semibold">{fileName} — {pending.length} celebrant{pending.length === 1 ? '' : 's'} ready</Text>
                <Card padding={3} radius={2} tone="transparent" border style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <Stack gap={2}>
                    {pending.map(row => (
                      <Text key={row._key} size={1}>
                        {formatBirthday(row.birthday)} — {row.name}
                        {row.role || row.school ? ` (${[row.role, row.school].filter(Boolean).join(', ')})` : ''}
                      </Text>
                    ))}
                  </Stack>
                </Card>
                <Inline gap={2}>
                  <Button text="Replace the whole list" tone="primary" disabled={busy} onClick={() => save('replace')} />
                  <Button text="Add to the list" mode="ghost" disabled={busy} onClick={() => save('add')} />
                  <Button text="Cancel" mode="bleed" disabled={busy} onClick={clearFile} />
                </Inline>
              </Stack>
            )}
          </Stack>
        </Card>

        {status && (
          <Card padding={3} radius={2} tone={status.tone} border>
            <Text size={1}>{status.message}</Text>
          </Card>
        )}

        {/* Current list */}
        <Card padding={4} radius={3} shadow={1} tone="transparent" border>
          <Stack gap={4}>
            <Flex align="center" justify="space-between">
              <Text weight="semibold">
                2. On the homepage now{celebrants ? ` (${celebrants.length})` : ''}
              </Text>
              {celebrants && celebrants.length > 0 && (
                <Button text="Remove all" tone="critical" mode="ghost" fontSize={1} disabled={busy} onClick={removeAll} />
              )}
            </Flex>

            {celebrants === null ? (
              <Flex align="center" gap={2}><Spinner muted /><Text size={1} muted>Loading…</Text></Flex>
            ) : celebrants.length === 0 ? (
              <Text size={1} muted>
                No celebrants yet. The homepage shows sample entries until you add some.
              </Text>
            ) : (
              <Stack gap={2}>
                {sorted.map(celebrant => (
                  <Card key={celebrant._key} padding={3} radius={2} tone="transparent" border>
                    <Flex align="center" justify="space-between" gap={3}>
                      <Stack gap={2}>
                        <Flex align="center" gap={2}>
                          <Text weight="semibold" size={1}>{celebrant.name}</Text>
                          <Badge tone="primary" fontSize={0}>{formatBirthday(celebrant.birthday)}</Badge>
                        </Flex>
                        {(celebrant.role || celebrant.school) && (
                          <Text size={1} muted>{[celebrant.role, celebrant.school].filter(Boolean).join(' · ')}</Text>
                        )}
                      </Stack>
                      <Button
                        text="Remove"
                        tone="critical"
                        mode="ghost"
                        fontSize={1}
                        disabled={busy}
                        onClick={() => remove(celebrant._key, celebrant.name)}
                      />
                    </Flex>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
