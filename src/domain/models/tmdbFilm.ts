export interface tmdbFilm {
  titulo: string
  titulo_original: string
  resumen: string
  fecha_estreno: string
  genero: { id: number; nombre: string }[]
  duracion: number
  lema: string
  calificacion_promedio: number
  cantidad_votos: number
  presupuesto: number
  ingresos: number
  poster_url: string
  companias_productoras: { id: number; nombre: string }[]
}
