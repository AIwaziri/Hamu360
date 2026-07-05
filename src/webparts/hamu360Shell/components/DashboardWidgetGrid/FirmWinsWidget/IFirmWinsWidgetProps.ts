import type { IFirmWin } from '@models/index';

export interface IFirmWinsWidgetProps {
  /** Every firm win the caller has (unsorted, untrimmed) — this component does the "top 4, most recent first" selection itself. See its own docblock. */
  firmWins: IFirmWin[];
  className?: string;
}
