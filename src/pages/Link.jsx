import DeviceStats from "@/components/DeviceStats";
import Location from "@/components/LocationStats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UrlState} from "@/Context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const {user} = UrlState();
  const {id} = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
  {(loading || loadingStats) && (
    <BarLoader className="mb-4" width="100%" color="#36d7b7" />
  )}
  <div className="flex flex-col gap-8 sm:flex-row justify-between items-start">
    <div className="flex flex-col gap-8 rounded-lg sm:w-2/5">
      <span className="text-5xl sm:text-6xl font-extrabold hover:underline cursor-pointer">
        {url?.title}
      </span>
      <a
        href={`https://trimrr.in/${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl sm:text-2xl text-blue-500 font-semibold hover:underline break-words"
      >
        https://trimrr.in/{link}
      </a>
      <a
        href={url?.original_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm sm:text-base text-gray-400 hover:underline break-all"
      >
        <LinkIcon className="w-5 h-5 p-1" />
        {url?.original_url}
      </a>
      <span className="flex items-end font-light text-xs sm:text-sm text-gray-500">
        {new Date(url?.created_at).toLocaleString()}
      </span>
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(`https://trimrr.in/${link}`)
          }
          className="p-2"
          aria-label="Copy short URL"
        >
          <Copy className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={downloadImage}
          className="p-2"
          aria-label="Download QR code"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            fnDelete().then(() => {
              navigate("/dashboard");
            })
          }
          disabled={loadingDelete}
          className="p-2"
          aria-label="Delete link"
        >
          {loadingDelete ? (
            <BeatLoader size={5} color="white" />
          ) : (
            <Trash className="w-5 h-5" />
          )}
        </Button>
      </div>
      <img
        src={url?.qr}
        alt="QR code"
        className="w-full max-w-xs sm:max-w-full self-center sm:self-start ring-2 ring-blue-500 p-1 object-contain rounded-md"
      />
    </div>

    <Card className="sm:w-3/5">
      <CardHeader>
        <CardTitle className="text-3xl sm:text-4xl font-extrabold">Stats</CardTitle>
      </CardHeader>
      {stats && stats.length ? (
        <CardContent className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-semibold">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg sm:text-xl">{stats.length}</p>
            </CardContent>
          </Card>

          <CardTitle className="text-2xl sm:text-3xl font-semibold mt-6">Location Data</CardTitle>
          <Location stats={stats} />
          <CardTitle className="text-2xl sm:text-3xl font-semibold mt-6">Device Info</CardTitle>
          <DeviceStats stats={stats} />
        </CardContent>
      ) : (
        <CardContent className="text-center text-gray-500 text-base sm:text-lg">
          {loadingStats === false ? "No Statistics yet" : "Loading Statistics..."}
        </CardContent>
      )}
    </Card>
  </div>
</>

  );
};

export default LinkPage;