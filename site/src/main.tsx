import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/ibm-plex-sans'
import './styles/global.css'
import App from './App'
import { lang } from './i18n'

// Thai and Japanese faces load only on their own pages. Each file declares
// many small unicode-range subsets, so the browser fetches only the glyphs it uses.
if (lang === 'th') {
  import('@fontsource/ibm-plex-sans-thai/400.css')
  import('@fontsource/ibm-plex-sans-thai/500.css')
  import('@fontsource/ibm-plex-sans-thai/600.css')
  import('@fontsource/ibm-plex-sans-thai/700.css')
}
if (lang === 'ja') {
  import('@fontsource/ibm-plex-sans-jp/400.css')
  import('@fontsource/ibm-plex-sans-jp/500.css')
  import('@fontsource/ibm-plex-sans-jp/700.css')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
