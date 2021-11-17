import { createSlice } from '@reduxjs/toolkit';
import {
	addUserDetailAction,
	cancelConfirmProofAction,
	confirmProofAction,
	fetchUserActivityAction,
	getImageProofAction,
	logoutAction,
} from '../actions';

export const userActivity = createSlice({
	name: 'userActivity',
	initialState: {
		value: [],
		loading: 0,
	},
	extraReducers: (builder) => {
		builder
			.addCase(addUserDetailAction, (state, action) => {
				const { uid, ...data } = action.payload;
				state.value = state.value.map((c) =>
					c.userId === uid ? { ...c, ...data } : c
				);
			})
			.addCase(getImageProofAction.fulfilled, (state, action) => {
				const { uid, acId, images } = action.payload;
				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, images } : d
						);
					}
					return c;
				});
				state.loading = state.loading - 1;
			})
			.addCase(fetchUserActivityAction.fulfilled, (state, action) => {
				state.value = action.payload;
				state.loading = state.loading - 1;
			})
			.addCase(confirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});

				state.loading = state.loading - 1;
			})
			.addCase(cancelConfirmProofAction.fulfilled, (state, action) => {
				const { uid, acId, confirm } = action.payload;

				state.value = state.value.map((c) => {
					if (c.userId === uid) {
						c.listData = c.listData.map((d) =>
							d.id === acId ? { ...d, confirm } : d
						);
					}
					return c;
				});
				state.loading = state.loading - 1;
			})
			.addCase(getImageProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchUserActivityAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(cancelConfirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(confirmProofAction.pending, (state) => {
				state.loading = state.loading + 1;
			})
			.addCase(fetchUserActivityAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(getImageProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(cancelConfirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(confirmProofAction.rejected, (state) => {
				state.loading = state.loading - 1;
			})
			.addCase(logoutAction, (state) => {
				state.value = [];
			});
	},
});
export default userActivity.reducer;
