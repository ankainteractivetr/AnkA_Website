import { useCallback, useMemo, useState } from 'react';
import { estimateCommission } from '../../../domain/commission';

/** The calculator's raw field values, a setter by field name, and the estimate (null until every field is valid). */
export function useCommissionFields(defaultShare)
{
  const [fields, setFields] = useState({ orders: '', basket: '', rate: '', share: String(defaultShare) });
  const update = useCallback((name, value) => setFields((current) => ({ ...current, [name]: value })), []);
  const estimate = useMemo(() => estimateCommission(fields), [fields]);
  return { fields, update, estimate };
}
