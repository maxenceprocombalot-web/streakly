/** Défi 30 jours sur une habitude */
export interface Challenge {
  id: string;
  habitId: string;
  /** Date de début YYYY-MM-DD */
  startDate: string;
  /** Rempli quand le défi est terminé (30 jours validés) */
  completedAt: string | null;
}
