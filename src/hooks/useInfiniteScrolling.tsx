import { useCallback, useRef } from "react";

export const useInfiniteScrolling = (handleTrigger: () => void) => {
	const observer = useRef<IntersectionObserver | null>(null);

	const lastElementRef = useCallback(
		(node: any) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						handleTrigger();
					}
				},
				{
					rootMargin: "600px",
				}
			);
			if (node) observer.current.observe(node);
		},
		[handleTrigger]
	);

	return lastElementRef;
};
