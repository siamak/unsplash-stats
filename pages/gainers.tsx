import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import useSWRInfinite from "swr/infinite";
import { Item } from "../src/interface/app.interface";
import { GetServerSideProps } from "next";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 12;

const Photo = dynamic(() => import("../src/components/photo.card"), {
	ssr: false,
});

type Props = { user: string };

export default function TopGainers({ user }: Props) {
	const [repo, setRepo] = useState(user);
	const [val, setVal] = useState(repo);

	const { data, setSize } = useSWRInfinite(
		(index) =>
			`/api/photos?username=${repo}&p=${
				index + 1
			}&per_page=${PAGE_SIZE}&type=top_gainers`,
		fetcher
	);

	const photos = data ? [].concat(...data) : [];

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
