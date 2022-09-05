import type { CardType } from './store'

import { createEffect, For, onMount } from 'solid-js'

import './App.css'
import { Card } from './components'
import { cards, setCards } from './store'

const CARDS_STORAGE_KEY = 'cards' as const

export const App = () => {
  onMount(() => {
    const storageItems = JSON.parse(localStorage.getItem(CARDS_STORAGE_KEY))
    setCards(storageItems || [])
  })

  createEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards))
    }
  })

  function handleDoubleClickOfContainer(
    event: MouseEvent & {
      currentTarget: HTMLElement
      target: Element
    }
  ) {
    const newId = cards.length

    const positionX = event.clientX
    const positionY = event.clientY

    setCards(newId, {
      id: newId,
      text: '',
      isNew: true,
      positionX,
      positionY,
    } as CardType)
  }

  return (
    <main class="container" onDblClick={handleDoubleClickOfContainer}>
      <For each={cards}>{(card) => <Card card={card} />}</For>
    </main>
  )
}
