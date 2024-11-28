export interface mergedFilm {
  id: string
  titulo: string
  fecha_estreno: string
  episodio_id?: number
  apertura?: string
  director: string
  productor: string
  personajes: string[]
  planetas: string[]
  naves_estelares: string[]
  vehiculos: string[]
  especies: string[]
  popularidad?: number
  calificacion_promedio?: number
  cantidad_votos?: number
  presupuesto?: number
  ingresos?: number
  createdAt: string
}
