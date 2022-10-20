import { useStore } from "laco-react";
import React, { memo, useCallback } from "react";
import { setSortBy, SettingStore } from "../store/store";

function Tabs() {
	const setting = useStore(SettingStore);
	const { sortBy } = setting;
	const onChanged = useCallback((e: any) => {
		setSortBy(e.target.value);
	}, []);

	return (
		<div className="c-sc">
			<ul>
				<li className={sortBy === "latest" ? "active" : ""}>
					<input
						onChange={onChanged}
						id="latest"
						value="latest"
						type="radio"
						name="sort"
					/>
					<label htmlFor="latest">Latest</label>
				</li>
				<li className={sortBy === "views" ? "active" : ""}>
					<input
						onChange={onChanged}
						id="views"
						value="views"
						type="radio"
						name="sort"
					/>
					<label htmlFor="views">Views</label>
				</li>
				<li className={sortBy === "downloads" ? "active" : ""}>
					<input
						onChange={onChanged}
						id="downloads"
						value="downloads"
						type="radio"
						name="sort"
					/>
					<label htmlFor="downloads">Downloads</label>
				</li>
			</ul>
		</div>
	);
}

export default memo(Tabs);
