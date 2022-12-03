import { decode } from "blurhash";
import { Canvas, createCanvas } from "canvas";
import { useLayoutEffect, useRef, useState } from "react";

export default function useBlurData(
	blurHash: string,
	width: number = 160,
	height: number = 120,
	punch?: number
) {
	const [blurDataUrl, setDataUrl] = useState("");
	const canvas = useRef<Canvas>();

	useLayoutEffect(() => {
		if (blurHash) {
			let pixels, ctx, imageData;
			pixels = decode(blurHash, width, height, punch);
			canvas.current = createCanvas(width, height);
			ctx = canvas.current.getContext("2d");
			imageData = ctx.createImageData(width, height);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);
			setDataUrl(canvas.current.toDataURL());
		}
	}, [canvas, blurHash, width, height, punch]);

	return [blurDataUrl];
}
