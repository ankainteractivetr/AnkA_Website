/** A WhatsApp click-to-chat address: the number with its country code (digits only, 905XXXXXXXXX) and a ready-typed message. */
export class WhatsAppLink
{
  constructor(number, message)
  {
    Object.assign(this, { number, message });
    Object.freeze(this);
  }

  toString()
  {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(this.message)}`;
  }
}
