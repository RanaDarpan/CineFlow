import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    series: {
      byId: {},
      allIds: [],
      activeIds: []
    },
  
    seasons: {
      byId: {},
      allIds: [],
      bySeriesId: {},
      activeIds: []
    },
  
    episodes: {
      byId: {},
      allIds: [],
      bySeasonId: {},
      activeIds: []
    },
  
    watchHistory: {
      byEpisodeId: {
        "e1": {
          episodeId: "m1",
          progress: 612,
          lastWatchedAt: "2025-01-10T18:40:00Z",
          completed: false
        },
        "e2": {
          episodeId: "m2",
          progress: 120,
          lastWatchedAt: "2025-01-09T22:10:00Z",
          completed: true
        }
      },
      allIds: ["e1", "e2"]
    },

    watchlistIds: []
  };

  export const seriesSlice = createSlice({
    name: "series",
    initialState,
    reducers: {
      upsertSeries(state, action) {
            const series = action.payload;
            const id = series._id;
          
            state.series.byId[id] = series;
          
            if (!state.series.allIds.includes(id)) {
              state.series.allIds.push(id);
            }
          
            if (series.active) {
              if (!state.series.activeIds.includes(id)) {
                state.series.activeIds.push(id);
              }
            } else {
              state.series.activeIds =
                state.series.activeIds.filter(sid => sid !== id);
            }
          },

          upsertManySeries(state, action) {
            action.payload.map(s => {
              state.series.byId[s._id] = s;
      
              if (!state.series.allIds.includes(s._id)) {
                state.series.allIds.push(s._id);
              }

              if (s.active) {
                if (!state.series.activeIds.includes(s._id)) {
                  state.series.activeIds.push(s._id);
                }
              } else {
                state.series.activeIds =
                  state.series.activeIds.filter(sid => sid !== s._id);
              }
            });
          },   

        upsertSeason(state, action) {
            const season = action.payload;
            state.seasons.byId[season._id] = season;
          
            if (!state.seasons.allIds.includes(season._id)) {
              state.seasons.allIds.push(season._id);
            }
          
            const seriesId = season.seriesId || season.series_id;
            if (!state.seasons.bySeriesId[seriesId]) {
              state.seasons.bySeriesId[seriesId] = [];
            }

            if (!state.seasons.bySeriesId[seriesId].includes(season._id)) {
              state.seasons.bySeriesId[seriesId].push(season._id);
            }

            if (season.active) {
              if (!state.seasons.activeIds.includes(season._id)) {
                state.seasons.activeIds.push(season._id);
              }
            } else {
              state.seasons.activeIds =
                state.seasons.activeIds.filter(sid => sid !== season._id);
            }
          },

          upsertManySeason(state, action) {
            action.payload.forEach(season => {
              state.seasons.byId[season._id] = season;
      
              if (!state.seasons.allIds.includes(season._id)) {
                state.seasons.allIds.push(season._id);
              }

            const seriesId = season.seriesId || season.series_id;
            if (!state.seasons.bySeriesId[seriesId]) {
              state.seasons.bySeriesId[seriesId] = [];
            }

            if (!state.seasons.bySeriesId[seriesId].includes(season._id)) {
              state.seasons.bySeriesId[seriesId].push(season._id);
            }

              if (season.active) {
                if (!state.seasons.activeIds.includes(season._id)) {
                  state.seasons.activeIds.push(season._id);
                }
              } else {
                state.seasons.activeIds =
                  state.seasons.activeIds.filter(sid => sid !== season._id);
              }
            });
          },   

          upsertEpisode(state, action) {
            const ep = action.payload;
            state.episodes.byId[ep._id] = ep;
          
            if (!state.episodes.allIds.includes(ep._id)) {
              state.episodes.allIds.push(ep._id);
            }
          
            const seasonId = ep.seasonId || ep.season_id;
            if (!state.episodes.bySeasonId[seasonId]) {
              state.episodes.bySeasonId[seasonId] = [];
            }
          

            if (!state.episodes.bySeasonId[seasonId].includes(ep._id)) {
              state.episodes.bySeasonId[seasonId].push(ep._id);
            }

            if (ep.active) {
              if (!state.episodes.activeIds.includes(ep._id)) {
                state.episodes.activeIds.push(ep._id);
              }
            } else {
              state.episodes.activeIds =
                state.episodes.activeIds.filter(sid => sid !== ep._id);
            }
          },

          upsertManyEpisode(state, action) {
            action.payload.forEach(episode => {
              state.episodes.byId[episode._id] = episode;
      
              if (!state.episodes.allIds.includes(episode._id)) {
                state.episodes.allIds.push(episode._id);
              }

              const seasonId = episode.seasonId || episode.season_id;
              if (episode.active) {
                if (!state.episodes.activeIds.includes(episode._id)) {
                  state.episodes.activeIds.push(episode._id);
                }
              } else {
                state.episodes.activeIds =
                  state.episodes.activeIds.filter(sid => sid !== episode._id);
              }
            });
          },   

          removeEpisode(state, action) {
            const episodeId = action.payload;
            const ep = state.episodes.byId[episodeId];
            if (!ep) return;
          
            delete state.episodes.byId[episodeId];
            state.episodes.allIds = state.series.episodes.allIds.filter(id => id !== episodeId);
          
            state.episodes.bySeasonId[ep.seasonId] =
              state.episodes.bySeasonId[ep.seasonId].filter(id => id !== episodeId);

            state.episodes.activeIds = state.episodes.activeIds.filter(id => id !== episodeId)
          
            if(state.watchHistory.byEpisodeId){
              delete state.watchHistory.byEpisodeId[episodeId];
            }
          },
          
          removeSeason(state, action) {
            const seasonId = action.payload;
            const season = state.seasons.byId[seasonId];
            if (!season) return;
          
            const episodeIds = state.episodes.bySeasonId[seasonId] || [];
          
            episodeIds.forEach(epId => {
              delete state.episodes.byId[epId];
              if(state.watchHistory.byEpisodeId){
                delete state.watchHistory.byEpisodeId[epId];
              }
              state.episodes.allIds = state.episodes.allIds.filter(id => id !== epId);
            });
          
            state.seasons.activeIds = state.seasons.activeIds.filter(id => id !== seasonId)

            delete state.episodes.bySeasonId[seasonId];
          
            delete state.seasons.byId[seasonId];
            state.seasons.allIds = state.seasons.allIds.filter(id => id !== seasonId);


          
            state.seasons.bySeriesId[season.seriesId] =
              state.seasons.bySeriesId[season.seriesId].filter(id => id !== seasonId);
          },
          
          removeSeries(state, action) {
            const seriesId = action.payload;
          
            state.series.activeIds = state.series.activeIds.filter(id => id !== seriesId)

            const seasonIds = state.seasons.bySeriesId[seriesId] || [];
          
            seasonIds.forEach(seasonId => {
              const episodeIds = state.episodes.bySeasonId[seasonId] || [];


            state.watchlistIds = state.watchlistIds.filter(
              id => id !== action.payload
            );

          
              episodeIds.forEach(epId => {
                delete state.episodes.byId[epId];
                if(state.watchHistory.byEpisodeId){
                  delete state.watchHistory.byEpisodeId[epId];
                }
                state.episodes.allIds = state.episodes.allIds.filter(id => id !== epId);
              });
          
              delete state.episodes.bySeasonId[seasonId];
              delete state.seasons.byId[seasonId];
              state.seasons.allIds = state.seasons.allIds.filter(id => id !== seasonId);
            });
          
            delete state.seasons.bySeriesId[seriesId];
          
            delete state.series.byId[seriesId];
            state.series.allIds = state.series.allIds.filter(id => id !== seriesId);
          },

          addToWatchlist(state, action) {
            const seriesId = action.payload;
            if (!state.watchlistIds.includes(seriesId)) {
              state.watchlistIds.push(seriesId);
            }
          },
      
          removeFromWatchlist(state, action) {
            state.watchlistIds = state.watchlistIds.filter(
              id => id !== action.payload
            );
          },

          updateWatchHistory(state, action) {
        const { episodeId, progress, duration } = action.payload;

        if (!state.watchHistory) {
          state.watchHistory = { byEpisodeId: {}, allIds: [] };
        }

        if (!state.watchHistory.byEpisodeId) {
          state.watchHistory.byEpisodeId = {};
        }

        if (!state.watchHistory.allIds) {
          state.watchHistory.allIds = [];
        }

        const completed = progress >= duration * 0.95;

        if (!state.watchHistory.byEpisodeId[episodeId]) {
          state.watchHistory.allIds.push(episodeId);
        }

        state.watchHistory.byEpisodeId[episodeId] = {
          episodeId,
          progress,
          completed,
          lastWatchedAt: new Date().toISOString()
        };
      }

          
          
    }
  })
  

  export default seriesSlice.reducer;
  export const {upsertSeries, upsertSeason, upsertEpisode, updateWatchHistory, upsertManySeries, upsertManySeason, upsertManyEpisode, removeSeries, removeEpisode, removeSeason, addToWatchlist, removeFromWatchlist} = seriesSlice.actions

    export const selectSeasonsBySeries = (state, seriesId) =>
    (state.series.seasons.bySeriesId[seriesId] || [])
      .map(id => state.series.seasons.byId[id]);
      
      export const selectSeasonById = (state, seasonId) =>
        state.series.seasons.byId[seasonId];     

    export const selectEpisodesBySeason = (state, seasonId) =>
        (state.series.episodes.bySeasonId[seasonId] || [])
          .map(id => state.series.episodes.byId[id]);

    export const selectEpisodeById = (state, episodeId) =>
        state.series.episodes.byId[episodeId];

    export const selectActiveSeries = (state) => (
      state.series.series.activeIds.map(id => state.series.series.byId[id])
    )

    export const selectActiveSeason = (state) => (
      state.series.seasons.activeIds.map(id => state.series.seasons.byId[id])
    )

    export const selectSeriesById = (state,seriesId) => (
      state.series.series.byId[seriesId]
    )

    export const selectIsInWatchlist = (state, id) =>
      state.series.watchlistIds.includes(id);
          
    export const selectAllSeries = (state) =>
      state.series.series.allIds.map(id => state.series.series.byId[id]);

    export const selectActiveSeasonsBySeries = (state, seriesId) =>
      (state.series.seasons.bySeriesId[seriesId] || [])
        .map(id => state.series.seasons.byId[id]).filter(season => season?.active===true);
    
    export const selectActiveEpisodesBySeason = (state, seasonId) =>
      (state.series.episodes.bySeasonId[seasonId] || [])
        .map(id => state.series.episodes.byId[id]).filter(episode => episode?.active === true);

    export const selectWatchHistoryMovies = (state) =>
      state.series.watchHistory.allIds
        .map(id => ({
         ...state.series.episodes.byId[id],
          ...state.series.watchHistory.byEpisodeId[id]
          }))
          .sort((a, b) =>
                new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
            );
        
    export const selectWatchProgress = (state, episodeId) =>
      state.series.watchHistory?.byEpisodeId?.[episodeId]?.progress || 0;