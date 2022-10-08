import { Store } from "laco";

type UserState = {
	username: string;
};
const UserStore = new Store({ username: "onlysiamak" });

type SettingState = {
	showTopics: boolean;
};
const SettingStore = new Store({ showTopics: false });

const setUser = (user: string) =>
	UserStore.set((state: UserState) => ({ username: user }));

// const setSetting = (setting: SettingState) =>
// 	SettingStore.set((state: SettingState) => ({ ...state, ...setting }));

const toggleShowTopics = () =>
	SettingStore.set((state: SettingState) => ({
		...state,
		showTopics: !state.showTopics,
	}));

export default UserStore;

export { setUser, toggleShowTopics, SettingStore };
