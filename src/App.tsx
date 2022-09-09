import { createEffect, createSignal, For, onMount } from 'solid-js'
import { v4 } from 'uuid'

import './App.css'

import { Card } from './components'
import { cards, setCards } from './store'

const CARDS_STORAGE_KEY = 'cards' as const

export const App = () => {
  const [mouseMoveEvent, setMouseMoveEvent] = createSignal<MouseEvent>()
  const [mouseLeftPressed, setMouseLeftPressed] = createSignal<boolean>(false)

  onMount(() => {
    const storageItems = JSON.parse(localStorage.getItem(CARDS_STORAGE_KEY))
    setCards(storageItems || [])
  })

  createEffect(() => {
    // We need to update local storage if we've removed all cards.
    if (cards.length >= 0) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards))
    }
  })

  function handleDoubleClickOfContainer(
    event: MouseEvent & {
      currentTarget: HTMLElement
      target: Element
    }
  ) {
    const newId = v4()

    const positionX = event.clientX
    const positionY = event.clientY

    setCards([
      ...cards,
      {
        id: newId,
        text: '',
        positionX,
        positionY,
        fontSize: 18,
      },
    ])
  }

  return (
    <main
      class="container"
      onDblClick={handleDoubleClickOfContainer}
      onMouseDown={() => setMouseLeftPressed(true)}
      onMouseUp={() => setMouseLeftPressed(false)}
      onMouseMove={(event) => setMouseMoveEvent(event)}
    >
      <For each={cards}>
        {(card, index) => (
          <Card
            card={card}
            index={index()}
            mouseMoveEvent={mouseMoveEvent}
            mouseLeftPressed={mouseLeftPressed}
          />
        )}
      </For>
    </main>
  )
}
