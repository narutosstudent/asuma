import { createStore } from 'solid-js/store'

export const [cards, setCards] = createStore<CardType[]>([])

export type CardType = {
  id: number
  text: string
  positionX: number
  positionY: number
}
