/** Positions in a list that wraps around: stepping past the last item lands on the first, and back. */
export class CircularIndex
{
  static wrap(index, length)
  {
    return length === 0 ? 0 : ((index % length) + length) % length;
  }
}
