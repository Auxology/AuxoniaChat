// Login taken entirely from this guy
// https://github.com/codinginflow/infinite-scroll-react-query/blob/Final-project/src/components/InfiniteScrollContainer.tsx
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  onTopReached: () => void;
  className?: string;
}

export default function InfiniteScrollContainer({
  children,
  onTopReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "800px",
    onChange(inView) {
      if (inView) {
        onTopReached();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      {/* This ref is visually near the top due to flex-col-reverse */}
      <div ref={ref} />
    </div>
  );
}