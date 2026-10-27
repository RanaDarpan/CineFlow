import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from "./store/store.js"
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { createBrowserRouter, Navigate } from 'react-router'
import MoviePage from "./pages/Movie/MoviePage.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { RouterProvider } from 'react-router'
import ProfileSelectPage from "./pages/Profile/ProfileSelectPage.jsx"
import  ProfileCreate from './pages/Profile/ProfileCreatePage.jsx'
import AddMovie from './pages/Movie/AddMoviePage.jsx'
import AllMoviePage from './pages/Movie/AllMoviePage.jsx'
import SelectedMoviePage from "./pages/Movie/SelectedMovie.jsx"
import UpdateMoviePage from './pages/Movie/UpdateMoviePage.jsx'
import SeriesPage from './pages/Series/SeriesPage.jsx'
import AddSeriesPage from './pages/Series/AddSeriesPage.jsx'
import AllSeriesPage from './pages/Series/AllSeriesPage.jsx'
import SelectedSeriesPage from './pages/Series/SelectedSeriesPage.jsx'
import AddSeasonPage from './pages/Series/Season/AddSeasonPage.jsx'
import UpdateSeriesPage from './pages/Series/UpdateSeriesPage.jsx'
import AllSeasonPage from './pages/Series/Season/AllSeasonPage.jsx'
import SelectedSeasonPage from "./pages/Series/Season/SelectedSeasonPage.jsx"
import AddEpisodePage from './pages/Series/Season/Episode/AddEpisodePage.jsx'
import AllEpisodePage from './pages/Series/Season/Episode/AllEpisodePage.jsx'
import UpdateSeasonPage from './pages/Series/Season/UpdateSeasonPage.jsx'
import SelectEpisodePage from './pages/Series/Season/Episode/SelectEpisodePage.jsx'
import UpdateEpisodePage from './pages/Series/Season/Episode/UpdateEpisodePage.jsx'
import AddCommentPage from './pages/Review/AddCommentPage.jsx'
import MyReviewsPage from './pages/Review/MyReviewsPage.jsx'
import UpdateCommentPage from './pages/Review/UpdateCommentPage.jsx'
import AllHistoryPage from './pages/WatchHistory/AllHistoryPage.jsx'
import ContinueWatchingWatchHistoryPage from './pages/WatchHistory/ContinueWatchingWatchHistory.jsx'
import WatchedWatchHistoryPage from './pages/WatchHistory/WatchedWatchHistoryPage.jsx'
import WatchListPage from './pages/WatchListPage.jsx'
import ProfileProtectedRoute from './components/profile/ProfileProtectedRoute.jsx'
import AdminGenresPage from './components/genre/Genre.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import IsSubscribed from './components/IsSubscribed.jsx'
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />
      },
      {
        path: "/login",
        element: 
        (
        <Login />
        )
      },
      {
        path: "/signup",
        element: 
        (
        <SignUp />
        )
      },
      {
        path: "/profile-select",
        element:
        (
          <ProtectedRoute>
            <IsSubscribed>
          <ProfileSelectPage />
          </IsSubscribed>
          </ProtectedRoute>
        )
      },
      {
        path: "/create-profile",
        element:
        (
          <ProtectedRoute>
            <IsSubscribed>
          <ProfileCreate />
          </IsSubscribed>
          </ProtectedRoute>
        )
      },
      {
        path: "/:profile_id/movies",
        element:
        (
          <ProtectedRoute>
            <IsSubscribed>
          <ProfileProtectedRoute>
          <MoviePage />
          </ProfileProtectedRoute>
          </IsSubscribed>
          </ProtectedRoute>
        )
      },
      {
          path: "/:profile_id/movies/add-movies",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AddMovie />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/movies/all-movies",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AllMoviePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/movies/:movie_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <SelectedMoviePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/movies/update-movie/:movie_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <UpdateMoviePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series",
          element:
          (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <SeriesPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/add-series",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AddSeriesPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/all-series",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AllSeriesPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <SelectedSeriesPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
              path: "/:profile_id/series/:series_id/seasons/add-season",
              element: (
                <ProtectedRoute>
                  <IsSubscribed>
                  <ProfileProtectedRoute>
                  <AddSeasonPage />
                  </ProfileProtectedRoute>
                  </IsSubscribed>
                </ProtectedRoute>
              )
        },
        {
          path: "/:profile_id/series/:series_id/update-series",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <UpdateSeriesPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/seasons/all-season",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AllSeasonPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <SelectedSeasonPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id/episodes/add-episode",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AddEpisodePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id/episodes/all-episode",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AllEpisodePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id/update-season",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <UpdateSeasonPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id/episodes/:episode_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <SelectEpisodePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/series/:series_id/season/:season_id/episodes/update-episode/:episode_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <UpdateEpisodePage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/comments/add-comment/:type/:id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AddCommentPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/my-reviews",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <MyReviewsPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/comments/update-comment/:review_id",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <UpdateCommentPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/watch-history/all",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AllHistoryPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/watch-history/continue",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <ContinueWatchingWatchHistoryPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/watch-history/watched",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <WatchedWatchHistoryPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/:profile_id/watchList",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <WatchListPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
         {
          path: "/:profile_id/genre",
          element: (
            <ProtectedRoute>
              <IsSubscribed>
              <ProfileProtectedRoute>
              <AdminGenresPage />
              </ProfileProtectedRoute>
              </IsSubscribed>
            </ProtectedRoute>
          )
        },
        {
          path: "/subscriptions",
          element: (
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          )
        },
        {
          path: "*",
          element: (
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          )
        }
    ]
  } 
]
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
