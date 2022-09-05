import { createStore } from 'solid-js/store'

export const [cards, setCards] = createStore<CardType[]>([])

export type CardType = {
  id: string
  text: string
  isNew: boolean
  positionX: number
  positionY: number
}
