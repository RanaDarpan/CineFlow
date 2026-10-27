import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router";

import { useEffect, useRef, useState } from "react";
import Button from "../Button";

import getEpisode from "../../axios/getEpisodeAPI"
import deleteEpisodeAPI from "../../axios/deleteEpisodeAPI"

import createORupdateWatchHistory from "../../axios/createORupdateWatchHistoryAPI";
import { removeEpisode, selectEpisodeById, selectWatchProgress,  updateWatchHistory, upsertEpisode} from "../../slices/seriesSlice";

export default function selectEpisode() {
  const { series_id, season_id, episode_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const episode = useSelector(state => selectEpisodeById(state, episode_id));
  const savedProgress = useSelector(state => selectWatchProgress(state, episode_id));
  console.log(savedProgress)

  const { activeProfile } = useSelector(state => state.profile);
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.type === true;
  const profile_id = activeProfile._id

  const videoRef = useRef(null);
  const lastUpdate = useRef(0);

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);


  useEffect(() => {
    if (!episode) {
      (async () => {
        try {
          const res = await getEpisode(profile_id,series_id,season_id,episode_id);
          dispatch(upsertEpisode(res));
        } catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        }
      })();
    }
  }, [episode_id, episode, dispatch]);

  if (!episode) return <p>Loading movie...</p>;
  if (!episode.video) return <p>Video unavailable</p>;

  const location = useLocation();
  const historyProgress = location.state?.progress; // Percentage from WatchHistory

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    let startProgress = 0;
    
    // Priority 1: Navigation State (from Watch History)
    if (historyProgress) {
        startProgress = (historyProgress / 100) * videoRef.current.duration;
    } 
    // Priority 2: Redux/LocalStorage (Last session)
    else if (savedProgress > 5 && savedProgress < videoRef.current.duration * 0.95) {
        startProgress = savedProgress;
    }

    if (startProgress > 0) {
        videoRef.current.currentTime = startProgress;
    }
  };

  const saveWatchProgress = async (force = false) => {
    const video = videoRef.current;
    if (!video) return;

    const now = Date.now();
    if (!force && now - lastUpdate.current < 5000) return;

    lastUpdate.current = now;
    console.log(video.currentTime)
    dispatch(
      updateWatchHistory({
        episodeId: episode_id,
        progress: video.currentTime,
        duration: video.duration,
        lastWatchedAt: new Date().toISOString()
      })
    );
  
    let data = {
      content_type: "Episodes",
      content_id: episode_id,
      progress_percentage: (video.currentTime/video.duration)*100
    }
    await createORupdateWatchHistory(activeProfile._id, data);
  };

  const handleEnded = async () => {
    const video = videoRef.current;

    dispatch(
      updateWatchHistory({
        episodeId: episode._id,
        progress: video.duration,
        duration: video.duration,
        lastWatchedAt: new Date().toISOString()
      })
    );

    let data = {
      "content-type": "Episodes",
      "content-id": episode._id,
      "progress_percentage": (video.currentTime/video.duration)*100
    }
    await createORupdateWatchHistory(activeProfile._id, data);
  };

 

  const deleteEpisode = async () => {
    try {
      setLoading(true);
      await deleteEpisodeAPI(activeProfile._id, series_id, season_id, episode_id);
      dispatch(removeEpisode(episode_id));
      navigate(`${profile_id}/series/${series_id}/seasons/${season_id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      {isAdmin && (
        <>
          <Button onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season_id}/episodes/add-episode`)}>Add Episode</Button>
          <Button onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season_id}/episodes/update-episode/${episode._id}`)}>
            Update Episode
          </Button>
          <Button onClick={() => setConfirm(true)}>Delete Episode</Button>
        </>
      )}

      {confirm && (
        <div className="modal">
          <p>Delete episode permanently?</p>
          <Button onClick={deleteEpisode} disabled={loading}>
            {loading ? "Deleting..." : "Yes"}
          </Button>
          <Button onClick={() => setConfirm(false)}>Cancel</Button>
        </div>
      )}

      <h2>{episode.title}</h2>

      <video
        ref={videoRef}
        controls
        width="100%"
        src={episode.video.hls_master_url}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={() => saveWatchProgress(false)}
        onPause={() => saveWatchProgress(true)}
        onEnded={handleEnded}
      />

      <p>Episode No: {episode.episode_no}</p>
      <p>{episode.description}</p>
      <p>Release date: {episode.r_date}</p>
    </>
  );
}
