import { MouseEvent, MouseEventHandler, useCallback, useRef } from "react";

type EmptyCallback = () => void;

export type CallbackFunction<Target = Element> =
	| MouseEventHandler<Target>
	| EmptyCallback;

export type DoubleTapCallback<Target = Element> =
	CallbackFunction<Target> | null;

export interface DoubleTapOptions<Target = Element> {
	onSingleTap?: CallbackFunction<Target>;
}

export type DoubleTapResult<Target, Callback> =
	Callback extends CallbackFunction<Target>
		? {
				onClick: CallbackFunction<Target>;
		  }
		: Callback extends null
		? {}
		: never;

export function useDoubleTap<
	Target = Element,
	Callback extends DoubleTapCallback<Target> = DoubleTapCallback<Target>
>(
	callback: Callback,
	threshold: number = 300,
	options: DoubleTapOptions<Target> = {}
): DoubleTapResult<Target, Callback> {
	const timer = useRef<NodeJS.Timeout | null>(null);

	const handler = useCallback<CallbackFunction<Target>>(
		(event: MouseEvent<Target>) => {
			if (!timer.current) {
				timer.current = setTimeout(() => {
					if (options.onSingleTap) {
						options.onSingleTap(event);
					}
					timer.current = null;
				}, threshold);
			} else {
				clearTimeout(timer.current);
				timer.current = null;
				callback && callback(event);
			}
		},
		[threshold, options, callback]
	);

	return (
		callback
			? {
					onClick: handler,
			  }
			: {}
	) as DoubleTapResult<Target, Callback>;
}
