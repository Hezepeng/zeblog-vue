import defaultSettings from '@/settings'

const title = defaultSettings.title || '何泽鹏的博客'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
