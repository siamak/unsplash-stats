import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import useSWRInfinite from "swr/infinite";
import { Item } from "../src/interface/app.interface";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { GetServerSideProps } from "next";
import { useStore } from "laco-react";
import UserStore, { setUser } from "../src/store/store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 12;

const Layout = dynamic(() => import("../src/components/root.layout"), {
	ssr: true,
});
const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { user: string };

export default function Unsplash({ user }: Props) {
	const state = useStore(UserStore);

	const [hasNextPage, setNextPage] = useState(true);

	const { data, error, size, setSize, isValidating } = useSWRInfinite(
		(index) =>
			`/api/photos?username=${state.username}&p=${
				index + 1
			}&per_page=${PAGE_SIZE}`,
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
	// const isRefreshing = isValidating && data && data.length === size;

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

	useEffect(() => {
		setUser(user);
	}, [user]);

	const [ref] = useInfiniteScroll({
		loading: isValidating,
		disabled: !!error,
		onLoadMore,
		hasNextPage,
		rootMargin: `0px 0px 400px 0px`,
	});

	return (
		<Layout user={user}>
			<div className="grid">
				{photos.map((photo: Item, i) => (
					<Photo i={i} item={photo} key={photo.id} />
				))}
			</div>

			<div className="pagination" ref={ref}>
				<p>
					showing {size} page(s) of {isLoadingMore ? "..." : photos.length}{" "}
					photo(s)
					{/* <button disabled={isRefreshing} onClick={() => mutate()}>
							{isRefreshing ? "refreshing..." : "refresh"}
						</button>
						<button disabled={!size} onClick={() => setSize(0)}>
							clear
						</button> */}
				</p>
				<button
					disabled={isLoadingMore || isReachingEnd}
					onClick={() => setSize(size + 1)}
					className="btn"
				>
					{isLoadingMore
						? "Loading..."
						: isReachingEnd
						? "No More Photos"
						: "Load More"}
				</button>

				{isEmpty ? <p>Yay, no photos found.</p> : null}
			</div>
			<style jsx>{`
				.btn {
					background-color: #141414;
					border: 1px solid rgba(54, 54, 54, 0.6);
					opacity: 1;
					font-weight: 500;
					position: relative;
					outline: none;
					border-radius: 50px;
					padding: 1rem;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					margin-top: 0.5rem;
				}

				@media (prefers-color-scheme: light) {
					.btn {
						background: rgba(100, 100, 100, 0.1);
						border-color: rgba(0, 0, 0, 0.1);
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
			`}</style>
		</Layout>
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
