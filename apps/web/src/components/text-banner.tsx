import {cn} from '@/lib/utils';

interface TextBannerProps extends React.ComponentProps<'div'> {
  text: string;
}

const TextBanner = ({text, ...rest}: TextBannerProps) => {
  return (
    <div
      {...rest}
      className={cn(
        'mb-4 rounded-xl border bg-gradient-to-r from-muted/40 to-transparent p-4 text-center',
        rest.className,
      )}
    >
      <p className="text-sm text-balance text-muted-foreground">{text}</p>
    </div>
  );
};

export default TextBanner;
