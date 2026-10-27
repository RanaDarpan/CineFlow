import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profiles: [],
    activeProfile: null,
    loading: true
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfiles: (state,action) => {
            state.profiles = action.payload;
            state.loading = false
        },
        setActiveProfile: (state, action) => {
            state.activeProfile = action.payload;
          },
        clearActiveProfile: (state,action) => {
            state.activeProfile = null
        },
        clearProfiles: (state,action) => {
            state.profiles = [];
            state.activeProfile = null;
            state.loading = true
        },
        updateProfileInList: (state, action) => {
            const updated = action.payload
      
            state.profiles = state.profiles.map(profile =>
              profile._id === updated._id ? updated : profile
            )

            if (state.activeProfile?._id === updated._id) {
              state.activeProfile = updated
            }
          },

        deleteProfileInList : (state,action) => {
            const deleteProfileId = action.payload
            state.profiles = state.profiles.filter(profile => profile._id != deleteProfileId)
            if (state.activeProfile?._id == deleteProfileId) {
                state.activeProfile = null
            }
        }
    }
})

export default profileSlice.reducer;

export const {setProfiles,setActiveProfile,clearActiveProfile,clearProfiles, updateProfileInList, deleteProfileInList} = profileSlice.actions