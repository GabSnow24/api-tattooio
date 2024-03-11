export interface IRest {
  id: string
  cellphone: string
  username: string
}

export interface IToken extends IJwt {
  username: string
  id: string
}

export interface IJwt {
  sub: string
  username: string
}
