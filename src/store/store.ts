import { Store } from "laco";

type UserState = {
	username: string;
};
const UserStore = new Store({ username: "onlysiamak" });

type SettingState = {
	showTopics: boolean;
	sortBy: string;
};
const SettingStore = new Store({ showTopics: false, sortBy: "views" });

const setUser = (user: string) =>
	UserStore.set((state: UserState) => ({ username: user }));

// const setSetting = (setting: SettingState) =>
// 	SettingStore.set((state: SettingState) => ({ ...state, ...setting }));

const toggleShowTopics = () =>
	SettingStore.set((state: SettingState) => ({
		...state,
		showTopics: !state.showTopics,
	}));

const setSortBy = (sortBy: string) =>
	SettingStore.set((state: SettingState) => ({
		...state,
		sortBy,
	}));

export default UserStore;

export { setUser, toggleShowTopics, setSortBy, SettingStore };
