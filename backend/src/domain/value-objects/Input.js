import { ValidationError } from '../errors.js';
import { LocalizedText } from './LocalizedText.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ABSOLUTE_URL = /^https?:\/\/\S+$/i;
const LINK = /^(?:https?:\/\/|\/)\S*$/i;
const MAX_ID = 4_294_967_295;

/** Reads and validates untrusted fields of admin requests; messages are shown in the CMS. */
export class Input
{
  static text(value, field, { max = 255, required = true } = {})
  {
    const text = typeof value === 'string' ? value.trim() : '';
    if (required && !text) throw new ValidationError(`${field} is required.`);
    if (text.length > max) throw new ValidationError(`${field} must be at most ${max} characters.`);
    return text;
  }

  /** Like text, but an empty value is null. */
  static nullable(value, field, { max = 255 } = {})
  {
    return Input.text(value, field, { max, required: false }) || null;
  }

  /** { en, tr }: both required, or (required: false) both optional. */
  static localized(value, field, { max = 255, required = true } = {})
  {
    const en = Input.text(value?.en, `${field} (EN)`, { max, required });
    return new LocalizedText(en, Input.text(value?.tr, `${field} (TR)`, { max, required }));
  }

  static oneOf(value, allowed, field)
  {
    if (!allowed.includes(value)) throw new ValidationError(`${field} is invalid.`);
    return value;
  }

  static integer(value, field, { min = 0, max = 9999 } = {})
  {
    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) throw new ValidationError(`${field} must be a whole number from ${min} to ${max}.`);
    return number;
  }

  static id(value, field = 'Record')
  {
    return Input.integer(value, `${field} id`, { min: 1, max: MAX_ID });
  }

  /** An id, or null when there is none (e.g. the about gallery, which belongs to no project). */
  static optionalId(value, field)
  {
    return value === null || value === undefined ? null : Input.id(value, field);
  }

  static boolean(value)
  {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  static list(value, field, { max = 50 } = {})
  {
    if (!Array.isArray(value)) throw new ValidationError(`${field} must be a list.`);
    if (value.length > max) throw new ValidationError(`${field} may contain at most ${max} entries.`);
    return value;
  }

  /** Distinct record ids, e.g. a new display order. */
  static ids(value, field, { max = 500 } = {})
  {
    const ids = Input.list(value, field, { max }).map((id) => Input.id(id, field));
    if (new Set(ids).size !== ids.length) throw new ValidationError(`${field} lists a record more than once.`);
    return ids;
  }

  static slug(value, field, { max = 100 } = {})
  {
    const slug = Input.text(value, field, { max });
    if (!SLUG.test(slug)) throw new ValidationError(`${field} may only contain lower-case letters, digits and dashes (e.g. shahmaran).`);
    return slug;
  }

  /** A required absolute http(s) address. */
  static url(value, field, { max = 500 } = {})
  {
    const url = Input.text(value, field, { max });
    if (!ABSOLUTE_URL.test(url)) throw new ValidationError(`${field} must start with http:// or https://.`);
    return url;
  }

  /** An optional address: absolute (http/https) or site-relative (/file.exe); empty is null. */
  static link(value, field, { max = 500 } = {})
  {
    const link = Input.nullable(value, field, { max });
    if (link && !LINK.test(link)) throw new ValidationError(`${field} must start with http://, https:// or /.`);
    return link;
  }

  /** An optional e-mail address; empty is null. */
  static email(value, field)
  {
    const email = Input.nullable(value, field);
    if (email && !EMAIL.test(email)) throw new ValidationError(`${field} is not a valid e-mail address.`);
    return email;
  }
}
