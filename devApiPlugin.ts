import type { Plugin } from 'vite'

const store: Record<string, any> = {}

export default function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      const json = (res: any, data: any, status = 200) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }

      server.middlewares.use('/api/users', (req, res, next) => {
        try {
          const url = new URL(req.url || '', 'http://localhost')
          const parts = url.pathname.split('/').filter(Boolean) // ['api','users',':id','settings']
          const id = parts[2]
          const resource = parts[3]

          if (!id || !resource) return next()

          // Settings endpoints
          if (resource === 'settings') {
            const key = `settings:${id}`
            if (req.method === 'GET') {
              const defaults = store[key] || {
                userId: id,
                theme: (globalThis.localStorage?.getItem?.('theme') as any) || 'light',
                language: 'zh-CN',
                notifications: {
                  dailyChallenge: true,
                  knowledgeReview: true,
                  communityInteraction: false,
                  emailNotifications: false,
                  pushNotifications: false
                },
                reading: {
                  fontSize: 16,
                  lineHeight: 1.8,
                  fontFamily: 'system',
                  autoSave: true,
                  readingMode: 'normal'
                },
                privacy: {
                  profileVisibility: 'public',
                  showReadingStats: true,
                  showActivity: true
                }
              }
              store[key] = defaults
              return json(res, defaults)
            }
            if (req.method === 'PATCH') {
              let body = ''
              req.on('data', (chunk) => (body += chunk))
              req.on('end', () => {
                try {
                  const data = body ? JSON.parse(body) : {}
                  const current = store[key] || {}
                  const updated = {
                    ...current,
                    ...data,
                    notifications: { ...(current.notifications || {}), ...(data.notifications || {}) },
                    reading: { ...(current.reading || {}), ...(data.reading || {}) },
                    privacy: { ...(current.privacy || {}), ...(data.privacy || {}) }
                  }
                  store[key] = updated
                  return json(res, updated)
                } catch (e) {
                  return json(res, { error: 'Invalid JSON' }, 400)
                }
              })
              return
            }
          }

          next()
        } catch {
          next()
        }
      })
    }
  }
}
