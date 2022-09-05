/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import '@fontsource/montserrat'
import { App } from './App'

render(() => <App />, document.getElementById('root') as HTMLElement)
