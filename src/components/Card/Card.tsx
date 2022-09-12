import type { CardType } from '../../store'
import type { Accessor } from 'solid-js'

import { createEffect, createSignal } from 'solid-js'

import { Delete } from '../../icons/Delete'
import { setCards } from '../../store'
import { cards } from '../../store'
import { formatOrdinals } from '../../utils'
import './Card.css'

type CardProps = {
  card: CardType
  index: number
  mouseMoveEvent: Accessor<MouseEvent>
  mouseLeftPressed: Accessor<boolean>
}

export function Card(props: CardProps) {
  const [cardText, setCardText] = createSignal(props.card.text)
  const [fontSize, setFontSize] = createSignal(props.card.fontSize)
  const [isDragging, setIsDragging] = createSignal(false)
  const [mouseDownPos, setMouseDownPos] = createSignal({ x: 0, y: 0 })
  const [isTextareaFocused, setIsTextareaFocused] = createSignal(false)

  // With this format we can give the textareas a unique accessible name.
  const cardNumberWithOrdinal = formatOrdinals(props.index)

  let cardElementRef: HTMLDivElement
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

  createEffect(() => {
    if (!props.mouseLeftPressed() || !isDragging() || isTextareaFocused()) {
      return
    }

    let y = props.card.positionY
    let x = props.card.positionX

    const rect = cardElementRef.getBoundingClientRect()

    if (props.mouseMoveEvent().movementY != 0) {
      y = props.mouseMoveEvent().clientY + rect.height / 2 - mouseDownPos().y
    }
    if (props.mouseMoveEvent().movementX != 0) {
      x = props.mouseMoveEvent().clientX + rect.width / 2 - mouseDownPos().x
    }

    setCards((card) => card.id === props.card.id, {
      positionY: y,
      positionX: x,
    })
  })

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
    setMouseDownPos({ y: event.offsetY, x: event.offsetX })
    setIsDragging(true)
  }

  return (
    <div
      ref={cardElementRef}
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
      }}
      class="card"
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
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
