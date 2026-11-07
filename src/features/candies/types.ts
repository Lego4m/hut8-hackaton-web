export type ImageAttachment = {
  url: string
  width?: number
  height?: number
}

export type Candy = {
  id: number
  name: string
  category: string | null
  price_cents: number
  stock: number
  in_stock: boolean
  image: ImageAttachment | null
}

export type CandyDetail = Candy & {
  description: string | null
}
