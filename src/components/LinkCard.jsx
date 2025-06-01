import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/useFetch";
import {deleteUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";

const LinkCard = ({url = [], fetchUrls}) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title; // Desired file name for the downloaded image

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

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row gap-6 border border-gray-700 p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code"
        className="h-32 w-32 object-contain ring ring-blue-500 rounded-md self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-1">
        <span className="text-2xl md:text-3xl font-extrabold hover:underline cursor-pointer truncate">
          {url?.title}
        </span>
        <span className="text-lg md:text-2xl text-blue-400 font-bold hover:underline cursor-pointer truncate">
          https://trimrr.in/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-300 hover:underline cursor-pointer truncate">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-xs text-gray-400 mt-auto truncate">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(`https://trimrr.in/${url?.short_url}`)
          }
          className="p-2"
          aria-label="Copy Link"
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage} className="p-2" aria-label="Download QR Code">
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
          className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete Link"
        >
          {loadingDelete ? <BeatLoader size={6} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
