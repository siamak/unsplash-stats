import React from "react";
import Head from "next/head";
import useSWR from "swr";
import Image from "next/image";

type Props = {
	children: React.ReactNode;
	user: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout = ({ children, user }: Props) => {
	const { data, error } = useSWR(`/api/profile?username=${user}`, fetcher);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>@{user} – Unsplash statistics</title>
			</Head>

			<section className="wrapper">
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
				.header {
					margin-bottom: 2rem;
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

					padding: 4rem;
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
			`}</style>
		</>
	);
};

export default Layout;
