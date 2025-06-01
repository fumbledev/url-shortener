import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Error from './Error';
import * as yup from "yup";
import useFetch from "@/hooks/useFetch";
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/Context";
import {QRCode} from "react-qrcode-logo";

export function CreateLink() {
  const {user} = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues, user_id: user.id});

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, {abortEarly: false});

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="px-4 py-2">
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md space-y-6">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl mb-2">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <div className="flex justify-center mb-6">
            <QRCode ref={ref} size={250} value={formValues?.longUrl} />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Input
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <Error message={errors.title} />}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="longUrl"
            placeholder="Enter your Looong URL"
            value={formValues.longUrl}
            onChange={handleChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
          {errors.longUrl && <Error message={errors.longUrl} />}
        </div>

        <div className="flex items-center gap-2">
          <Card className="p-2 select-none">trimmit.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
            className="flex-grow focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <Error message={errors.message || error} />}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
            className="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create Short URL"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
