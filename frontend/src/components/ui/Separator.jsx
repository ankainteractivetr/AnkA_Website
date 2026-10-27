const SEPARATOR = "relative z-[2] h-[74px] w-full bg-[url('/seperator.png')] bg-repeat-x bg-size-[auto_74px] bg-center";

/** The ornamental band between home page sections. */
export function Separator()
{
  return <div className={SEPARATOR} aria-hidden="true" />;
}
