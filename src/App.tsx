import type { CardType } from './store'

import { For } from 'solid-js'

import './App.css'
import { Card } from './components'
import { cards, setCards } from './store'

export const App = () => {
  function handleDoubleClickOfContainer(
    event: MouseEvent & {
      currentTarget: HTMLElement
      target: Element
    }
  ) {
    const newId = cards.length

    const positionX = event.clientX
    const positionY = event.clientY

    setCards(newId, { id: newId, text: '', positionX, positionY } as CardType)
  }

  return (
    <main class="container" onDblClick={handleDoubleClickOfContainer}>
      <For each={cards}>{(card) => <Card card={card} />}</For>
    </main>
  )
}
