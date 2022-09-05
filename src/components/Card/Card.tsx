import type { CardType } from '../../store'

import { createEffect, createSignal } from 'solid-js'

import { setCards } from '../../store'
import { cards } from '../../store'
import { formatOrdinals } from '../../utils'
import './Card.css'

type CardProps = {
  card: CardType
}

export function Card(props: CardProps) {
  const [cardText, setCardText] = createSignal(props.card.text)
  const [isDragging, setIsDragging] = createSignal(false)
  const [isTextareaFocused, setIsTextareaFocused] = createSignal(true)

  // With this format we can give the textareas a unique accessible name.
  const cardNumberWithOrdinal = formatOrdinals(props.card.id + 1)

  let textareaElement: HTMLTextAreaElement | undefined

  createEffect(() => {
    const isLastCard = props.card.id === cards[cards.length - 1].id
    if (textareaElement && isLastCard && isTextareaFocused()) {
      textareaElement.focus()
    }
  })

  function handleTextareaChange(
    event: InputEvent & {
      currentTarget: HTMLTextAreaElement
      target: Element
    }
  ) {
    setCardText((event.target as HTMLTextAreaElement).value)
    setCards(props.card.id, { text: cardText() })
  }

  function handleDragging(
    event: MouseEvent & {
      currentTarget: HTMLDivElement
      target: Element
    }
  ) {
    if (!isDragging() || isTextareaFocused()) {
      return
    }

    setCards(props.card.id, {
      positionX: event.clientX,
      positionY: event.clientY,
    })
  }

  function handleCardDoubleClick(event: MouseEvent) {
    event.stopPropagation()
    setIsTextareaFocused(true)
  }

  return (
    <div
      class="card"
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
        cursor: isDragging() ? 'grabbing' : 'default',
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleDragging}
      onDblClick={handleCardDoubleClick}
    >
      <textarea
        ref={textareaElement}
        style={{
          cursor: isTextareaFocused() ? 'auto' : 'inherit',
        }}
        disabled={!isTextareaFocused()}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={() => setIsTextareaFocused(false)}
        aria-label={`Edit text for ${cardNumberWithOrdinal} card`}
        class="card__textarea"
        value={cardText()}
        onInput={handleTextareaChange}
      />
    </div>
  )
}
