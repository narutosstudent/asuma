import type { CardType } from '../../store'

import { createSignal } from 'solid-js'

import { Delete } from '../../icons/Delete'
import { setCards } from '../../store'
import { cards } from '../../store'
import { formatOrdinals } from '../../utils'
import './Card.css'

type CardProps = {
  card: CardType
  index: number
}

export function Card(props: CardProps) {
  const [cardText, setCardText] = createSignal(props.card.text)
  const [isDragging, setIsDragging] = createSignal(false)
  const [isTextareaFocused, setIsTextareaFocused] = createSignal(false)

  // With this format we can give the textareas a unique accessible name.
  const cardNumberWithOrdinal = formatOrdinals(props.index)

  let textareaElement: HTMLTextAreaElement | undefined

  function handleTextareaChange(
    event: InputEvent & {
      currentTarget: HTMLTextAreaElement
      target: Element
    }
  ) {
    setCardText((event.target as HTMLTextAreaElement).value)
    setCards((card) => card.id === props.card.id, { text: cardText() })
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

    setCards((card) => card.id === props.card.id, {
      positionY: event.clientY,
      positionX: event.clientX,
    })
  }

  function handleCardDoubleClick(event: MouseEvent) {
    // Prevents a card from being added when double clicking on the card.
    event.stopPropagation()
    setIsTextareaFocused(true)
    textareaElement.focus()
  }

  function handleTextareBlur() {
    setIsTextareaFocused(false)
    setCards((card) => card.id === props.card.id, { isNew: false })
  }

  function handleDeletion() {
    const newCards = cards.filter((card) => card.id !== props.card.id)

    setCards(newCards)
  }

  return (
    <div
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
      }}
      class="card"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleDragging}
      onDblClick={handleCardDoubleClick}
      tabIndex="0"
    >
      <textarea
        style={{
          cursor: isTextareaFocused() ? 'auto' : 'inherit',
        }}
        ref={textareaElement}
        disabled={!isTextareaFocused()}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={handleTextareBlur}
        aria-label={`Edit text for ${cardNumberWithOrdinal} card`}
        class="card__textarea"
        value={cardText()}
        onInput={handleTextareaChange}
      />
      <div class="card__menu">
        <button
          aria-label={`Delete ${cardNumberWithOrdinal} card`}
          class="card__delete-button"
          title="Delete card"
          onClick={handleDeletion}
        >
          <Delete />
        </button>
      </div>
    </div>
  )
}
