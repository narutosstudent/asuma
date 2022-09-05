import type { CardType } from '../../store'

import { formatOrdinals } from '../../utils'
import './Card.css'

type CardProps = {
  card: CardType
}

export function Card(props: CardProps) {
  const cardNumberWithOrdinal = formatOrdinals(props.card.id + 1)

  return (
    <div
      class="card"
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
      }}
    >
      <textarea
        aria-label={`Edit text for ${cardNumberWithOrdinal} card`}
        class="card__textarea"
      />
    </div>
  )
}
