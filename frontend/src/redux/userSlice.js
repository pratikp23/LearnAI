import { createSlice } from "@reduxjs/toolkit"

const getStoredUser = () => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

const initialUser = getStoredUser();

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: initialUser,
        loading: !initialUser && !!localStorage.getItem("token")
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            if (action.payload) {
                try {
                    localStorage.setItem("user", JSON.stringify(action.payload));
                } catch (e) {}
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;
