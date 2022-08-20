/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import useSWRInfinite from "swr/infinite";
import { Item } from "../src/interface/app.interface";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { GetServerSideProps } from "next";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 12;

const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { user: string };

export default function Unsplash({ user }: Props) {
	const [repo, setRepo] = useState(user);
	const [val, setVal] = useState(repo);
	const [hasNextPage, setNextPage] = useState(true);

	const { data, error, size, setSize, isValidating } = useSWRInfinite(
		(index) =>
			`/api/photos?username=${repo}&p=${index + 1}&per_page=${PAGE_SIZE}`,
		fetcher
	);

	const photos = data ? [].concat(...data) : [];
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === "undefined");
	const isEmpty = data?.[0]?.length === 0;
	const isReachingEnd =
		isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
	const isRefreshing = isValidating && data && data.length === size;

	useEffect(() => {
		setNextPage(Boolean(!isReachingEnd));
	}, [isReachingEnd]);

	useEffect(() => {
		if (isLoadingMore) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}, [isLoadingMore]);

	const onLoadMore = () => {
		setSize((prev) => prev + 1);
	};

	const [albumRef] = useInfiniteScroll({
		loading: isValidating,
		disabled: !!error,
		onLoadMore,
		hasNextPage,
		rootMargin: `0px 0px 400px 0px`,
	});

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>@{user} – Unsplash statistics</title>
			</Head>

			<div className="wrapper">
				<div className="form">
					<input
						value={val}
						className="form-input"
						onChange={(e) => setVal(e.target.value)}
						placeholder="onlysiamak"
					/>
					<button
						className="form-button"
						onClick={() => {
							setRepo(val);
							setSize(1);
						}}
					>
						Show photos
					</button>
				</div>

				<div className="grid">
					{photos.map((photo: Item, i) => (
						<Photo i={i} item={photo} key={photo.id} />
					))}
				</div>

				<div className="pagination" ref={albumRef}>
					{isValidating && <div>Loading...</div>}
					<p>
						showing {size} page(s) of {isLoadingMore ? "..." : photos.length}{" "}
						photo(s){" "}
						<button
							disabled={isLoadingMore || isReachingEnd}
							onClick={() => setSize(size + 1)}
						>
							{isLoadingMore
								? "loading..."
								: isReachingEnd
								? "no more photos"
								: "load more"}
						</button>
						{/* <button disabled={isRefreshing} onClick={() => mutate()}>
							{isRefreshing ? "refreshing..." : "refresh"}
						</button>
						<button disabled={!size} onClick={() => setSize(0)}>
							clear
						</button> */}
					</p>
					{isEmpty ? <p>Yay, no photos found.</p> : null}
				</div>

				<div className="copyright">
					<span className="hr" />
					<div>
						Created by <a href="https://siamak.me">Siamak</a>.
					</div>
				</div>
			</div>
			<style jsx>{`
				.wrapper {
					width: 100%;

					padding: 4rem;
					margin-right: auto;
					margin-left: auto;
				}
				@media (max-width: 768px) {
					.wrapper {
						padding: 2rem 1rem;
					}
				}

				.form {
					display: flex;
					margin-top: 0.25rem;
					border-radius: 0.375rem;
					margin-bottom: 1rem;
				}

				.form-input {
					border: 0;
					background: #edf2f4;
					color: #19191c;
					padding: 0.5rem;
					border-top-left-radius: 0.375rem;
					border-bottom-left-radius: 0.375rem;
				}

				.form-button {
					border: 0;
					background: #edf2f4;
					color: #19191c;
					padding: 0.5rem;
					cursor: pointer;
					margin-left: 1px;
					border-top-right-radius: 0.375rem;
					border-bottom-right-radius: 0.375rem;
				}

				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
					flex-wrap: wrap;
					grid-gap: 2rem;
					grid-row-gap: 2rem;
					justify-content: center;
					align-items: start;
					min-height: 100vh;
				}

				.pagination {
					display: flex;
					justify-content: center;
					margin: 5rem 0 2rem;
					flex-direction: column;
					align-items: center;
				}

				.copyright {
					display: flex;
					justify-content: center;
					margin: 2rem 0;
					flex-direction: column;
					align-items: center;
				}

				.copyright a {
					color: #9677ff;
				}

				.hr {
					display: inline-flex;
					width: 4rem;
					height: 2px;
					margin-bottom: 1rem;
					background: rgba(255, 255, 255, 0.1);
				}

				@media (prefers-color-scheme: light) {
					.hr {
						background: rgba(0, 0, 0, 0.1);
					}
					.copyright a {
						color: #4114db;
					}
				}
			`}</style>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { username } = query;
	const user = username || "onlysiamak";
	return {
		props: {
			user,
		},
	};
};
