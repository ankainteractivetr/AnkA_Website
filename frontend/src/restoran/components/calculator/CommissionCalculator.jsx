import { CALCULATOR } from '../../../content/restoran.tr';
import { CARD } from '../../styles';
import { Section } from '../ui/Section';
import { CalculatorResults } from './CalculatorResults';
import { NumberField } from './NumberField';
import { ShareSlider } from './ShareSlider';
import { useCommissionFields } from './useCommissionFields';

function Fields({ fields, update })
{
  const spec = CALCULATOR.fields;
  return (
    <form className="grid sm:grid-cols-2 gap-5" onSubmit={(event) => event.preventDefault()}>
      <NumberField name="orders" field={spec.orders} value={fields.orders} onChange={update} /><NumberField name="basket" field={spec.basket} value={fields.basket} onChange={update} />
      <NumberField name="rate" field={spec.rate} value={fields.rate} onChange={update} max="100" step="0.1" /><ShareSlider field={spec.share} value={fields.share} onChange={update} />
    </form>
  );
}

/** "How much do you pay the platform?": the restaurant's own numbers in, the yearly commission it could keep out. */
export function CommissionCalculator()
{
  const { fields, update, estimate } = useCommissionFields(CALCULATOR.fields.share.defaultValue);
  return (
    <Section id="hesapla" title={CALCULATOR.title} lead={CALCULATOR.text} cta={{ id: 'calculator', label: CALCULATOR.cta }}>
      <div className={`${CARD} grid md:grid-cols-[3fr_2fr] gap-8`}><Fields fields={fields} update={update} /><CalculatorResults estimate={estimate} /></div><p className="mt-6 text-lg max-w-2xl">{CALCULATOR.after}</p>
    </Section>
  );
}
