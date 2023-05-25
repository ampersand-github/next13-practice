import "cropperjs/dist/cropper.css";
import Image from "next/image";
import { createRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

type EditFormProps = {
  image: File;
};

export const ImageCrops = () => {
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef<ReactCropperElement>();

  const onChange = (e: any) => {
    e.preventDefault();
    console.log(e.target.files);
    if (!e.target.files) return;
    setImage(e.target.files[0]);
  };

  async function convertDataUrlToFile(
    dataURL: string,
    filename: string
  ): Promise<File> {
    const blob = await (await fetch(dataURL)).blob();
    return new File([blob], filename);
  }

  const getCropData = async () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());

      const dataUrl = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      const file = await convertDataUrlToFile(dataUrl, "image.png");
      console.log("file", file);
    }
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <input type="file" onChange={onChange} />
        <Cropper
          ref={cropperRef}
          style={{ height: 400, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image && URL.createObjectURL(image)}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />
      </div>
      <div>
        <div
          className="box"
          style={{ width: "50%", float: "right", height: "300px" }}
        >
          <h1>
            <span>Crop</span>
            <button style={{ float: "right" }} onClick={getCropData}>
              Crop Image
            </button>
          </h1>
          <Image style={{ width: "100%" }} src={cropData} alt="cropped" />
        </div>
      </div>
      <br style={{ clear: "both" }} />
    </div>
  );
};
