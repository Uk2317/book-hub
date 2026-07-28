interface Props {
  alt: string;
  className?: string;
}

// Real "Book Hub" logo exported from the official Figma design and hosted on Cloudinary.
const Logo = ({ alt, className }: Props) => (
  <img
    src="https://res.cloudinary.com/diocftr6t/image/upload/v1651940745/Group_7731Website_Logo_o1zltx.png"
    alt={alt}
    className={className}
  />
);

export default Logo;
