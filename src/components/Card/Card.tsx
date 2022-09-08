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
  const [fontSize, setFontSize] = createSignal(props.card.fontSize)
  const [isDragging, setIsDragging] = createSignal(false)
  const [mouseDownPos, setMouseDownPos] = createSignal({ x: 0, y: 0 })
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

    let y = props.card.positionY
    let x = props.card.positionX

    const rect = event.target.getBoundingClientRect()

    if (event.movementY != 0) {
      y = event.clientY + rect.height / 2 - mouseDownPos().y
    }
    if (event.movementX != 0) {
      x = event.clientX + rect.width / 2 - mouseDownPos().x
    }

    setCards((card) => card.id === props.card.id, {
      positionY: y,
      positionX: x,
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
  }

  function handleDeletion() {
    const newCards = cards.filter((card) => card.id !== props.card.id)

    setCards(newCards)
  }

  function handleFontsizeChange(
    event: InputEvent & {
      currentTarget: HTMLInputElement
      target: Element
    }
  ) {
    setFontSize(Number((event.target as HTMLInputElement).value))
    setCards((card) => card.id === props.card.id, {
      fontSize: fontSize(),
    })
  }

  function handleMouseDown(event: MouseEvent) {
    setIsDragging(true)
    setMouseDownPos({ y: event.offsetY, x: event.offsetX })
  }

  return (
    <div
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
      }}
      class="card"
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
      onMouseOut={() => setIsDragging(false)}
      onMouseMove={handleDragging}
      onDblClick={handleCardDoubleClick}
      tabIndex="0"
    >
      <textarea
        style={{
          cursor: isTextareaFocused() ? 'auto' : 'inherit',
          'font-size': `calc(1rem * ${fontSize()} / 16)`,
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
        <input
          aria-label="font size"
          class="card__font-input"
          type="number"
          value={fontSize()}
          onInput={handleFontsizeChange}
        />
      </div>
    </div>
  )
}
