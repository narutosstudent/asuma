import type { CardType } from '../../store'
import './Card.css'

type CardProps = {
  card: CardType
}

export function Card(props: CardProps) {
  return (
    <div
      class="card"
      style={{
        top: `${props.card.positionY}px`,
        left: `${props.card.positionX}px`,
      }}
    />
  )
}
