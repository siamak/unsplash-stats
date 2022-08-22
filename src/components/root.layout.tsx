import React, { useEffect, useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import Image from "next/image";
import { useStore } from "laco-react";
import UserStore, { setUser } from "../store/store";
import Link from "next/link";

type Props = {
	children: React.ReactNode;
	user: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout = ({ children, user }: Props) => {
	const state = useStore(UserStore);
	const [val, setVal] = useState(state.username);

	const { data, error } = useSWR(
		`/api/profile?username=${state.username}`,
		fetcher
	);

	useEffect(() => {
		setUser(user);
	}, [user]);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>@{user} – Unsplash statistics</title>
			</Head>

			<section className="wrapper">
				<div className="grid">
					<Link className="logo" href={"/"}>
						<a>
							<h1 className="logo-name">Unsplash Stats</h1>
						</a>
					</Link>
					<div className="center">
						<div className={!!val ? "form valid" : "form"}>
							<input
								value={val}
								onChange={(e) => setVal(e.target.value)}
								placeholder="onlysiamak"
							/>
							<button
								onClick={() => {
									setUser(val);
								}}
							>
								<span className="default">Show photos</span>
							</button>
						</div>
					</div>

					<div className="menu">
						<Link className="menu-link" href={"/"}>
							<a>
								<span>Overall</span>
							</a>
						</Link>

						<Link className="menu-link" href={"/popular"}>
							<a>
								<span>Popular</span>
							</a>
						</Link>

						<Link
							className="menu-link"
							href={"https://siamak.me"}
							target="_blank"
						>
							<a>
								<span>Creator</span>
							</a>
						</Link>
					</div>
				</div>
				<section className="header">
					{error && <div>failed to load</div>}
					{!data && <div>Loading...</div>}

					{data && (
						<>
							<div className="avatar">
								<Image
									alt={`${data.username}`}
									width={64}
									height={64}
									src={data.profile_image}
									objectFit="cover"
								/>
							</div>

							<h1 className="header-name">
								{data.first_name} {data.last_name}
							</h1>

							<h3 className="header-username">@{data.username}</h3>
							<p className="header-bio">
								{data.bio}
								{data.location && (
									<span className="header-location">{data.location}</span>
								)}
							</p>

							{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
						</>
					)}
				</section>

				{children}

				<div className="copyright">
					<span className="hr" />
					<div>
						Created by <a href="https://siamak.me">Siamak</a>.
					</div>
				</div>
			</section>

			<style jsx>{`
				.grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(375px, 1fr));
					flex-wrap: wrap;
					grid-gap: 1rem;
					justify-content: center;
					align-items: center;
					margin: 2rem 0;
				}

				@media (max-width: 768px) {
					.logo-name {
						text-align: center;
					}
					.menu {
						justify-content: center !important;
					}
				}

				.center {
					display: flex;
					justify-content: center;
				}

				.menu {
					display: flex;
					justify-content: flex-end;
					gap: 1.5rem;
				}

				.menu a {
					transition: opacity 500ms;
				}
				.menu a:hover {
					opacity: 0.5;
				}
				.logo-name {
					margin: 0;
				}

				.header {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 4rem 0;
				}
				.header-name {
					font-size: 2rem;
					margin: 0.25em 0 0;
				}

				.header-username {
					font-size: 1rem;
					margin: 0.5em 0 0.5em;
					opacity: 0.85;
				}

				.header-bio {
					font-size: 0.85rem;
					margin: 0 0;
					opacity: 0.75;
				}

				.header-location {
					padding-left: 0.25rem;
				}

				.header .avatar {
					width: 64px;
					height: 64px;
					border-radius: 64px;
					overflow: hidden;
				}
				.wrapper {
					width: 100%;

					padding: 0 4rem;
					margin-right: auto;
					margin-left: auto;
				}

				@media (max-width: 768px) {
					.wrapper {
						padding: 2rem 1rem;
					}
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
					background: rgba(255, 255, 255, 0.12);
				}

				@media (prefers-color-scheme: light) {
					.hr {
						background: rgba(0, 0, 0, 0.1);
					}
					.copyright a {
						color: #4114db;
					}
				}

				.form {
					--primary: #275efe;
					--primary-dark: #2055ee;
					--primary-darkest: #133fc0;
					--input-placeholder: #a6accd;
					--input-text: #646b8c;
					--border-default: #e1e6f9;
					--border-active: #275efe;
					--background: #fff;
					--button-text: #ffffff;
					--success: #275efe;
					--trails: #{rgba(#275efe, 0.15)};
					display: flex;
					align-items: center;
					width: 100%;
					background: var(--background);
					box-shadow: inset 0 0 0 var(--border-width, 1px)
						var(--border, var(--border-default));
					border-radius: 9px;
					padding-right: 4px;
					transition: box-shadow 0.25s;
				}
				input,
				button {
					-webkit-appearance: none;
					background: none;
					outline: none;
					display: block;
					border: none;
					font-family: inherit;
					font-size: 14px;
					line-height: 24px;
					margin: 0;
				}
				input {
					width: 100%;
					flex-grow: 1;
					padding: 12px 12px 12px 16px;
					color: var(--input-text);
					font-weight: 400;
				}
				input::placeholder {
					color: var(--input-placeholder);
				}
				button {
					--text-opacity: 1;
					--success-x: -12px;
					--success-stroke: 14px;
					--success-opacity: 0;
					--border-radius: 7px;
					--overflow: hidden;
					--x: 0px;
					--y: 0px;
					--rotate: 0deg;
					--plane-x: 0px;
					--plane-y: 0px;
					--plane-opacity: 1;
					--trails-stroke: 57px;
					--left-wing-background: var(--primary);
					--left-wing-first-x: 0%;
					--left-wing-first-y: 0%;
					--left-wing-second-x: 50%;
					--left-wing-second-y: 0%;
					--left-wing-third-x: 0%;
					--left-wing-third-y: 100%;
					--left-body-background: var(--primary);
					--left-body-first-x: 50%;
					--left-body-first-y: 0%;
					--left-body-second-x: 50%;
					--left-body-second-y: 100%;
					--left-body-third-x: 0%;
					--left-body-third-y: 100%;
					--right-wing-background: var(--primary);
					--right-wing-first-x: 50%;
					--right-wing-first-y: 0%;
					--right-wing-second-x: 100%;
					--right-wing-second-y: 0%;
					--right-wing-third-x: 100%;
					--right-wing-third-y: 100%;
					--right-body-background: var(--primary);
					--right-body-first-x: 50%;
					--right-body-first-y: 0%;
					--right-body-second-x: 50%;
					--right-body-second-y: 100%;
					--right-body-third-x: 100%;
					--right-body-third-y: 100%;
					position: relative;
					padding: 8px 0;
					min-width: 100px;
					text-align: center;
					font-weight: 600;
					opacity: var(--button-opacity, 0.5);
					cursor: var(--button-cursor, not-allowed);
					filter: var(--button-filter, grayscale(65%));
					color: var(--button-text);
					border-radius: var(--border-radius);
					transform: translateZ(0);
					transition: opacity 0.25s, filter 0.25s;
					-webkit-tap-highlight-color: transparent;
				}

				button:not(.active) {
					background: var(--primary);
				}

				form:focus-within {
					--border-width: 1.5px;
					--border: var(--border-active);
				}

				.form.valid {
					--button-opacity: 1;
					--button-cursor: pointer;
					--button-filter: grayscale(0%);
				}
			`}</style>
		</>
	);
};

export default Layout;
