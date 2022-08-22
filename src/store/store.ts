import { Store } from "laco";

type UserState = {
	username: string;
};
const UserStore = new Store({ username: "onlysiamak" });

const setUser = (user: string) =>
	UserStore.set((state: UserState) => ({ username: user }));

export default UserStore;

export { setUser };
